import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PatientLayout from '@/components/PatientLayout';
import { tokenStorage } from '@/services/api';
import { authService } from '@/services/authService';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const PatientPassword = () => {
  const { t } = useTranslation();
  const userEmail = tokenStorage.getUserEmail();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const isValid = current && newPass && newPass === confirm && newPass.length >= 8;

  const updatePasswordMutation = useMutation({
    mutationFn: () => authService.updatePassword(userEmail!, newPass),
    onSuccess: () => {
      toast({ title: t('patient.password.update') });
      setCurrent('');
      setNewPass('');
      setConfirm('');
    },
    onError: () => {
      toast({ title: 'Error', variant: 'destructive' });
    },
  });

  return (
    <PatientLayout>
      <div className="space-y-6 max-w-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('patient.password.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('patient.password.subtitle')}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label>{t('patient.password.current')}</Label>
              <div className="relative">
                <Input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('patient.password.new')}</Label>
              <div className="relative">
                <Input type={showNew ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPass && newPass.length < 8 && <p className="text-xs text-destructive">{t('patient.password.min_length')}</p>}
            </div>
            <div className="space-y-2">
              <Label>{t('patient.password.confirm')}</Label>
              <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
              {confirm && newPass !== confirm && <p className="text-xs text-destructive">{t('patient.password.mismatch')}</p>}
            </div>
            <Button disabled={!isValid || updatePasswordMutation.isPending} onClick={() => updatePasswordMutation.mutate()} className="gap-2">
              <Save className="h-4 w-4" />
              {t('patient.password.update')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
};

export default PatientPassword;
