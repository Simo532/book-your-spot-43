import { useTranslation } from 'react-i18next';
import { Users, CalendarCheck, Stethoscope, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';

const statCards = [
  { key: 'total_users', icon: Users, value: '12,458', change: '+12%' },
  { key: 'total_doctors', icon: Stethoscope, value: '5,230', change: '+8%' },
  { key: 'appointments', icon: CalendarCheck, value: '48,392', change: '+23%' },
  { key: 'revenue', icon: TrendingUp, value: '€124,500', change: '+18%' },
];

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.dashboard_title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.dashboard_subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`admin.stats.${stat.key}`)}
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

        {/* Recent activity placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('admin.recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-2 w-24 bg-muted rounded animate-pulse mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
