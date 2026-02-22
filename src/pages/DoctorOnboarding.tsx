import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Stethoscope, MapPin, DollarSign, Camera, Clock, CheckCircle2,
  ChevronRight, ChevronLeft, Plus, X, Upload, Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/Navbar';

const STEPS = [
  { icon: User, key: 'personal' },
  { icon: Stethoscope, key: 'specialty' },
  { icon: MapPin, key: 'address' },
  { icon: DollarSign, key: 'pricing' },
  { icon: Camera, key: 'photos' },
  { icon: Clock, key: 'availability' },
  { icon: CheckCircle2, key: 'summary' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const MOCK_SPECIALTIES = [
  { id: '1', name: 'Généraliste', tags: ['Médecine familiale', 'Check-up', 'Vaccinations'] },
  { id: '2', name: 'Dentiste', tags: ['Orthodontie', 'Implants', 'Blanchiment'] },
  { id: '3', name: 'Cardiologue', tags: ['Échocardiographie', 'Hypertension', 'Arythmie'] },
  { id: '4', name: 'Dermatologue', tags: ['Acné', 'Eczéma', 'Dermatologie esthétique'] },
  { id: '5', name: 'Ophtalmologue', tags: ['Chirurgie laser', 'Glaucome', 'Cataracte'] },
  { id: '6', name: 'Pédiatre', tags: ['Néonatologie', 'Croissance', 'Allergies'] },
];

const DoctorOnboarding = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  // Step 1 - Personal
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Step 2 - Specialty
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Step 3 - Address
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [wilaya, setWilaya] = useState('');

  // Step 4 - Pricing
  const [consultPrice, setConsultPrice] = useState('');
  const [currency] = useState('DZD');

  // Step 5 - Photos
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [businessCard, setBusinessCard] = useState<string | null>(null);

  // Step 6 - Availability
  const [availability, setAvailability] = useState<Record<string, { enabled: boolean; start: string; end: string }>>(() => {
    const init: Record<string, { enabled: boolean; start: string; end: string }> = {};
    DAYS.forEach(d => { init[d] = { enabled: false, start: '08:00', end: '17:00' }; });
    return init;
  });

  const progress = ((step + 1) / STEPS.length) * 100;
  const currentSpecialtyTags = MOCK_SPECIALTIES.find(s => s.id === selectedSpecialty)?.tags || [];

  const handleFileUpload = (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const updateTime = (day: string, field: 'start' | 'end', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
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
            <div className="space-y-2">
              <Label>{t('auth.email')}</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="dr@example.com" />
            </div>
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.phone')}</Label>
              <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+213 5XX XXX XXX" />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.specialty')}</Label>
              <Select value={selectedSpecialty} onValueChange={(v) => { setSelectedSpecialty(v); setSelectedTags([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder={t('onboarding.doctor.specialty_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SPECIALTIES.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.address')}</Label>
              <Input value={address} onChange={e => setAddress(e.target.value)} placeholder={t('onboarding.doctor.address_placeholder')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('onboarding.doctor.city')}</Label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder={t('onboarding.doctor.city_placeholder')} />
              </div>
              <div className="space-y-2">
                <Label>{t('onboarding.doctor.wilaya')}</Label>
                <Input value={wilaya} onChange={e => setWilaya(e.target.value)} placeholder={t('onboarding.doctor.wilaya_placeholder')} />
              </div>
            </div>
            {/* Map placeholder */}
            <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center border border-dashed border-border">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">{t('onboarding.doctor.map_placeholder')}</p>
              </div>
            </div>
          </div>
        );

      case 3:
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  {currency}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t('onboarding.doctor.price_hint')}</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.profile_photo')}</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <span>
                        <Upload className="h-3.5 w-3.5" />
                        {t('onboarding.doctor.upload')}
                      </span>
                    </Button>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload(setProfilePhoto)} />
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('onboarding.doctor.business_card')}</Label>
              <div className="w-full h-40 rounded-lg bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
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
          <div className="space-y-3">
            {DAYS.map(day => (
              <div key={day} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <Checkbox
                  checked={availability[day].enabled}
                  onCheckedChange={() => toggleDay(day)}
                />
                <span className="w-24 text-sm font-medium capitalize">
                  {t(`onboarding.doctor.days.${day}`)}
                </span>
                {availability[day].enabled ? (
                  <div className="flex items-center gap-2 ml-auto">
                    <Input
                      type="time"
                      value={availability[day].start}
                      onChange={e => updateTime(day, 'start', e.target.value)}
                      className="w-28 h-8 text-xs"
                    />
                    <span className="text-muted-foreground text-xs">→</span>
                    <Input
                      type="time"
                      value={availability[day].end}
                      onChange={e => updateTime(day, 'end', e.target.value)}
                      className="w-28 h-8 text-xs"
                    />
                  </div>
                ) : (
                  <span className="ml-auto text-xs text-muted-foreground">{t('onboarding.doctor.closed')}</span>
                )}
              </div>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SummaryItem label={t('onboarding.doctor.last_name')} value={lastName} />
              <SummaryItem label={t('onboarding.doctor.first_name')} value={firstName} />
              <SummaryItem label={t('auth.email')} value={email} />
              <SummaryItem label={t('onboarding.doctor.phone')} value={phone} />
              <SummaryItem label={t('onboarding.doctor.specialty')} value={MOCK_SPECIALTIES.find(s => s.id === selectedSpecialty)?.name || '-'} />
              <SummaryItem label={t('onboarding.doctor.consult_price')} value={consultPrice ? `${consultPrice} ${currency}` : '-'} />
              <SummaryItem label={t('onboarding.doctor.city')} value={city} />
              <SummaryItem label={t('onboarding.doctor.wilaya')} value={wilaya} />
            </div>
            {selectedTags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1.5">{t('onboarding.doctor.select_tags')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            {Object.entries(availability).filter(([, v]) => v.enabled).length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1.5">{t('onboarding.doctor.availability')}</p>
                <div className="space-y-1">
                  {Object.entries(availability).filter(([, v]) => v.enabled).map(([day, v]) => (
                    <p key={day} className="text-sm capitalize">
                      {t(`onboarding.doctor.days.${day}`)}: {v.start} - {v.end}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">{t('onboarding.doctor.title')}</h1>
            <span className="text-sm text-muted-foreground">{step + 1}/{STEPS.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          {/* Step indicators */}
          <div className="flex justify-between mt-4">
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
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                    i === step ? 'border-primary bg-primary/10' : i < step ? 'border-primary/40 bg-primary/5' : 'border-muted bg-muted/50'
                  }`}>
                    {i < step ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-medium hidden sm:block">
                    {t(`onboarding.doctor.steps.${s.key}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <Card className="shadow-[var(--shadow-card)]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-1">{t(`onboarding.doctor.step_titles.${STEPS[step].key}`)}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t(`onboarding.doctor.step_descs.${STEPS[step].key}`)}</p>
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
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('onboarding.doctor.previous')}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="gap-1.5">
              {t('onboarding.doctor.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button className="gap-1.5 shadow-[var(--shadow-primary)]">
              <CheckCircle2 className="h-4 w-4" />
              {t('onboarding.doctor.finish')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-muted/50 border border-border">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-medium mt-0.5">{value || '-'}</p>
  </div>
);

export default DoctorOnboarding;
