import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import { BarChart3, TrendingUp, Users, CalendarCheck } from 'lucide-react';

const AdminAnalytics = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.analytics.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.analytics.subtitle')}</p>
        </div>

        {/* Charts placeholders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t('admin.analytics.user_growth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/50 rounded-xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t('admin.analytics.chart_placeholder')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                {t('admin.analytics.appointments_trend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/50 rounded-xl flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">{t('admin.analytics.chart_placeholder')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.analytics.top_specialties')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Généraliste', 'Dentiste', 'Cardiologue', 'Dermatologue', 'Ophtalmologue'].map((spec, i) => (
                  <div key={spec} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{spec}</span>
                        <span className="text-muted-foreground">{Math.floor(Math.random() * 500 + 100)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${90 - i * 15}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('admin.analytics.top_cities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger'].map((city, i) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{city}</span>
                        <span className="text-muted-foreground">{Math.floor(Math.random() * 300 + 50)}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full"
                          style={{ width: `${85 - i * 14}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
