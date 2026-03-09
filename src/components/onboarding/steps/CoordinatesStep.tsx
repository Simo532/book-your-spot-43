import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface CoordinatesStepProps {
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
}

const CoordinatesStep = ({ email, setEmail, phone, setPhone, password, setPassword, showPassword }: CoordinatesStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('auth.email')}</Label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="dr@example.com" />
      </div>
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.phone')}</Label>
        <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+213 5XX XXX XXX" />
      </div>
      {showPassword && (
        <div className="space-y-2">
          <Label>{t('auth.password')}</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
      )}
    </div>
  );
};

export default CoordinatesStep;
