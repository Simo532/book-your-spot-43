import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, CalendarCheck, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DoctorLayout from '@/components/DoctorLayout';

const stats = [
  { key: 'profile_views', icon: Eye, value: '1,245', change: '+15%' },
  { key: 'total_appointments', icon: CalendarCheck, value: '348', change: '+23%' },
  { key: 'total_patients', icon: Users, value: '186', change: '+12%' },
  { key: 'avg_rating', icon: Star, value: '4.6/5', change: '+0.2' },
];

const monthlyData = [
  { month: 'Sep', appointments: 28, patients: 22 },
  { month: 'Oct', appointments: 35, patients: 28 },
  { month: 'Nov', appointments: 42, patients: 34 },
  { month: 'Dec', appointments: 38, patients: 30 },
  { month: 'Jan', appointments: 45, patients: 38 },
  { month: 'Fév', appointments: 52, patients: 42 },
];

const DoctorAnalytics = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.analytics.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.analytics.subtitle')}</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`doctor.analytics.stats.${stat.key}`)}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-primary mt-1">{stat.change} {t('admin.stats.from_last_month')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('doctor.analytics.appointments_chart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{d.month}</span>
                    <div className="flex-1 h-6 bg-accent/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(d.appointments / 60) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{d.appointments}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('doctor.analytics.patients_chart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{d.month}</span>
                    <div className="flex-1 h-6 bg-accent/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${(d.patients / 50) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{d.patients}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAnalytics;
