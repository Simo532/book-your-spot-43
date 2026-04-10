import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, CalendarCheck, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DoctorLayout from '@/components/DoctorLayout';
import { tokenStorage } from '@/services/api';
import { useDoctorByUserId, useDoctorMonthlyStats, useDoctorCompletedCount } from '@/hooks/useApiHooks';
import { useReviewsByDoctor } from '@/hooks/useApiHooks';

const DoctorAnalytics = () => {
  const { t } = useTranslation();
  const userId = tokenStorage.getUserId();
  const { data: doctor } = useDoctorByUserId(userId || '');
  const now = new Date();
  const { data: stats } = useDoctorMonthlyStats(doctor?.id || '', now.getMonth() + 1, now.getFullYear());
  const { data: completedCount } = useDoctorCompletedCount(doctor?.id || '');
  const { data: reviewsData } = useReviewsByDoctor(doctor?.id || '', 0, 1);

  const totalAppointments = (completedCount as number) || 0;
  const avgRating = doctor?.averageRating?.toFixed(1) || '-';
  const reviewCount = doctor?.reviewCount || 0;

  const statCards = [
    { key: 'total_appointments', icon: CalendarCheck, value: String(totalAppointments) },
    { key: 'avg_rating', icon: Star, value: `${avgRating}/5` },
    { key: 'total_reviews', icon: Users, value: String(reviewCount) },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.analytics.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.analytics.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`doctor.analytics.stats.${stat.key}`)}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('doctor.analytics.appointments_chart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground bg-accent/30 p-4 rounded-lg overflow-auto">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorAnalytics;
