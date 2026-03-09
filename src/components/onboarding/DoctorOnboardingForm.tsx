import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, FileText, Stethoscope, MapPin, DollarSign, Camera, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import PersonalStep from './steps/PersonalStep';
import CoordinatesStep from './steps/CoordinatesStep';
import AboutStep from './steps/AboutStep';
import SpecialtyStep from './steps/SpecialtyStep';
import CabinetStep from './steps/CabinetStep';
import PricingStep from './steps/PricingStep';
import PhotoStep from './steps/PhotoStep';

const STEPS = [
  { icon: User, key: 'personal' },
  { icon: Phone, key: 'coordinates' },
  { icon: FileText, key: 'about' },
  { icon: Stethoscope, key: 'specialty' },
  { icon: MapPin, key: 'cabinet' },
  { icon: DollarSign, key: 'pricing' },
  { icon: Camera, key: 'photo' },
];

const MOCK_SPECIALTIES = [
  { id: '1', name: 'Généraliste', tags: ['Médecine familiale', 'Check-up', 'Vaccinations'] },
  { id: '2', name: 'Dentiste', tags: ['Orthodontie', 'Implants', 'Blanchiment'] },
  { id: '3', name: 'Cardiologue', tags: ['Échocardiographie', 'Hypertension', 'Arythmie'] },
  { id: '4', name: 'Dermatologue', tags: ['Acné', 'Eczéma', 'Dermatologie esthétique'] },
  { id: '5', name: 'Ophtalmologue', tags: ['Chirurgie laser', 'Glaucome', 'Cataracte'] },
  { id: '6', name: 'Pédiatre', tags: ['Néonatologie', 'Croissance', 'Allergies'] },
  { id: '7', name: 'Gynécologue', tags: ['Obstétrique', 'Échographie', 'Fertilité'] },
  { id: '8', name: 'ORL', tags: ['Audiologie', 'Sinusite', 'Amygdales'] },
  { id: '9', name: 'Psychiatre', tags: ['Dépression', 'Anxiété', 'Thérapie'] },
  { id: '10', name: 'Urologue', tags: ['Calculs rénaux', 'Prostate', 'Incontinence'] },
];

interface DoctorOnboardingFormProps {
  showPassword?: boolean;
  onComplete?: (data: any) => void;
  compact?: boolean;
}

const DoctorOnboardingForm = ({ showPassword = false, onComplete, compact = false }: DoctorOnboardingFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [cabinetAddress, setCabinetAddress] = useState('');
  const [cabinetCity, setCabinetCity] = useState('');
  const [cabinetWilaya, setCabinetWilaya] = useState('');
  const [businessCard, setBusinessCard] = useState<string | null>(null);
  const [consultPrice, setConsultPrice] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const progress = ((step + 1) / STEPS.length) * 100;

  const handleFileUpload = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleFinish = () => {
    onComplete?.({
      lastName, firstName, gender, birthDate, email, phone, password,
      bio, yearsExp, selectedSpecialty, selectedTags,
      cabinetAddress, cabinetCity, cabinetWilaya, consultPrice, profilePhoto, businessCard,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <PersonalStep {...{ lastName, setLastName, firstName, setFirstName, gender, setGender, birthDate, setBirthDate }} />;
      case 1: return <CoordinatesStep {...{ email, setEmail, phone, setPhone, password, setPassword, showPassword }} />;
      case 2: return <AboutStep {...{ bio, setBio, yearsExp, setYearsExp }} />;
      case 3: return <SpecialtyStep {...{ selectedSpecialty, setSelectedSpecialty, selectedTags, toggleTag, setSelectedTags, specialtySearch, setSpecialtySearch, specialties: MOCK_SPECIALTIES }} />;
      case 4: return <CabinetStep {...{ cabinetAddress, setCabinetAddress, cabinetCity, setCabinetCity, cabinetWilaya, setCabinetWilaya, businessCard, onFileUpload: handleFileUpload, setBusinessCard }} />;
      case 5: return <PricingStep {...{ consultPrice, setConsultPrice }} />;
      case 6: return <PhotoStep {...{ profilePhoto, onFileUpload: handleFileUpload, setProfilePhoto }} />;
      default: return null;
    }
  };

  return (
    <div className={compact ? '' : 'max-w-2xl mx-auto'}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          {!compact && <h2 className="text-lg font-bold">{t('onboarding.doctor.title')}</h2>}
          <span className="text-sm text-muted-foreground">{step + 1}/{STEPS.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <button key={s.key} onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 transition-colors ${i === step ? 'text-primary' : i < step ? 'text-primary/60 cursor-pointer' : 'text-muted-foreground/40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${i === step ? 'border-primary bg-primary/10' : i < step ? 'border-primary/40 bg-primary/5' : 'border-muted bg-muted/50'}`}>
                  {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="text-[9px] font-medium hidden sm:block">{t(`onboarding.doctor.steps.${s.key}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold mb-1">{t(`onboarding.doctor.step_titles.${STEPS[step].key}`)}</h3>
          <p className="text-sm text-muted-foreground mb-5">{t(`onboarding.doctor.step_descs.${STEPS[step].key}`)}</p>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" />{t('onboarding.doctor.previous')}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} className="gap-1.5">{t('onboarding.doctor.next')}<ChevronRight className="h-4 w-4" /></Button>
        ) : (
          <Button onClick={handleFinish} className="gap-1.5" disabled={!profilePhoto}><CheckCircle2 className="h-4 w-4" />{t('onboarding.doctor.finish')}</Button>
        )}
      </div>
    </div>
  );
};

export default DoctorOnboardingForm;
