import { useTranslation } from 'react-i18next';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { CalendarCheck, MessageSquare, Heart, Clock, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShimmerStatCard, ShimmerListItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import PatientLayout from '@/components/PatientLayout';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointmentsByPatient, useFavorites } from '@/hooks/useApiHooks';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { doctorOrPatientId, userId } = useAuth();

  const { data: appointments, isLoading: aptsLoading } = useAppointmentsByPatient(doctorOrPatientId || '', 0, 20);
  const { data: favoritesData } = useFavorites(userId || '');

  const allApts = appointments || [];
  const upcoming = allApts.filter(a => ['CONFIRMED', 'PENDING', 'PAID'].includes(a.status));
  const favorites = favoritesData || [];

  const statCards = [
    { key: 'total_appointments', icon: CalendarCheck, value: allApts.length.toString(), color: 'text-primary' },
    { key: 'upcoming', icon: Clock, value: upcoming.length.toString(), color: 'text-amber-500' },
    { key: 'unread_messages', icon: MessageSquare, value: '-', color: 'text-emerald-500' },
    { key: 'favorites', icon: Heart, value: favorites.length.toString(), color: 'text-red-500' },
  ];

  return (
    <PatientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.dashboard.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('patient.dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {aptsLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ShimmerStatCard key={i} />)
          ) : (
            statCards.map((stat) => (
              <Card key={stat.key}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t(`patient.dashboard.stats.${stat.key}`)}</CardTitle>
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('patient.dashboard.upcoming_appointments')}</CardTitle>
              <Link to="/patient/appointments"><Button variant="ghost" size="sm">{t('patient.dashboard.view_all')}</Button></Link>
            </CardHeader>
            <CardContent>
              {aptsLoading ? (
                <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <ShimmerListItem key={i} />)}</div>
              ) : upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t('patient.appointments.no_upcoming')}</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{apt.doctorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleDateString('fr') : 'ASAP'} · {apt.appointmentDate ? new Date(apt.appointmentDate).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">{apt.online ? t('patient.dashboard.video') : t('patient.dashboard.in_person')}</Badge>
                        <Badge variant={apt.status === 'CONFIRMED' ? 'default' : 'secondary'}>{t(`patient.dashboard.status.${apt.status.toLowerCase()}`)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('patient.dashboard.recent_doctors')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {favorites.slice(0, 3).map((fav) => (
                  <Link key={fav.id} to={`/doctor/details/${fav.doctor.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {fav.doctor.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">Dr. {fav.doctor.firstName} {fav.doctor.lastName}</p>
                      <p className="text-xs text-muted-foreground">{fav.doctor.speciality?.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{fav.doctor.averageRating?.toFixed(1) ?? '-'}</span>
                    </div>
                  </Link>
                ))}
                {favorites.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t('patient.favorites.empty')}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
