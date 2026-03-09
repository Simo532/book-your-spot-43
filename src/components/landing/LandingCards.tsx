import { memo } from 'react';
import { motion } from 'framer-motion';
import CountUp from './CountUp';
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export const StatCard = memo(({ stat }: { stat: { value: number; suffix: string; label: string; icon: React.ElementType } }) => {
  const CountUp = require('./CountUp').default;
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
      <CountUp target={stat.value} suffix={stat.suffix} className="text-2xl sm:text-3xl font-bold text-foreground" />
      <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
    </div>
  );
});
StatCard.displayName = 'StatCard';

export const FeatureCard = memo(({ f, i }: { f: { icon: React.ElementType; title: string; desc: string; color: string }; i: number }) => (
  <motion.div
    key={f.title}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={fadeUp}
    custom={i + 1}
    className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-[var(--shadow-card)] transition-all duration-300"
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ backgroundColor: `${f.color}15` }}>
      <f.icon className="h-6 w-6" style={{ color: f.color }} />
    </div>
    <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
  </motion.div>
));
FeatureCard.displayName = 'FeatureCard';

export const StepCard = memo(({ step, i }: { step: { num: string; title: string; desc: string; icon: React.ElementType }; i: number }) => (
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center relative">
    <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-primary/10 border-2 border-primary/20 relative z-10">
      <step.icon className="h-6 w-6 text-primary" />
    </div>
    <span className="text-xs font-bold text-primary uppercase tracking-widest">Step {step.num}</span>
    <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
  </motion.div>
));
StepCard.displayName = 'StepCard';
