import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Calendar as CalendarIcon, Globe, MapPin, CheckCircle, XCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format, startOfWeek, addDays, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr, enUS, ar } from 'date-fns/locale';
import DoctorLayout from '@/components/DoctorLayout';

const statusTabs = ['pending', 'confirmed', 'paid', 'completed', 'cancelled'] as const;
type AppointmentStatus = typeof statusTabs[number];

interface Appointment {
  id: number;
  patient: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  time: string;
  date: string;
  price: number;
  mode: 'cabinet' | 'video';
  status: AppointmentStatus;
  message: string;
  requestedAt: string;
  completedAt?: string;
}

const mockAppointments: Appointment[] = [
  { id: 1, patient: 'Amina Khelifi', phone: '0555 12 34 56', age: 27, gender: 'female', time: '09:00', date: '2026-03-08', price: 300, mode: 'cabinet', status: 'completed', message: 'Je souffre de douleurs thoraciques depuis 3 jours', requestedAt: '2026-03-07 14:30', completedAt: '2026-03-08 09:35' },
  { id: 2, patient: 'Youcef Hadj', phone: '0661 78 90 12', age: 36, gender: 'male', time: '09:30', date: '2026-03-08', price: 300, mode: 'video', status: 'confirmed', message: 'Suivi de mon traitement cardiaque mensuel', requestedAt: '2026-03-06 10:00' },
  { id: 3, patient: 'Sara Boumediene', phone: '0770 34 56 78', age: 42, gender: 'female', time: '10:00', date: '2026-03-08', price: 300, mode: 'cabinet', status: 'pending', message: 'je suis besoin de vous docteur en urgence', requestedAt: '2026-03-07 23:23' },
  { id: 4, patient: 'Karim Mesli', phone: '0550 90 12 34', age: 44, gender: 'male', time: '10:30', date: '2026-03-09', price: 300, mode: 'video', status: 'paid', message: 'Consultation de routine pour hypertension', requestedAt: '2026-03-05 18:00' },
  { id: 5, patient: 'Nadia Ferhat', phone: '0660 56 78 90', age: 31, gender: 'female', time: '11:00', date: '2026-03-10', price: 300, mode: 'cabinet', status: 'cancelled', message: 'Annulé pour raison personnelle', requestedAt: '2026-03-04 09:15' },
  { id: 6, patient: 'Rachid Boudiaf', phone: '0771 12 34 56', age: 55, gender: 'male', time: '14:00', date: '2026-03-11', price: 300, mode: 'cabinet', status: 'confirmed', message: 'Douleurs à la poitrine et essoufflement', requestedAt: '2026-03-06 16:45' },
];

