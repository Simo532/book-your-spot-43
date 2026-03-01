import { useTranslation } from 'react-i18next';
import { CalendarCheck, MessageSquare, Heart, Clock, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PatientLayout from '@/components/PatientLayout';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const statCards = [
  { key: 'total_appointments', icon: CalendarCheck, value: '12', color: 'text-primary' },
  { key: 'upcoming', icon: Clock, value: '2', color: 'text-amber-500' },
  { key: 'unread_messages', icon: MessageSquare, value: '4', color: 'text-emerald-500' },
  { key: 'favorites', icon: Heart, value: '3', color: 'text-red-500' },
];

const monthlyAppointments = [
  { month: 'Sep', count: 1 },
  { month: 'Oct', count: 2 },
  { month: 'Nov', count: 0 },
  { month: 'Déc', count: 3 },
  { month: 'Jan', count: 1 },
  { month: 'Fév', count: 2 },
];

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Ahmed Benali', specialty: 'Cardiologue', date: '2026-03-03', time: '09:00', status: 'confirmed', type: 'cabinet' },
  { id: 2, doctor: 'Dr. Amina Khelifi', specialty: 'Dermatologue', date: '2026-03-07', time: '14:30', status: 'pending', type: 'video' },
];

const recentDoctors = [
  { id: '1', name: 'Dr. Ahmed Benali', specialty: 'Cardiologue', rating: 4.9 },
  { id: '4', name: 'Dr. Fatima Zerhouni', specialty: 'Pédiatre', rating: 4.8 },
];

const PatientDashboard = () => {
  const { t } = useTranslation();

  return (
    <PatientLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.dashboard.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('patient.dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`patient.dashboard.stats.${stat.key}`)}
                </CardTitle>
                <stat.icon className={cn('h-4 w-4', stat.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('patient.dashboard.upcoming_appointments')}</CardTitle>
              <Link to="/patient/appointments">
                <Button variant="ghost" size="sm">{t('patient.dashboard.view_all')}</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{apt.doctor}</p>
                      <p className="text-xs text-muted-foreground">{apt.specialty} · {apt.date} · {apt.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        {apt.type === 'cabinet' ? t('patient.dashboard.in_person') : t('patient.dashboard.video')}
                      </Badge>
                      <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                        {t(`patient.dashboard.status.${apt.status}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {t('patient.dashboard.monthly_chart')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="RDV" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('patient.dashboard.recent_doctors')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentDoctors.map((doc) => (
                <Link key={doc.id} to={`/doctor/details/${doc.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {doc.name.split(' ').pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{doc.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
