import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Phone, Mail, Stethoscope, DollarSign, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShimmerProfile } from '@/components/ui/shimmer';
import DoctorLayout from '@/components/DoctorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctorByUserId } from '@/hooks/useApiHooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorService } from '@/services/doctorService';
import { DoctorRequestDTO } from '@/types/doctor';
import { toast } from '@/hooks/use-toast';

const DoctorProfile = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { data: doctor, isLoading } = useDoctorByUserId(userId || '');
  const qc = useQueryClient();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', state: '', consultationFee: 0,
  });

  useEffect(() => {
    if (doctor) {
      setForm({
        firstName: doctor.firstName, lastName: doctor.lastName,
        email: doctor.email, phone: doctor.phone,
        street: doctor.address?.street || '', city: doctor.address?.city || '',
        state: doctor.address?.state || '', consultationFee: doctor.consultationFee,
      });
    }
  }, [doctor]);

  const updateMutation = useMutation({
    mutationFn: (dto: DoctorRequestDTO) => doctorService.update(doctor!.id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctor'] });
      toast({ title: t('admin.save') });
    },
  });

  const handleSave = () => {
    if (!doctor) return;
    updateMutation.mutate({
      firstName: form.firstName, lastName: form.lastName,
      email: form.email, phone: form.phone,
      specialityId: doctor.speciality.id, birthDate: doctor.birthDate,
      gender: doctor.gender, yearsOfExperience: doctor.yearsOfExperience,
      consultationFee: form.consultationFee,
      street: form.street, city: form.city, state: form.state,
    });
  };

  const initials = doctor ? `${doctor.firstName[0]}${doctor.lastName[0]}` : '';

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.profile.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.profile.subtitle')}</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : doctor ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="pt-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={doctor.profilePicture} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="font-bold text-lg mt-4">Dr. {doctor.firstName} {doctor.lastName}</h2>
                <p className="text-sm text-muted-foreground">{doctor.speciality.name}</p>
                {doctor.badge && <Badge className="mt-2">{doctor.badge.name}</Badge>}

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{doctor.address?.street || '-'}, {doctor.address?.city || ''}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{doctor.consultationFee} DA</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">{t('doctor.profile.edit')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.last_name')}</Label>
                    <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.first_name')}</Label>
                    <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('auth.email')}</Label>
                    <Input value={form.email} type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.phone')}</Label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.specialty')}</Label>
                  <Input value={doctor.speciality.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.select_tags')}</Label>
                  <div className="flex flex-wrap gap-2">
                    {doctor.tags.map(tag => (
                      <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.address')}</Label>
                    <Input value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.city')}</Label>
                    <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('onboarding.doctor.wilaya')}</Label>
                    <Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.consult_price')}</Label>
                  <Input value={form.consultationFee} type="number" onChange={e => setForm({ ...form, consultationFee: Number(e.target.value) })} />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-2">
                    <Save className="h-4 w-4" />
                    {t('admin.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
