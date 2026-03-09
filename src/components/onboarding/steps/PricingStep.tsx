import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface PricingStepProps {
  consultPrice: string;
  setConsultPrice: (v: string) => void;
}

const PricingStep = ({ consultPrice, setConsultPrice }: PricingStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.consult_price')}</Label>
        <div className="relative">
          <Input type="number" value={consultPrice} onChange={e => setConsultPrice(e.target.value)} placeholder="2000" className="pr-16" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">DZD</span>
        </div>
      </div>
      {consultPrice && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <p className="text-sm text-emerald-700 font-medium">
            💰 {t('onboarding.doctor.your_gain')}: <span className="text-lg font-bold">{Math.round(Number(consultPrice) * 0.9).toLocaleString()} DZD</span>
            <span className="text-xs ml-1">(90%)</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default PricingStep;
