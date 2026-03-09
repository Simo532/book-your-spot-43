import { useState } from 'react';
import { formatDateTime } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Users, Zap, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface XpHistoryEntry {
  id: string;
  actionCode: string;
  xpAmount: number;
  createdAt: string;
}

const mockXpHistory: XpHistoryEntry[] = [
  { id: '1', actionCode: 'APPOINTMENT_COMPLETED', xpAmount: 50, createdAt: '2026-03-08T14:30:00' },
  { id: '2', actionCode: 'REVIEW_RECEIVED', xpAmount: 30, createdAt: '2026-03-07T11:00:00' },
  { id: '3', actionCode: 'APPOINTMENT_COMPLETED', xpAmount: 50, createdAt: '2026-03-06T16:45:00' },
  { id: '4', actionCode: 'REFERRAL', xpAmount: 100, createdAt: '2026-03-05T09:20:00' },
  { id: '5', actionCode: 'REVIEW_RECEIVED', xpAmount: 30, createdAt: '2026-03-04T13:10:00' },
  { id: '6', actionCode: 'MONTHLY_STREAK', xpAmount: 200, createdAt: '2026-03-01T00:00:00' },
  { id: '7', actionCode: 'APPOINTMENT_COMPLETED', xpAmount: 50, createdAt: '2026-02-28T10:30:00' },
  { id: '8', actionCode: 'PROFILE_COMPLETED', xpAmount: 150, createdAt: '2026-02-15T08:00:00' },
  { id: '9', actionCode: 'REVIEW_RECEIVED', xpAmount: 30, createdAt: '2026-02-10T09:00:00' },
  { id: '10', actionCode: 'APPOINTMENT_COMPLETED', xpAmount: 50, createdAt: '2026-02-05T11:15:00' },
  { id: '11', actionCode: 'FIRST_APPOINTMENT', xpAmount: 100, createdAt: '2026-01-20T10:00:00' },
  { id: '12', actionCode: 'REFERRAL', xpAmount: 100, createdAt: '2026-01-15T14:00:00' },
];

const xpRulesForCarousel = [
  { code: 'REVIEW_RECEIVED', xpAmount: 30, description_key: 'doctor.xp_points.rules.REVIEW_RECEIVED', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { code: 'APPOINTMENT_COMPLETED', xpAmount: 50, description_key: 'doctor.xp_points.rules.APPOINTMENT_COMPLETED', icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary/10' },
  { code: 'PROFILE_COMPLETED', xpAmount: 150, description_key: 'doctor.xp_points.rules.PROFILE_COMPLETED', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { code: 'FIRST_APPOINTMENT', xpAmount: 100, description_key: 'doctor.xp_points.rules.FIRST_APPOINTMENT', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { code: 'MONTHLY_STREAK', xpAmount: 200, description_key: 'doctor.xp_points.rules.MONTHLY_STREAK', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { code: 'REFERRAL', xpAmount: 100, description_key: 'doctor.xp_points.rules.REFERRAL', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

const actionIcons: Record<string, typeof Star> = {
  REVIEW_RECEIVED: Star,
  APPOINTMENT_COMPLETED: CalendarCheck,
  PROFILE_COMPLETED: Users,
  FIRST_APPOINTMENT: Zap,
  MONTHLY_STREAK: TrendingUp,
  REFERRAL: MessageSquare,
};

const DoctorXpPoints = () => {
  const { t } = useTranslation();
  const [showXpModal, setShowXpModal] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [[direction, isAnimating], setDirection] = useState<[number, boolean]>([0, false]);

  const totalXp = mockXpHistory.reduce((sum, h) => sum + h.xpAmount, 0);
  const thisMonthXp = mockXpHistory.filter(h => h.createdAt.startsWith('2026-03')).reduce((sum, h) => sum + h.xpAmount, 0);

  const goToSlide = (newIndex: number) => {
    if (isAnimating) return;
    const dir = newIndex > carouselIndex ? 1 : -1;
    setDirection([dir, true]);
    setCarouselIndex(newIndex);
  };

  const nextSlide = () => {
    if (carouselIndex < xpRulesForCarousel.length - 1) goToSlide(carouselIndex + 1);
  };
  const prevSlide = () => {
    if (carouselIndex > 0) goToSlide(carouselIndex - 1);
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <DoctorLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('doctor.xp_points.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('doctor.xp_points.subtitle')}</p>
          </div>
          <Button onClick={() => { setCarouselIndex(0); setShowXpModal(true); }} className="gap-2">
            <HelpCircle className="h-4 w-4" />
            {t('doctor.xp_points.how_to_earn')}
          </Button>
        </div>

        {/* XP Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('doctor.xp_points.total_xp')}</CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalXp} XP</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('doctor.xp_points.this_month')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{thisMonthXp} XP</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('doctor.xp_points.actions_count')}</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockXpHistory.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* XP History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              {t('doctor.xp_points.history')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockXpHistory.map((entry) => {
                const Icon = actionIcons[entry.actionCode] || Zap;
                return (
                  <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{t(`doctor.xp_points.actions.${entry.actionCode}`)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(entry.createdAt)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="font-bold text-emerald-600 bg-emerald-500/10">
                      +{entry.xpAmount} XP
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to earn XP modal */}
      <Dialog open={showXpModal} onOpenChange={setShowXpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              {t('doctor.xp_points.how_to_earn_title')}
            </DialogTitle>
          </DialogHeader>
          <div className="relative overflow-hidden min-h-[260px]">
            <AnimatePresence initial={false} custom={direction} onExitComplete={() => setDirection([direction, false])}>
              <motion.div
                key={carouselIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              >
                {(() => {
                  const rule = xpRulesForCarousel[carouselIndex];
                  const Icon = rule.icon;
                  return (
                    <>
                      <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center mb-4', rule.bg)}>
                        <Icon className={cn('h-10 w-10', rule.color)} />
                      </div>
                      <Badge variant="secondary" className="mb-3 font-bold text-base">
                        +{rule.xpAmount} XP
                      </Badge>
                      <h3 className="text-lg font-bold mb-2">
                        {t(`doctor.xp_points.actions.${rule.code}`)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {t(rule.description_key)}
                      </p>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="icon" onClick={prevSlide} disabled={carouselIndex === 0}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-1.5">
              {xpRulesForCarousel.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-300',
                    i === carouselIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                />
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={nextSlide} disabled={carouselIndex === xpRulesForCarousel.length - 1}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DoctorLayout>
  );
};

export default DoctorXpPoints;
