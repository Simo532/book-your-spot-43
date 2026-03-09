import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';

type Step = 'email' | 'otp' | 'newPassword';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await authService.generateResetPasswordToken(email);
      toast.success(t('auth.otp_sent', 'Code envoyé à votre email'));
      setStep('otp');
    } catch {
      toast.error(t('auth.otp_send_error', 'Erreur lors de l\'envoi du code'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await authService.verifyResetPasswordToken(email, otp);
      toast.success(t('auth.otp_verified', 'Code vérifié avec succès'));
      setStep('newPassword');
    } catch {
      toast.error(t('auth.otp_invalid', 'Code invalide ou expiré'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(t('auth.password_mismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t('auth.password_too_short', 'Le mot de passe doit contenir au moins 6 caractères'));
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(email, newPassword);
      toast.success(t('auth.password_reset_success', 'Mot de passe réinitialisé avec succès'));
      navigate('/login');
    } catch {
      toast.error(t('auth.password_reset_error', 'Erreur lors de la réinitialisation'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await authService.generateResetPasswordToken(email);
      toast.success(t('auth.otp_resent', 'Code renvoyé'));
    } catch {
      toast.error(t('auth.otp_send_error', 'Erreur lors de l\'envoi du code'));
    } finally {
      setLoading(false);
    }
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-6">
      {['email', 'otp', 'newPassword'].map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            step === s ? 'bg-primary text-primary-foreground' :
            ['email', 'otp', 'newPassword'].indexOf(step) > i ? 'bg-primary/20 text-primary' :
            'bg-muted text-muted-foreground'
          }`}>
            {i + 1}
          </div>
          {i < 2 && <div className={`w-8 h-0.5 ${['email', 'otp', 'newPassword'].indexOf(step) > i ? 'bg-primary' : 'bg-muted'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-[var(--shadow-card)]">
            <div className="text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">S</span>
                </div>
              </Link>
              <h1 className="text-2xl font-bold">
                {step === 'email' && t('auth.forgot_title')}
                {step === 'otp' && (t('auth.verify_code_title', 'Vérifier le code'))}
                {step === 'newPassword' && (t('auth.new_password_title', 'Nouveau mot de passe'))}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {step === 'email' && t('auth.forgot_subtitle')}
                {step === 'otp' && (t('auth.otp_subtitle', 'Entrez le code à 6 chiffres envoyé à {{email}}', { email }))}
                {step === 'newPassword' && (t('auth.new_password_subtitle', 'Créez votre nouveau mot de passe'))}
              </p>
            </div>

            {stepIndicator}

            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.form key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="exemple@email.com" className="pl-10 h-12 rounded-xl border-2 focus:border-primary" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 shadow-[var(--shadow-primary)]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t('auth.send_code', 'Envoyer le code')}
                  </Button>
                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" />
                      {t('auth.back_to_login')}
                    </Link>
                  </div>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-14 text-lg rounded-lg border-2" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-lg rounded-lg border-2" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-lg rounded-lg border-2" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-lg rounded-lg border-2" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-lg rounded-lg border-2" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-lg rounded-lg border-2" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button className="w-full h-11 shadow-[var(--shadow-primary)]" onClick={handleVerifyOtp} disabled={loading || otp.length < 6}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t('auth.verify_code', 'Vérifier le code')}
                  </Button>
                  <div className="text-center space-y-2">
                    <button type="button" onClick={handleResendOtp} className="text-sm text-primary hover:underline" disabled={loading}>
                      {t('auth.resend_code', 'Renvoyer le code')}
                    </button>
                    <div>
                      <button type="button" onClick={() => { setStep('email'); setOtp(''); }} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                        <ArrowLeft className="h-3 w-3" />
                        {t('auth.change_email', 'Changer l\'email')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'newPassword' && (
                <motion.form key="newPassword" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('auth.new_password', 'Nouveau mot de passe')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="newPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={loading} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">{t('auth.confirm_password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="confirmNewPassword" type="password" placeholder="••••••••" className="pl-10 h-12 rounded-xl border-2 focus:border-primary" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={loading} />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-11 shadow-[var(--shadow-primary)]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {t('auth.reset_password_button', 'Réinitialiser le mot de passe')}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
