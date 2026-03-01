import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Clock, ChevronLeft, CheckCircle2, Building2, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addDays, format, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: {
    firstName: string;
    lastName: string;
    specialty: string;
    avatar: string;
    consultPrice: number;
    currency: string;
  };
}

const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const generateSlots = (period: string) => {
  const slots: string[] = [];
  let start: number, end: number;
  if (period === 'morning') { start = 8; end = 12; }
  else if (period === 'afternoon') { start = 12; end = 18; }
  else { start = 18; end = 21; }
  for (let h = start; h < end; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00 - ${String(h).padStart(2, '0')}:30`);
    slots.push(`${String(h).padStart(2, '0')}:30 - ${String(h + 1 === 24 ? 0 : h + 1).padStart(2, '0')}:00`);
  }
  return slots;
};

const BookingModal = ({ open, onOpenChange, doctor }: BookingModalProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [consultationType, setConsultationType] = useState<'cabinet' | 'video'>('cabinet');

  const days = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = addDays(new Date(), i);
      return { date, dayNum: format(date, 'd'), dayName: dayNames[getDay(date)], full: date };
    });
  }, []);

  const morningSlots = generateSlots('morning');
  const afternoonSlots = generateSlots('afternoon');
  const eveningSlots = generateSlots('evening');

  const selectedDate = days[selectedDay]?.full;
  const formattedSelected = selectedDate
    ? `${format(selectedDate, 'd MMM yyyy', { locale: fr })} à ${selectedSlot?.split(' - ')[0]}`
    : '';

  const handleConfirm = () => {
    onOpenChange(false);
    setStep(1);
    setSelectedSlot(null);
    setMessage('');
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setStep(1);
      setSelectedSlot(null);
      setMessage('');
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            {step === 2 && (
              <Button variant="ghost" size="icon" className="shrink-0 -ml-2" onClick={() => setStep(1)}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <DialogHeader className="flex-1 text-left">
              <DialogTitle className="text-lg">
                {step === 1 ? t('booking.select_slot') : t('booking.details')}
              </DialogTitle>
            </DialogHeader>
            <span className="text-xs text-muted-foreground">{step} / 2</span>
          </div>

          {/* Doctor mini-card */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {doctor.firstName[0]}{doctor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">Dr. {doctor.firstName} {doctor.lastName}</p>
              <p className="text-xs text-primary">{doctor.specialty}</p>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="px-6 pb-6 space-y-5">
            {/* Section title */}
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t('booking.when_consult')}</h3>
            </div>

            {/* Day selector */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">{t('booking.select_day')}</p>
              <div className="flex gap-2">
                {days.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
                    className={cn(
                      'flex-1 flex flex-col items-center py-3 rounded-xl border-2 transition-all text-sm',
                      selectedDay === i
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-border hover:border-primary/30'
                    )}
                  >
                    <span className="text-lg font-bold">{day.dayNum}</span>
                    <span className="text-xs">{day.dayName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slots */}
            {[
              { label: t('booking.morning'), slots: morningSlots, color: 'text-amber-600' },
              { label: t('booking.afternoon'), slots: afternoonSlots, color: 'text-primary' },
              { label: t('booking.evening'), slots: eveningSlots, color: 'text-violet-600' },
            ].map((period) => (
              <div key={period.label}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn('font-medium text-sm', period.color)}>{period.label}</span>
                  <Badge variant="secondary" className="text-xs">{period.slots.length} {t('booking.slots_available')}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {period.slots.slice(0, 6).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all',
                        selectedSlot === slot
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              className="w-full mt-4"
              disabled={!selectedSlot}
              onClick={() => setStep(2)}
            >
              {t('booking.confirm_request')}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="px-6 pb-6 space-y-5">
            {/* Selected slot confirmation */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500 text-white">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs font-medium opacity-90">{t('booking.slot_selected')}</p>
                <p className="font-semibold text-sm">{formattedSelected}</p>
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('booking.your_message')}</h3>
              </div>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('booking.message_placeholder')}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Consultation type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{t('booking.consultation_type')}</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setConsultationType('cabinet')}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
                    consultationType === 'cabinet'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    consultationType === 'cabinet' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{t('booking.in_person')}</p>
                    <p className="text-xs text-muted-foreground">{t('booking.in_person_desc')}</p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2',
                    consultationType === 'cabinet' ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  )}>
                    {consultationType === 'cabinet' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setConsultationType('video')}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all',
                    consultationType === 'video'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    consultationType === 'video' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <Video className="h-5 w-5" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm">{t('booking.video')}</p>
                    <p className="text-xs text-muted-foreground">{t('booking.video_desc')}</p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2',
                    consultationType === 'video' ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  )}>
                    {consultationType === 'video' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <Button className="w-full" onClick={handleConfirm}>
              {t('booking.confirm_request')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
