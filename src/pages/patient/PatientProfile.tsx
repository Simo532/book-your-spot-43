import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PatientLayout from '@/components/PatientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientByUserId, useUpdatePatient } from '@/hooks/usePatientHooks';
import { toast } from '@/hooks/use-toast';

const PatientProfile = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { data: patient, isLoading } = usePatientByUserId(userId || '');
  const updateMutation = useUpdatePatient();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', street: '',
  });

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName, lastName: patient.lastName,
        email: patient.email, phone: patient.phone,
        street: patient.address?.street || '',
      });
    }
  }, [patient]);

  const handleSave = () => {
    if (!patient) return;
    updateMutation.mutate({
      id: patient.id,
      dto: {
        firstName: form.firstName, lastName: form.lastName,
        email: form.email, phone: form.phone,
        birthDate: patient.birthDate, gender: patient.gender,
        street: form.street, city: patient.address?.city,
        state: patient.address?.state, zipCode: patient.address?.zipCode,
      },
    }, {
      onSuccess: () => toast({ title: t('admin.save') }),
    });
  };

  const initials = patient ? `${patient.firstName[0]}${patient.lastName[0]}` : '';

  return (
    <PatientLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.profile.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('patient.profile.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : patient ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={patient.profilePicture} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold text-lg">{patient.firstName} {patient.lastName}</p>
                  <p className="text-sm text-muted-foreground">{t('patient.nav.patient')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('patient.profile.first_name')}</Label>
                    <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('patient.profile.last_name')}</Label>
                    <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{t('patient.profile.email')}</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{t('patient.profile.phone')}</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{t('patient.profile.address')}</Label>
                  <Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                </div>
                <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2 mt-2">
                  <Save className="h-4 w-4" />
                  {t('admin.save')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PatientLayout>
  );
};

export default PatientProfile;
