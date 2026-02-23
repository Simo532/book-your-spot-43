import { useTranslation } from 'react-i18next';
import { Bell, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DoctorLayout from '@/components/DoctorLayout';
import AvailabilityManager from '@/components/doctor/AvailabilityManager';

const DoctorSettings = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.settings.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.settings.subtitle')}</p>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('doctor.settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['new_appointment', 'cancelled_appointment', 'new_review', 'new_message'].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="flex-1">{t(`doctor.settings.notif.${key}`)}</Label>
                <Switch defaultChecked />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('doctor.settings.availability_section')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvailabilityManager />
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Label>{t('doctor.settings.auto_accept')}</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('doctor.settings.show_availability')}</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('doctor.settings.privacy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('doctor.settings.show_phone')}</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('doctor.settings.show_email')}</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('doctor.settings.profile_visible')}</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>{t('admin.save')}</Button>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorSettings;
