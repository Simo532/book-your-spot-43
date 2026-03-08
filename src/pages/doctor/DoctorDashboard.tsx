import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Clock, Users, DollarSign, Eye, ArrowUpRight, ArrowDownRight, Zap, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const statCards = [
  { key: 'today_appointments', icon: CalendarCheck, value: '8', change: '+2', color: 'text-primary' },
  { key: 'unread_messages', icon: MessageSquare, value: '3', color: 'text-amber-500' },
  { key: 'total_reviews', icon: Star, value: '124', change: '+5', color: 'text-yellow-500' },
  { key: 'monthly_patients', icon: Users, value: '86', change: '+12', color: 'text-emerald-500' },
  { key: 'profile_views', icon: Eye, value: '1,248', change: '+18%', color: 'text-violet-500' },
  { key: 'monthly_revenue', icon: DollarSign, value: '186,000 DZD', change: '+15%', color: 'text-primary' },
];

const weeklyAppointments = [
  { day: 'Lun', count: 6 }, { day: 'Mar', count: 8 }, { day: 'Mer', count: 5 },
  { day: 'Jeu', count: 9 }, { day: 'Ven', count: 7 }, { day: 'Sam', count: 4 },
];

const monthlyRevenue = [
  { month: 'Sep', revenue: 120000 }, { month: 'Oct', revenue: 145000 }, { month: 'Nov', revenue: 138000 },
  { month: 'Déc', revenue: 162000 }, { month: 'Jan', revenue: 175000 }, { month: 'Fév', revenue: 186000 },
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
];

const xpRulesForCarousel = [
  { code: 'REVIEW_RECEIVED', xpAmount: 30, description_fr: 'Gagnez 30 XP chaque fois qu\'un patient vous laisse un avis positif.', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { code: 'APPOINTMENT_COMPLETED', xpAmount: 50, description_fr: 'Gagnez 50 XP pour chaque rendez-vous terminé avec succès.', icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary/10' },
  { code: 'PROFILE_COMPLETED', xpAmount: 150, description_fr: 'Complétez votre profil à 100% et gagnez 150 XP bonus.', icon: Users, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { code: 'FIRST_APPOINTMENT', xpAmount: 100, description_fr: 'Recevez 100 XP pour votre tout premier rendez-vous sur la plateforme.', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { code: 'MONTHLY_STREAK', xpAmount: 200, description_fr: 'Restez actif tout le mois et gagnez 200 XP de bonus mensuel.', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { code: 'REFERRAL', xpAmount: 100, description_fr: 'Parrainez un confrère et gagnez 100 XP quand il s\'inscrit.', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

const DoctorDashboard = () => {
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

  const actionIcons: Record<string, typeof Star> = {
    REVIEW_RECEIVED: Star,
    APPOINTMENT_COMPLETED: CalendarCheck,
    PROFILE_COMPLETED: Users,
    FIRST_APPOINTMENT: Zap,
    MONTHLY_STREAK: TrendingUp,
    REFERRAL: MessageSquare,
  };

  return (
    <DoctorLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('doctor.dashboard.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('doctor.dashboard.subtitle')}</p>
          </div>
          <Button onClick={() => { setCarouselIndex(0); setShowXpModal(true); }} variant="outline" className="gap-2 border-primary/30 hover:bg-primary/5">
            <HelpCircle className="h-4 w-4 text-primary" />
            {t('doctor.dashboard.how_to_earn')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                {stat.change && <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-primary" />
                {t('doctor.dashboard.weekly_appointments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyAppointments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="RDV" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                {t('doctor.dashboard.revenue_trend')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => `${v.toLocaleString()} DZD`} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45% / 0.1)" strokeWidth={2} name="Revenus" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* XP History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              {t('doctor.dashboard.xp_history')}
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('doctor.dashboard.xp_total')}</p>
                <p className="text-lg font-bold text-primary">{totalXp} XP</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('doctor.dashboard.xp_this_month')}</p>
                <p className="text-lg font-bold text-emerald-600">{thisMonthXp} XP</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockXpHistory.slice(0, 6).map((entry) => {
                const Icon = actionIcons[entry.actionCode] || Zap;
                return (
                  <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{t(`doctor.dashboard.xp_actions.${entry.actionCode}`)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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

        {/* Monthly comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {t('doctor.dashboard.monthly_comparison')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: t('doctor.dashboard.monthly_stats.patients'), current: 86, previous: 74 },
                { label: t('doctor.dashboard.monthly_stats.appointments'), current: 142, previous: 128 },
                { label: t('doctor.dashboard.monthly_stats.revenue'), current: 186000, previous: 162000, suffix: ' DZD' },
                { label: t('doctor.dashboard.monthly_stats.reviews'), current: 18, previous: 13 },
              ].map((item, i) => {
                const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
                const isPositive = item.current >= item.previous;
                return (
                  <div key={i} className="p-3 rounded-xl bg-accent/30">
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-lg font-bold">{item.current.toLocaleString()}{item.suffix || ''}</p>
                    <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {change}% {t('doctor.dashboard.monthly_stats.vs_last')}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

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

      {/* How to earn XP modal */}
      <Dialog open={showXpModal} onOpenChange={setShowXpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              {t('doctor.dashboard.how_to_earn_title')}
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
                        {t(`doctor.dashboard.xp_actions.${rule.code}`)}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rule.description_fr}
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

export default DoctorDashboard;
