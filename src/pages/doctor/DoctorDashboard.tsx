import { useTranslation } from 'react-i18next';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';
import { Link } from 'react-router-dom';

const statCards = [
  { key: 'today_appointments', icon: CalendarCheck, value: '8', color: 'text-primary' },
  { key: 'unread_messages', icon: MessageSquare, value: '3', color: 'text-amber-500' },
  { key: 'total_reviews', icon: Star, value: '124', color: 'text-yellow-500' },
  { key: 'monthly_patients', icon: Users, value: '86', color: 'text-emerald-500' },
];

const upcomingAppointments = [
  { id: 1, patient: 'Amina Khelifi', time: '09:00', type: 'Consultation', status: 'confirmed' },
  { id: 2, patient: 'Youcef Hadj', time: '09:30', type: 'Suivi', status: 'confirmed' },
  { id: 3, patient: 'Sara Boumediene', time: '10:00', type: 'Consultation', status: 'pending' },
  { id: 4, patient: 'Karim Mesli', time: '10:30', type: 'Urgence', status: 'confirmed' },
];

const recentReviews = [
  { id: 1, patient: 'Fatima Z.', rating: 5, text: 'Excellent médecin, très à l\'écoute.', date: '2026-02-21' },
  { id: 2, patient: 'Ahmed B.', rating: 4, text: 'Bon diagnostic, temps d\'attente correct.', date: '2026-02-20' },
];

const DoctorDashboard = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.dashboard.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.dashboard.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`doctor.dashboard.stats.${stat.key}`)}
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
          {/* Upcoming appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('doctor.dashboard.upcoming')}</CardTitle>
              <Link to="/doctor/appointments">
                <Button variant="ghost" size="sm">{t('doctor.dashboard.view_all')}</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{apt.patient}</p>
                      <p className="text-xs text-muted-foreground">{apt.type} · {apt.time}</p>
                    </div>
                    <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                      {t(`doctor.dashboard.status.${apt.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Badge progression */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('doctor.dashboard.badge_progress')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-2">
                  <Star className="h-8 w-8 fill-current" />
                </div>
                <p className="font-semibold">{t('doctor.dashboard.current_badge')}</p>
                <p className="text-sm text-muted-foreground">Gold</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('doctor.dashboard.next_badge')}</span>
                  <span className="font-medium">124/200 {t('doctor.dashboard.reviews_label')}</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
              <Link to="/doctor/badges">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  {t('doctor.dashboard.see_badges')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('doctor.dashboard.recent_reviews')}</CardTitle>
            <Link to="/doctor/reviews">
              <Button variant="ghost" size="sm">{t('doctor.dashboard.view_all')}</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="flex gap-4 p-4 rounded-xl border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{review.patient}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};


export default DoctorDashboard;
