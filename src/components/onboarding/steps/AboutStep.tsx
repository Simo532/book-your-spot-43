import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface AboutStepProps {
  bio: string;
  setBio: (v: string) => void;
  yearsExp: string;
  setYearsExp: (v: string) => void;
}

const AboutStep = ({ bio, setBio, yearsExp, setYearsExp }: AboutStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.bio')}</Label>
        <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={t('onboarding.doctor.bio_placeholder')} rows={4} />
      </div>
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.years_exp')}</Label>
        <Input type="number" value={yearsExp} onChange={e => setYearsExp(e.target.value)} placeholder="Ex: 10" min="0" />
      </div>
    </div>
  );
};

export default AboutStep;
