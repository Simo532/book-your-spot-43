import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface PersonalStepProps {
  lastName: string;
  setLastName: (v: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  birthDate: string;
  setBirthDate: (v: string) => void;
}

const PersonalStep = ({ lastName, setLastName, firstName, setFirstName, gender, setGender, birthDate, setBirthDate }: PersonalStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('onboarding.doctor.last_name')}</Label>
          <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={t('onboarding.doctor.last_name_placeholder')} />
        </div>
        <div className="space-y-2">
          <Label>{t('onboarding.doctor.first_name')}</Label>
          <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={t('onboarding.doctor.first_name_placeholder')} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('onboarding.common.gender')}</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger><SelectValue placeholder={t('onboarding.common.select_gender')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('onboarding.common.male')}</SelectItem>
              <SelectItem value="female">{t('onboarding.common.female')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('onboarding.common.birth_date')}</Label>
          <Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </div>
      </div>
    </div>
  );
};

export default PersonalStep;
