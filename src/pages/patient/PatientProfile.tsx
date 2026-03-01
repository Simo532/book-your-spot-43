import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PatientLayout from '@/components/PatientLayout';

const PatientProfile = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: 'Sara',
    lastName: 'Alaoui',
    email: 'sara.alaoui@email.com',
    phone: '+213 555 123 456',
    address: '12 Rue Didouche Mourad, Alger',
  });

  return (
    <PatientLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.profile.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('patient.profile.subtitle')}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">SA</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-lg">{form.firstName} {form.lastName}</p>
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
                <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <Button className="gap-2 mt-2">
                <Save className="h-4 w-4" />
                {t('admin.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default PatientProfile;
