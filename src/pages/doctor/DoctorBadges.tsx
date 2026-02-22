import { useTranslation } from 'react-i18next';
import { Award, Star, CalendarCheck, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DoctorLayout from '@/components/DoctorLayout';

const badges = [
  { id: 1, name: 'Bronze', icon: '🥉', minReviews: 10, minAppointments: 25, unlocked: true },
  { id: 2, name: 'Silver', icon: '🥈', minReviews: 50, minAppointments: 100, unlocked: true },
  { id: 3, name: 'Gold', icon: '🥇', minReviews: 100, minAppointments: 250, unlocked: true },
  { id: 4, name: 'Platinum', icon: '💎', minReviews: 200, minAppointments: 500, unlocked: false },
  { id: 5, name: 'Superdoc', icon: '🏆', minReviews: 500, minAppointments: 1000, unlocked: false },
];

const currentStats = { reviews: 124, appointments: 348 };

const DoctorBadges = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.badges.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.badges.subtitle')}</p>
        </div>

        {/* Current level */}
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="text-5xl">🥇</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{t('doctor.badges.current_level')}: Gold</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('doctor.badges.current_desc')}</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{t('doctor.badges.reviews_progress')}</span>
                      <span className="font-medium">{currentStats.reviews}/200</span>
                    </div>
                    <Progress value={(currentStats.reviews / 200) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{t('doctor.badges.appointments_progress')}</span>
                      <span className="font-medium">{currentStats.appointments}/500</span>
                    </div>
                    <Progress value={(currentStats.appointments / 500) * 100} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <Card key={badge.id} className={badge.unlocked ? '' : 'opacity-50'}>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">{badge.icon}</div>
                <h3 className="font-bold text-lg">{badge.name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {badge.unlocked ? (
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      {t('doctor.badges.unlocked')}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{t('doctor.badges.locked')}</Badge>
                  )}
                </div>
                <div className="mt-4 text-sm text-muted-foreground space-y-1">
                  <p><Star className="h-3.5 w-3.5 inline mr-1" />{badge.minReviews} {t('admin.badges.reviews')}</p>
                  <p><CalendarCheck className="h-3.5 w-3.5 inline mr-1" />{badge.minAppointments} {t('admin.badges.appointments_label')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorBadges;
