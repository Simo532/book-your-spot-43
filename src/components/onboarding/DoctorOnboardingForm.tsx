import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, FileText, Stethoscope, MapPin, DollarSign, Camera,
  CheckCircle2, ChevronRight, ChevronLeft, Upload, Tag, Search, X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  // Step 1 - Personal
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Step 2 - Coordinates
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Step 3 - About
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');

  // Step 4 - Specialty
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [specialtySearch, setSpecialtySearch] = useState('');

  // Step 5 - Cabinet
  const [cabinetAddress, setCabinetAddress] = useState('');
  const [cabinetCity, setCabinetCity] = useState('');
  const [cabinetWilaya, setCabinetWilaya] = useState('');
  const [businessCard, setBusinessCard] = useState<string | null>(null);

  // Step 6 - Pricing
  const [consultPrice, setConsultPrice] = useState('');

  // Step 7 - Photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const progress = ((step + 1) / STEPS.length) * 100;
  const filteredSpecialties = MOCK_SPECIALTIES.filter(s => s.name.toLowerCase().includes(specialtySearch.toLowerCase()));
  const currentSpecialtyTags = MOCK_SPECIALTIES.find(s => s.id === selectedSpecialty)?.tags || [];

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
    const data = {
      lastName, firstName, gender, birthDate, email, phone, password,
      bio, yearsExp, selectedSpecialty, selectedTags,
      cabinetAddress, cabinetCity, cabinetWilaya, consultPrice, profilePhoto, businessCard,
    };
    onComplete?.(data);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
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

      case 1:
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

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.bio')}</Label>
              <Textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={t('onboarding.doctor.bio_placeholder')}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.years_exp')}</Label>
              <Input type="number" value={yearsExp} onChange={e => setYearsExp(e.target.value)} placeholder="Ex: 10" min="0" />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.specialty')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder={t('onboarding.doctor.search_specialty')}
                  value={specialtySearch}
                  onChange={e => setSpecialtySearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {filteredSpecialties.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setSelectedSpecialty(s.id); setSelectedTags([]); setSpecialtySearch(''); }}
                    className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                      selectedSpecialty === s.id ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            {currentSpecialtyTags.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {t('onboarding.doctor.select_tags')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {currentSpecialtyTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer transition-colors"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
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
            {/* Map */}
            <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
              <iframe
                title="Cabinet location"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=2.8,36.6,3.2,36.85&layer=mapnik`}
              />
            </div>
            {/* Business card */}
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.business_card')}</Label>
              <div className="w-full h-36 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {businessCard ? (
                  <img src={businessCard} alt="Card" className="w-full h-full object-contain" />
                ) : (
                  <label className="cursor-pointer text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">{t('onboarding.doctor.upload_card')}</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setBusinessCard)} />
                  </label>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.consult_price')}</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={consultPrice}
                  onChange={e => setConsultPrice(e.target.value)}
                  placeholder="2000"
                  className="pr-16"
                />
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

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <label className="cursor-pointer">
                <Button variant="outline" className="gap-1.5" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    {t('onboarding.doctor.upload')}
                  </span>
                </Button>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setProfilePhoto)} />
              </label>
              <p className="text-xs text-destructive font-medium">{t('onboarding.doctor.photo_required')}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={compact ? '' : 'max-w-2xl mx-auto'}>
      {/* Progress */}
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
              <button
                key={s.key}
                onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  i === step ? 'text-primary' : i < step ? 'text-primary/60 cursor-pointer' : 'text-muted-foreground/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  i === step ? 'border-primary bg-primary/10' : i < step ? 'border-primary/40 bg-primary/5' : 'border-muted bg-muted/50'
                }`}>
                  {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="text-[9px] font-medium hidden sm:block">
                  {t(`onboarding.doctor.steps.${s.key}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-base font-semibold mb-1">{t(`onboarding.doctor.step_titles.${STEPS[step].key}`)}</h3>
          <p className="text-sm text-muted-foreground mb-5">{t(`onboarding.doctor.step_descs.${STEPS[step].key}`)}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" />
          {t('onboarding.doctor.previous')}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} className="gap-1.5">
            {t('onboarding.doctor.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} className="gap-1.5" disabled={!profilePhoto}>
            <CheckCircle2 className="h-4 w-4" />
            {t('onboarding.doctor.finish')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DoctorOnboardingForm;