const DoctorAppointments = () => {
  const { t, i18n } = useTranslation();
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus>('pending');
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const locale = i18n.language === 'fr' ? fr : i18n.language === 'ar' ? ar : enUS;

  const filtered = mockAppointments.filter((a) => {
    if (a.status !== activeStatus) return false;
    if (selectedDate && a.date !== format(selectedDate, 'yyyy-MM-dd')) return false;
    return true;
  });

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Calendar helpers
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn: 0 }), end: addDays(endOfMonth(currentDate), 6 - endOfMonth(currentDate).getDay()) });

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const hasAppointments = (date: Date) => mockAppointments.some(a => a.date === format(date, 'yyyy-MM-dd'));

  return (
    <DoctorLayout>
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold">{t('doctor.appointments.title')}</h1>

        {/* Calendar Section */}
        <Card>
          <CardContent className="p-4">
            {/* Week/Month toggle */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex bg-muted rounded-full p-1">
                <button
                  onClick={() => setCalendarView('week')}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    calendarView === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  )}
                >
                  {t('doctor.appointments.calendar.by_week')}
                </button>
                <button
                  onClick={() => setCalendarView('month')}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                    calendarView === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                  )}
                >
                  {t('doctor.appointments.calendar.by_month')}
                </button>
              </div>
            </div>

            {/* Month header with nav */}
            <div className="flex items-center justify-between mb-3">
              <Button variant="ghost" size="icon" onClick={() => {
                if (calendarView === 'week') setCurrentDate(subWeeks(currentDate, 1));
                else setCurrentDate(subMonths(currentDate, 1));
              }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary text-primary-foreground px-6 py-1.5 rounded-lg text-sm font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale })}
              </div>
              <Button variant="ghost" size="icon" onClick={() => {
                if (calendarView === 'week') setCurrentDate(addWeeks(currentDate, 1));
                else setCurrentDate(addMonths(currentDate, 1));
              }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {calendarView === 'week' ? (
              /* Week view */
              <div className="grid grid-cols-7 gap-1">
                {dayNames.map((d, i) => (
                  <div key={i} className="text-center text-xs font-medium text-primary py-1">{d}</div>
                ))}
                {weekDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const hasApt = hasAppointments(day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={cn(
                        'flex flex-col items-center py-2 rounded-xl transition-all text-sm',
                        isToday && !isSelected && 'bg-primary/10 text-primary font-bold',
                        isSelected && 'bg-primary text-primary-foreground font-bold',
                        !isToday && !isSelected && 'hover:bg-accent'
                      )}
                    >
                      {day.getDate()}
                      {hasApt && <span className={cn('w-1.5 h-1.5 rounded-full mt-0.5', isSelected ? 'bg-primary-foreground' : 'bg-primary')} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Month view */
              <div className="grid grid-cols-7 gap-0.5">
                {dayNames.map((d, i) => (
                  <div key={i} className="text-center text-xs font-medium text-primary py-1">{d}</div>
                ))}
                {monthDays.map((day) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const hasApt = hasAppointments(day);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(isSelected ? null : day)}
                      className={cn(
                        'flex flex-col items-center py-2 rounded-lg transition-all text-sm',
                        !isCurrentMonth && 'text-muted-foreground/40',
                        isToday && !isSelected && 'bg-primary/10 text-primary font-bold',
                        isSelected && 'bg-primary text-primary-foreground font-bold',
                        isCurrentMonth && !isToday && !isSelected && 'hover:bg-accent'
                      )}
                    >
                      {day.getDate()}
                      {hasApt && isCurrentMonth && <span className={cn('w-1.5 h-1.5 rounded-full mt-0.5', isSelected ? 'bg-primary-foreground' : 'bg-primary')} />}
                    </button>
                  );
                })}
              </div>
            )}

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
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border',
                activeStatus === status
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50'
              )}
            >
              {t(`doctor.appointments.status.${status}`)}
            </button>
          ))}
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">{t('doctor.appointments.no_appointments')}</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} t={t} />
            ))
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

const AppointmentCard = ({ appointment: apt, t }: { appointment: Appointment; t: any }) => {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        {/* Header: Avatar + Info + Price */}
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{getInitials(apt.patient)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm">{apt.patient}</h3>
              <span className="text-primary font-bold text-lg">{apt.price} DH</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Phone className="h-3 w-3" />
              <span>{apt.phone}</span>
              <span>- {apt.age} {t('doctor.appointments.years')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{apt.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{apt.date}</span>
              </div>
              {apt.mode === 'video' && (
                <Badge variant="outline" className="text-[10px] h-5 gap-1">
                  <Globe className="h-2.5 w-2.5" />
                  {t('doctor.appointments.filters.online')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mt-3 relative pl-4 pr-2">
          <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/30" />
          <p className="text-xs text-muted-foreground italic leading-relaxed">{apt.message}</p>
        </div>

        {/* Timestamps */}
        <div className="mt-3 text-[11px] text-primary space-y-0.5">
          <p>{t('doctor.appointments.requested_at')} {apt.requestedAt}</p>
          {apt.completedAt && (
            <p>{t('doctor.appointments.completed_at')} {apt.completedAt}</p>
          )}
        </div>

        {/* Status footer */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {apt.status === 'completed' && (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{t('doctor.appointments.status.completed')}</span>
            </div>
          )}
          {apt.status === 'cancelled' && (
            <div className="flex items-center gap-1.5 text-destructive">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{t('doctor.appointments.status.cancelled')}</span>
            </div>
          )}
          {apt.status === 'confirmed' && (
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
              {t('doctor.appointments.status.confirmed')}
            </Badge>
          )}
          {apt.status === 'paid' && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              {t('doctor.appointments.status.paid')}
            </Badge>
          )}
          {apt.status === 'pending' && (
            <div className="flex gap-2 w-full">
              <Button size="sm" className="flex-1 h-9">
                {t('doctor.appointments.accept')}
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-9">
                {t('doctor.appointments.decline')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorAppointments;
