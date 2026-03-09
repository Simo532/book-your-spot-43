import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CabinetStepProps {
  cabinetAddress: string;
  setCabinetAddress: (v: string) => void;
  cabinetCity: string;
  setCabinetCity: (v: string) => void;
  cabinetWilaya: string;
  setCabinetWilaya: (v: string) => void;
  businessCard: string | null;
  onFileUpload: (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBusinessCard: (v: string | null) => void;
}

const CabinetStep = ({ cabinetAddress, setCabinetAddress, cabinetCity, setCabinetCity, cabinetWilaya, setCabinetWilaya, businessCard, onFileUpload, setBusinessCard }: CabinetStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.address')}</Label>
        <Input value={cabinetAddress} onChange={e => setCabinetAddress(e.target.value)} placeholder={t('onboarding.doctor.address_placeholder')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('onboarding.doctor.city')}</Label>
          <Input value={cabinetCity} onChange={e => setCabinetCity(e.target.value)} placeholder={t('onboarding.doctor.city_placeholder')} />
        </div>
        <div className="space-y-2">
          <Label>{t('onboarding.doctor.wilaya')}</Label>
          <Input value={cabinetWilaya} onChange={e => setCabinetWilaya(e.target.value)} placeholder={t('onboarding.doctor.wilaya_placeholder')} />
        </div>
      </div>
      <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
        <iframe title="Cabinet location" width="100%" height="100%" style={{ border: 0 }} src="https://www.openstreetmap.org/export/embed.html?bbox=2.8,36.6,3.2,36.85&layer=mapnik" />
      </div>
      <div className="space-y-2">
        <Label>{t('onboarding.doctor.business_card')}</Label>
        <div className="w-full h-36 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
          {businessCard ? (
            <img src={businessCard} alt="Card" className="w-full h-full object-contain" />
          ) : (
            <label className="cursor-pointer text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{t('onboarding.doctor.upload_card')}</p>
              <input type="file" accept="image/*" className="hidden" onChange={onFileUpload(setBusinessCard)} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default CabinetStep;
