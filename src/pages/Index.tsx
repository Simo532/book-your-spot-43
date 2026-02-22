import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, MapPin, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
};

const Index = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Search, title: t('landing.feature_search_title'), desc: t('landing.feature_search_desc') },
    { icon: CalendarCheck, title: t('landing.feature_booking_title'), desc: t('landing.feature_booking_desc') },
    { icon: MapPin, title: t('landing.feature_map_title'), desc: t('landing.feature_map_desc') },
    { icon: ShieldCheck, title: t('landing.feature_secure_title'), desc: t('landing.feature_secure_desc') },
  ];

  const steps = [
    { num: '01', title: t('landing.how_step1_title'), desc: t('landing.how_step1_desc') },
    { num: '02', title: t('landing.how_step2_title'), desc: t('landing.how_step2_desc') },
    { num: '03', title: t('landing.how_step3_title'), desc: t('landing.how_step3_desc') },
  ];

  const stats = [
    { value: '5,000+', label: t('landing.stats_doctors') },
    { value: '120K+', label: t('landing.stats_patients') },
    { value: '500K+', label: t('landing.stats_appointments') },
    { value: '48', label: t('landing.stats_cities') },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-10 left-[5%] w-96 h-96 rounded-full bg-primary/3 blur-3xl" />

        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Star className="h-4 w-4 fill-primary" />
            {t('landing.trusted_by')}
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            {t('landing.hero_title')}
            <br />
            <span className="bg-gradient-to-r from-primary to-[hsl(260,90%,65%)] bg-clip-text text-transparent">
              {t('landing.hero_title_highlight')}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('landing.hero_subtitle')}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/search">
              <Button size="lg" className="text-base px-8 shadow-[var(--shadow-primary)] gap-2">
                {t('landing.cta_search')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="text-base px-8">
                {t('landing.cta_join')}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">{t('landing.features_title')}</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{t('landing.features_subtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="group p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">{t('landing.how_title')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="text-center"
              >
                <div className="text-5xl font-extrabold text-primary/15 mb-4">{step.num}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto rounded-3xl p-12 text-center"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('landing.cta_title')}
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {t('landing.cta_subtitle')}
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base px-8 gap-2">
              {t('landing.cta_button')}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
