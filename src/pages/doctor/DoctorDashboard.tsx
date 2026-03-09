import { useTranslation } from 'react-i18next';
import { formatTime, formatDate } from '@/lib/dateUtils';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Clock, Users, DollarSign, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShimmerStatCard, ShimmerListItem, ShimmerReview } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctorMonthlyStats, useAppointmentsByDoctor, useReviewsByDoctor } from '@/hooks/useApiHooks';

const DoctorDashboard = () => {
  const { t } = useTranslation();
  const { doctorOrPatientId } = useAuth();
  const now = new Date();

  const { data: monthlyStats, isLoading: statsLoading } = useDoctorMonthlyStats(
    doctorOrPatientId || '', now.getMonth() + 1, now.getFullYear()
  );
  const { data: appointments, isLoading: aptsLoading } = useAppointmentsByDoctor(doctorOrPatientId || '', 0, 5);
  const { data: reviewsData } = useReviewsByDoctor(doctorOrPatientId || '', 0, 3);

  const stats = monthlyStats as Record<string, any> | undefined;
  const recentReviews = reviewsData?.content || [];
  const upcomingAppointments = appointments || [];

  const statCards = [
    { key: 'today_appointments', icon: CalendarCheck, value: stats?.todayAppointments ?? '-', color: 'text-primary' },
    { key: 'unread_messages', icon: MessageSquare, value: stats?.unreadMessages ?? '-', color: 'text-amber-500' },
    { key: 'total_reviews', icon: Star, value: stats?.totalReviews ?? '-', color: 'text-yellow-500' },
    { key: 'monthly_patients', icon: Users, value: stats?.monthlyPatients ?? '-', color: 'text-emerald-500' },
    { key: 'profile_views', icon: Eye, value: stats?.profileViews ?? '-', color: 'text-violet-500' },
    { key: 'monthly_revenue', icon: DollarSign, value: stats?.monthlyRevenue ? `${Number(stats.monthlyRevenue).toLocaleString()} DZD` : '-', color: 'text-primary' },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.dashboard.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.dashboard.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ShimmerStatCard key={i} />)
          ) : (
            statCards.map((stat) => (
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
            ))
          )}
        </div>

        {/* Upcoming appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{t('doctor.dashboard.upcoming')}</CardTitle>
              <Link to="/doctor/appointments">
                <Button variant="ghost" size="sm">{t('doctor.dashboard.view_all')}</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {aptsLoading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ShimmerListItem key={i} />)}</div>
              ) : upcomingAppointments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">{t('doctor.appointments.no_appointments')}</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 4).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{apt.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {apt.online ? 'En ligne' : 'Cabinet'} · {apt.appointmentDate ? formatTime(apt.appointmentDate) : 'ASAP'}
                        </p>
                      </div>
                      <Badge variant={apt.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {t(`doctor.dashboard.status.${apt.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
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
                <p className="text-sm text-muted-foreground">{stats?.badgeName ?? '-'}</p>
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
                      <span className="font-semibold text-sm">{review.patientName}</span>
                      <div className="flex">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              ))}
              {recentReviews.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">{t('doctor.reviews.empty') || 'Aucun avis'}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
