import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Calendar as CalendarIcon, Globe, MapPin, CheckCircle, XCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShimmerListItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import DoctorLayout from '@/components/DoctorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointmentsByDoctor, useUpdateAppointmentStatus } from '@/hooks/useApiHooks';
import { AppointmentStatus, AppointmentResponseDTO } from '@/types/appointment';

const statusTabs = ['PENDING', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED'] as const;

const DoctorAppointments = () => {
  const { t, i18n } = useTranslation();
  const { doctorOrPatientId } = useAuth();
  const [activeStatus, setActiveStatus] = useState<string>('PENDING');
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const locale = i18n.language === 'fr' ? fr : i18n.language === 'ar' ? ar : enUS;

  const { data: appointments, isLoading } = useAppointmentsByDoctor(doctorOrPatientId || '', 0, 50);
  const updateStatus = useUpdateAppointmentStatus();

  const allAppointments = appointments || [];

  const filtered = allAppointments.filter((a) => {
    if (a.status !== activeStatus) return false;
    if (selectedDate && a.appointmentDate) {
      const aptDate = new Date(a.appointmentDate).toISOString().split('T')[0];
      if (aptDate !== format(selectedDate, 'yyyy-MM-dd')) return false;
    }
    return true;
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const monthDays = eachDayOfInterval({ start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 }), end: addDays(endOfMonth(currentDate), 6 - endOfMonth(currentDate).getDay()) });
  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const hasAppointments = (date: Date) => allAppointments.some(a => a.appointmentDate && new Date(a.appointmentDate).toISOString().split('T')[0] === format(date, 'yyyy-MM-dd'));

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('doctor.appointments.title')}</h1>

        {/* Calendar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-muted rounded-full p-1">
                <button onClick={() => setCalendarView('week')} className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-all', calendarView === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                  {t('doctor.appointments.calendar.by_week')}
                </button>
                <button onClick={() => setCalendarView('month')} className={cn('px-4 py-1.5 rounded-full text-sm font-medium transition-all', calendarView === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                  {t('doctor.appointments.calendar.by_month')}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="icon" onClick={() => calendarView === 'week' ? setCurrentDate(subWeeks(currentDate, 1)) : setCurrentDate(subMonths(currentDate, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary text-primary-foreground px-6 py-1.5 rounded-lg text-sm font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale })}
              </div>
              <Button variant="ghost" size="icon" onClick={() => calendarView === 'week' ? setCurrentDate(addWeeks(currentDate, 1)) : setCurrentDate(addMonths(currentDate, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className={`grid grid-cols-7 gap-${calendarView === 'week' ? '1' : '0.5'}`}>
              {dayNames.map((d, i) => <div key={i} className="text-center text-xs font-medium text-primary py-1">{d}</div>)}
              {(calendarView === 'week' ? weekDays : monthDays).map((day) => {
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                const isCurrentMonth = calendarView === 'month' ? isSameMonth(day, currentDate) : true;
                const hasApt = hasAppointments(day);
                return (
                  <button key={day.toISOString()} onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={cn('flex flex-col items-center py-2 rounded-xl transition-all text-sm',
                      !isCurrentMonth && 'text-muted-foreground/40',
                      isToday && !isSelected && 'bg-primary/10 text-primary font-bold',
                      isSelected && 'bg-primary text-primary-foreground font-bold',
                      isCurrentMonth && !isToday && !isSelected && 'hover:bg-accent')}>
                    {day.getDate()}
                    {hasApt && isCurrentMonth && <span className={cn('w-1.5 h-1.5 rounded-full mt-0.5', isSelected ? 'bg-primary-foreground' : 'bg-primary')} />}
                  </button>
                );
              })}
            </div>
            {selectedDate && (
              <div className="mt-2 text-center">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setSelectedDate(null)}>
                  {t('doctor.appointments.calendar.clear_selection')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusTabs.map((status) => (
            <button key={status} onClick={() => setActiveStatus(status)}
              className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border',
                activeStatus === status ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card text-muted-foreground border-border hover:border-primary/50')}>
              {t(`doctor.appointments.status.${status.toLowerCase()}`)}
            </button>
          ))}
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ShimmerListItem key={i} />)
          ) : filtered.length === 0 ? (
            <Card><CardContent className="py-16 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">{t('doctor.appointments.no_appointments')}</p>
            </CardContent></Card>
          ) : (
            filtered.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} t={t} onAccept={() => updateStatus.mutate({ id: apt.id, status: AppointmentStatus.CONFIRMED })} onDecline={() => updateStatus.mutate({ id: apt.id, status: AppointmentStatus.CANCELLED })} />
            ))
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

const AppointmentCard = ({ appointment: apt, t, onAccept, onDecline }: { appointment: AppointmentResponseDTO; t: any; onAccept: () => void; onDecline: () => void }) => {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const aptTime = apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) : 'ASAP';
  const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString('fr') : '-';

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={apt.patientImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{getInitials(apt.patientName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm">{apt.patientName}</h3>
              <span className="text-primary font-bold text-lg">{apt.consultationFee} DA</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Phone className="h-3 w-3" /><span>{apt.patientTel}</span>
              <span>- {apt.patientAge} {t('doctor.appointments.years')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{aptTime}</span></div>
              <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /><span>{aptDate}</span></div>
              {apt.online && <Badge variant="outline" className="text-[10px] h-5 gap-1"><Globe className="h-2.5 w-2.5" />{t('doctor.appointments.filters.online')}</Badge>}
            </div>
          </div>
        </div>
        {apt.patientMessage && (
          <div className="mt-3 relative pl-4 pr-2">
            <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/30" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">{apt.patientMessage}</p>
          </div>
        )}
        <div className="mt-3 text-[11px] text-primary space-y-0.5">
          <p>{t('doctor.appointments.requested_at')} {new Date(apt.createdAt).toLocaleString('fr')}</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {apt.status === 'COMPLETED' && <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle className="h-5 w-5" /><span className="text-sm font-medium">{t('doctor.appointments.status.completed')}</span></div>}
          {apt.status === 'CANCELLED' && <div className="flex items-center gap-1.5 text-destructive"><XCircle className="h-5 w-5" /><span className="text-sm font-medium">{t('doctor.appointments.status.cancelled')}</span></div>}
          {apt.status === 'CONFIRMED' && <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{t('doctor.appointments.status.confirmed')}</Badge>}
          {apt.status === 'PAID' && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{t('doctor.appointments.status.paid')}</Badge>}
          {apt.status === 'PENDING' && (
            <div className="flex gap-2 w-full">
              <Button size="sm" className="flex-1 h-9" onClick={onAccept}>{t('doctor.appointments.accept')}</Button>
              <Button size="sm" variant="outline" className="flex-1 h-9" onClick={onDecline}>{t('doctor.appointments.decline')}</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;
