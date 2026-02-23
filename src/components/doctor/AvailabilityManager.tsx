import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ToggleLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type SlotType = 'cabinet' | 'online' | 'both';

interface SlotData {
  enabled: boolean;
  type: SlotType;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

const generateSlots = (): string[] => {
  const slots: string[] = [];
  for (let h = 8; h <= 23; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 23 || true) slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  return slots.filter(s => s <= '23:30');
};

const TIME_SLOTS = generateSlots();

const getSlotLabel = (slot: string): string => {
  const [h, m] = slot.split(':').map(Number);
  const endM = m + 30;
  const endH = endM >= 60 ? h + 1 : h;
  const endMin = endM >= 60 ? endM - 60 : endM;
  return `${slot} - ${endH.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
};

type DaySlots = Record<string, SlotData>;
type WeekAvailability = Record<string, { enabled: boolean; slots: DaySlots }>;

const initWeek = (): WeekAvailability => {
  const week: WeekAvailability = {};
  DAYS.forEach(day => {
    const slots: DaySlots = {};
    TIME_SLOTS.forEach(slot => { slots[slot] = { enabled: true, type: 'cabinet' }; });
    week[day] = { enabled: true, slots };
  });
  return week;
};

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

  const toggleSlot = (day: string, slot: string) => {
    setWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: {
          ...prev[day].slots,
          [slot]: { ...prev[day].slots[slot], enabled: !prev[day].slots[slot].enabled }
        }
      }
    }));
  };

  const setSlotType = (day: string, slot: string, type: SlotType) => {
    setWeek(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: {
          ...prev[day].slots,
          [slot]: { ...prev[day].slots[slot], type }
        }
      }
    }));
  };

  const activeDay = week[selectedDay];
  const activeSlotCount = activeDay ? Object.values(activeDay.slots).filter(s => s.enabled).length : 0;

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map(day => {
          const dayData = week[day];
          const count = Object.values(dayData.slots).filter(s => s.enabled).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all min-w-[80px] text-xs font-medium',
                selectedDay === day
                  ? 'border-[#536DFE] bg-[#536DFE]/10 text-[#536DFE]'
                  : dayData.enabled
                    ? 'border-border bg-card text-foreground hover:border-[#536DFE]/40'
                    : 'border-border bg-muted text-muted-foreground'
              )}
            >
              <span className="font-semibold text-sm">
                {t(`doctor.availability.days_short.${day}`)}
              </span>
              <span className={cn('text-[10px]', !dayData.enabled && 'text-destructive')}>
                {dayData.enabled ? `${count} ${t('doctor.availability.slots_label')}` : t('doctor.availability.off')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#536DFE]" />
              {t(`onboarding.doctor.days.${selectedDay}`)}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                ({activeSlotCount} {t('doctor.availability.slots_label')})
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {activeDay.enabled ? t('doctor.availability.day_active') : t('doctor.availability.off')}
              </span>
              <Switch
                checked={activeDay.enabled}
                onCheckedChange={() => toggleDayEnabled(selectedDay)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!activeDay.enabled ? (
            <div className="text-center py-8 text-muted-foreground">
              <ToggleLeft className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{t('doctor.availability.day_disabled')}</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {TIME_SLOTS.map(slot => {
                const slotData = activeDay.slots[slot];
                return (
                  <div
                    key={slot}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-all',
                      slotData.enabled
                        ? 'border-[#536DFE]/20 bg-[#536DFE]/5'
                        : 'border-border bg-muted/50 opacity-60'
                    )}
                  >
                    <span className={cn(
                      'text-sm font-mono font-medium min-w-[120px]',
                      slotData.enabled ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {getSlotLabel(slot)}
                    </span>

                    <div className="flex items-center gap-3">
                      <Select
                        value={slotData.type}
                        onValueChange={(val) => setSlotType(selectedDay, slot, val as SlotType)}
                        disabled={!slotData.enabled}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs border-[#536DFE]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cabinet">{t('doctor.availability.cabinet')}</SelectItem>
                          <SelectItem value="online">{t('doctor.availability.online')}</SelectItem>
                          <SelectItem value="both">{t('doctor.availability.both_label')}</SelectItem>
                        </SelectContent>
                      </Select>

                      <Switch
                        checked={slotData.enabled}
                        onCheckedChange={() => toggleSlot(selectedDay, slot)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManager;
