import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, MapPin, ShieldCheck, ArrowRight, Star, CheckCircle2, Users, Clock, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CountUp from '@/components/landing/CountUp';
import { fadeUp, FeatureCard, StepCard } from '@/components/landing/LandingCards';

const Index = () => {
  const { t } = useTranslation();

  const features = useMemo(() => [
    { icon: Search, title: t('landing.feature_search_title'), desc: t('landing.feature_search_desc'), color: 'hsl(231 99% 66%)' },
    { icon: CalendarCheck, title: t('landing.feature_booking_title'), desc: t('landing.feature_booking_desc'), color: 'hsl(260 80% 60%)' },
    { icon: MapPin, title: t('landing.feature_map_title'), desc: t('landing.feature_map_desc'), color: 'hsl(231 70% 55%)' },
    { icon: ShieldCheck, title: t('landing.feature_secure_title'), desc: t('landing.feature_secure_desc'), color: 'hsl(260 60% 55%)' },
  ], [t]);

  const steps = useMemo(() => [
    { num: '01', title: t('landing.how_step1_title'), desc: t('landing.how_step1_desc'), icon: Search },
    { num: '02', title: t('landing.how_step2_title'), desc: t('landing.how_step2_desc'), icon: Clock },
    { num: '03', title: t('landing.how_step3_title'), desc: t('landing.how_step3_desc'), icon: CheckCircle2 },
  ], [t]);

  const stats = useMemo(() => [
    { value: 5000, suffix: '+', label: t('landing.stats_doctors'), icon: Stethoscope },
    { value: 120, suffix: 'K+', label: t('landing.stats_patients'), icon: Users },
    { value: 500, suffix: 'K+', label: t('landing.stats_appointments'), icon: CalendarCheck },
    { value: 48, suffix: '', label: t('landing.stats_cities'), icon: MapPin },
  ], [t]);

  const trustItems = useMemo(() => [
    { num: '99.9%', label: 'Uptime reliability' },
    { num: '< 2min', label: 'Average booking time' },
    { num: '4.9/5', label: 'User satisfaction' },
  ], []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute top-32 right-[5%] w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[80px]" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[80px]" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary text-sm font-medium mb-8">
            <Star className="h-3.5 w-3.5 fill-primary" />
            {t('landing.trusted_by')}
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.15]">
            {t('landing.hero_title')}<br /><span className="text-gradient">{t('landing.hero_title_highlight')}</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('landing.hero_subtitle')}
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="text-base px-8 rounded-xl shadow-[var(--shadow-primary)] gap-2 h-12" style={{ background: 'var(--gradient-primary)' }}>
                {t('landing.cta_search')}<ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="text-base px-8 rounded-xl h-12 border-2">{t('landing.cta_join')}</Button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-5 text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <CountUp target={stat.value} suffix={stat.suffix} className="text-2xl sm:text-3xl font-bold text-foreground" />
                <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">{t('landing.features_title')}</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t('landing.features_subtitle')}</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">{t('landing.how_title')}</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-border" />
            {steps.map((step, i) => <StepCard key={step.num} step={step} i={i} />)}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Why us</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Trusted by Healthcare Professionals</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {trustItems.map((item, i) => (
              <motion.div key={item.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center p-8 rounded-2xl bg-card border border-border">
                <div className="text-3xl font-extrabold text-gradient">{item.num}</div>
                <div className="text-sm text-muted-foreground mt-2 font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-4xl mx-auto rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden" style={{ background: 'var(--gradient-primary)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">{t('landing.cta_title')}</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto text-lg">{t('landing.cta_subtitle')}</p>
            <Link to="/signup">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-base px-8 gap-2 rounded-xl h-12 shadow-[var(--shadow-elevated)]">
                {t('landing.cta_button')}<ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
