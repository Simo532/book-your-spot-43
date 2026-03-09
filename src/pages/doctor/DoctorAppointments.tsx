import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShimmerListItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import DoctorLayout from '@/components/DoctorLayout';
import AppointmentCard from '@/components/doctor/AppointmentCard';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointmentsByDoctor, useUpdateAppointmentStatus } from '@/hooks/useApiHooks';
import { AppointmentStatus } from '@/types/appointment';

const statusTabs = ['PENDING', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED'] as const;
const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

const DoctorAppointments = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onAccept={() => updateStatus.mutate({ id: apt.id, status: AppointmentStatus.CONFIRMED })}
                onDecline={() => updateStatus.mutate({ id: apt.id, status: AppointmentStatus.CANCELLED })}
                onJoinZoom={() => navigate(`/zoom/${apt.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
