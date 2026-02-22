import { useTranslation } from 'react-i18next';
import { Camera, MapPin, Phone, Mail, Stethoscope, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DoctorLayout from '@/components/DoctorLayout';

const DoctorProfile = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.profile.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.profile.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <Card className="lg:col-span-1">
            <CardContent className="pt-6 text-center">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">MB</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="font-bold text-lg mt-4">Dr. Mohamed Benali</h2>
              <p className="text-sm text-muted-foreground">Cardiologie</p>
              <Badge className="mt-2">🥇 Gold</Badge>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>123 Rue Didouche, Alger</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>0555 12 34 56</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>dr.benali@email.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>2,500 DA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">{t('doctor.profile.edit')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.last_name')}</Label>
                  <Input defaultValue="Benali" />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.first_name')}</Label>
                  <Input defaultValue="Mohamed" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('auth.email')}</Label>
                  <Input defaultValue="dr.benali@email.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.phone')}</Label>
                  <Input defaultValue="0555 12 34 56" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('onboarding.doctor.specialty')}</Label>
                <Input defaultValue="Cardiologie" disabled />
              </div>

              <div className="space-y-2">
                <Label>{t('onboarding.doctor.select_tags')}</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Échocardiographie</Badge>
                  <Badge variant="secondary">Hypertension</Badge>
                  <Badge variant="secondary">Insuffisance cardiaque</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.address')}</Label>
                  <Input defaultValue="123 Rue Didouche" />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.city')}</Label>
                  <Input defaultValue="Alger" />
                </div>
                <div className="space-y-2">
                  <Label>{t('onboarding.doctor.wilaya')}</Label>
                  <Input defaultValue="Alger" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('onboarding.doctor.consult_price')}</Label>
                <Input defaultValue="2500" type="number" />
              </div>

              <div className="flex justify-end">
                <Button>{t('admin.save')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
