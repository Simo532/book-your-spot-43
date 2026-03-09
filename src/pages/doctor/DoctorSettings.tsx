import { useTranslation } from 'react-i18next';
import { Bell, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DoctorLayout from '@/components/DoctorLayout';
import AvailabilityManager from '@/components/doctor/AvailabilityManager';
import { useAuth } from '@/contexts/AuthContext';
import { useDoctorByUserId } from '@/hooks/useApiHooks';
import { authService } from '@/services/authService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const DoctorSettings = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { data: doctor } = useDoctorByUserId(userId || '');
  const qc = useQueryClient();

  const { data: notifPrefs } = useQuery({
    queryKey: ['notifPrefs', userId],
    queryFn: () => authService.getNotificationPreferences(userId!),
    enabled: !!userId,
  });

  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  useEffect(() => {
    if (notifPrefs) {
      setPushEnabled(notifPrefs.pushEnabled);
      setEmailEnabled(notifPrefs.emailEnabled);
    }
  }, [notifPrefs]);

  const updateNotifMutation = useMutation({
    mutationFn: () => authService.updateNotificationPreferences(userId!, pushEnabled, emailEnabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifPrefs'] }),
  });

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.settings.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.settings.subtitle')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t('doctor.settings.notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Push Notifications</Label>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Email Notifications</Label>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>
            <Button size="sm" onClick={() => updateNotifMutation.mutate()} disabled={updateNotifMutation.isPending}>
              {t('admin.save')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('doctor.settings.availability_section')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvailabilityManager />
          </CardContent>
        </Card>

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
      </div>
    </DoctorLayout>
  );
};

export default DoctorSettings;
