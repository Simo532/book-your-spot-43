import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Monitor, Building2, ToggleLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type SlotMode = 'cabinet' | 'online' | 'both' | 'off';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

// Generate 30-min slots from 08:00 to 23:30
const generateSlots = (): string[] => {
  const slots: string[] = [];
  for (let h = 8; h <= 23; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 23 || true) slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  // Remove 24:00 if it exists, keep up to 23:30
  return slots.filter(s => s <= '23:30');
};

const TIME_SLOTS = generateSlots();

type DayAvailability = Record<string, SlotMode>;
type WeekAvailability = Record<string, { enabled: boolean; slots: DayAvailability }>;

const initWeek = (): WeekAvailability => {
  const week: WeekAvailability = {};
  DAYS.forEach(day => {
    const slots: DayAvailability = {};
    TIME_SLOTS.forEach(slot => { slots[slot] = 'cabinet'; });
    week[day] = { enabled: true, slots };
  });
  return week;
};

const MODE_COLORS: Record<SlotMode, string> = {
  cabinet: 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/25',
  online: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
  both: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  off: 'bg-muted text-muted-foreground border-border hover:bg-muted/80 opacity-50',
};

const MODE_CYCLE: SlotMode[] = ['cabinet', 'online', 'both', 'off'];

const AvailabilityManager = () => {
  const { t } = useTranslation();
  const [week, setWeek] = useState<WeekAvailability>(initWeek);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);

  const toggleDayEnabled = (day: string) => {
    setWeek(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const cycleSlotMode = (day: string, slot: string) => {
    setWeek(prev => {
      const current = prev[day].slots[slot];
      const idx = MODE_CYCLE.indexOf(current);
      const next = MODE_CYCLE[(idx + 1) % MODE_CYCLE.length];
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: { ...prev[day].slots, [slot]: next }
        }
      };
    });
  };

  const setAllSlotsForDay = (day: string, mode: SlotMode) => {
    setWeek(prev => {
      const slots: DayAvailability = {};
      TIME_SLOTS.forEach(s => { slots[s] = mode; });
      return { ...prev, [day]: { ...prev[day], slots } };
    });
  };

  const activeDay = week[selectedDay];
  const activeSlotCount = activeDay ? Object.values(activeDay.slots).filter(m => m !== 'off').length : 0;

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map(day => {
          const dayData = week[day];
          const activeCount = Object.values(dayData.slots).filter(m => m !== 'off').length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all min-w-[80px] text-xs font-medium',
                selectedDay === day
                  ? 'border-primary bg-primary/10 text-primary'
                  : dayData.enabled
                    ? 'border-border bg-card text-foreground hover:border-primary/40'
                    : 'border-border bg-muted text-muted-foreground'
              )}
            >
              <span className="font-semibold text-sm">
                {t(`doctor.availability.days_short.${day}`)}
              </span>
              <span className={cn('text-[10px]', !dayData.enabled && 'text-destructive')}>
                {dayData.enabled ? `${activeCount} ${t('doctor.availability.slots_label')}` : t('doctor.availability.off')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t(`onboarding.doctor.days.${selectedDay}`)}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Switch
                checked={activeDay.enabled}
                onCheckedChange={() => toggleDayEnabled(selectedDay)}
              />
            </div>
          </div>
          {activeDay.enabled && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">{t('doctor.availability.set_all')}:</span>
              <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2" onClick={() => setAllSlotsForDay(selectedDay, 'cabinet')}>
                <Building2 className="h-3 w-3" /> {t('doctor.availability.cabinet')}
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2" onClick={() => setAllSlotsForDay(selectedDay, 'online')}>
                <Monitor className="h-3 w-3" /> {t('doctor.availability.online')}
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2" onClick={() => setAllSlotsForDay(selectedDay, 'both')}>
                {t('doctor.availability.both_label')}
              </Button>
              <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1 px-2" onClick={() => setAllSlotsForDay(selectedDay, 'off')}>
                {t('doctor.availability.off')}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!activeDay.enabled ? (
            <div className="text-center py-8 text-muted-foreground">
              <ToggleLeft className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('doctor.availability.day_disabled')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {TIME_SLOTS.map(slot => {
                const mode = activeDay.slots[slot];
                return (
                  <button
                    key={slot}
                    onClick={() => cycleSlotMode(selectedDay, slot)}
                    className={cn(
                      'rounded-md border px-1 py-1.5 text-[11px] font-medium transition-all',
                      MODE_COLORS[mode]
                    )}
                    title={t(`doctor.availability.mode_${mode}`)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" />
          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {t('doctor.availability.cabinet')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
          <span className="flex items-center gap-1"><Monitor className="h-3 w-3" /> {t('doctor.availability.online')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
          <span>{t('doctor.availability.both_label')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-muted border border-border opacity-50" />
          <span>{t('doctor.availability.off')}</span>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
