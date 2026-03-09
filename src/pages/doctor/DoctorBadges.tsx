import { useTranslation } from 'react-i18next';
import { Star, CalendarCheck, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DoctorLayout from '@/components/DoctorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctorByUserId, useDoctorCompletedCount } from '@/hooks/useApiHooks';
import { useAllBadges } from '@/hooks/useBadgeHooks';

const DoctorBadges = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { data: doctor } = useDoctorByUserId(userId || '');
  const { data: badges, isLoading } = useAllBadges();
  const { data: completedCount } = useDoctorCompletedCount(doctor?.id || '');

  const currentReviews = doctor?.reviewCount || 0;
  const currentAppointments = (completedCount as number) || 0;
  const currentBadge = doctor?.badge;

  // Find the next badge target
  const sortedBadges = (badges || []).slice().sort((a, b) => a.appointmentNumber - b.appointmentNumber);
  const nextBadge = sortedBadges.find(b => b.appointmentNumber > currentAppointments || b.commentNumber > currentReviews);

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.badges.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.badges.subtitle')}</p>
        </div>

        {/* Current level */}
        {currentBadge && (
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="text-5xl">🏆</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{t('doctor.badges.current_level')}: {currentBadge.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t('doctor.badges.current_desc')}</p>
                  {nextBadge && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{t('doctor.badges.reviews_progress')}</span>
                          <span className="font-medium">{currentReviews}/{nextBadge.commentNumber}</span>
                        </div>
                        <Progress value={(currentReviews / nextBadge.commentNumber) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{t('doctor.badges.appointments_progress')}</span>
                          <span className="font-medium">{currentAppointments}/{nextBadge.appointmentNumber}</span>
                        </div>
                        <Progress value={(currentAppointments / nextBadge.appointmentNumber) * 100} className="h-2" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBadges.map((badge) => {
              const unlocked = currentReviews >= badge.commentNumber && currentAppointments >= badge.appointmentNumber;
              return (
                <Card key={badge.id} className={unlocked ? '' : 'opacity-50'}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: badge.color + '20', color: badge.color }}>
                      <span className="text-2xl font-bold">{badge.title[0]}</span>
                    </div>
                    <h3 className="font-bold text-lg">{badge.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      {unlocked ? (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          {t('doctor.badges.unlocked')}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{t('doctor.badges.locked')}</Badge>
                      )}
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground space-y-1">
                      <p><Star className="h-3.5 w-3.5 inline mr-1" />{badge.commentNumber} {t('admin.badges.reviews')}</p>
                      <p><CalendarCheck className="h-3.5 w-3.5 inline mr-1" />{badge.appointmentNumber} {t('admin.badges.appointments_label')}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorBadges;
