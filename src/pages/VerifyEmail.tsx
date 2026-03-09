import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await authService.verifyEmail(email, otp);
      setVerified(true);
      toast.success(t('auth.email_verified', 'Email vérifié avec succès !'));
    } catch {
      toast.error(t('auth.otp_invalid', 'Code invalide ou expiré'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.sendEmailForVerification(email);
      toast.success(t('auth.otp_resent', 'Code renvoyé'));
    } catch {
      toast.error(t('auth.otp_send_error', "Erreur lors de l'envoi du code"));
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-4 pt-16">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">{t('auth.no_email_provided', 'Aucun email fourni')}</p>
            <Link to="/signup">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t('auth.back_to_signup', "Retour à l'inscription")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            {verified ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold">{t('auth.email_verified_title', 'Email vérifié !')}</h2>
                <p className="text-sm text-muted-foreground">
                  {t('auth.email_verified_subtitle', 'Votre compte est maintenant vérifié. Vous pouvez vous connecter.')}
                </p>
                <Button className="w-full h-11 shadow-[var(--shadow-primary)]" onClick={() => navigate('/login')}>
                  {t('auth.go_to_login', 'Se connecter')}
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">{t('auth.verify_email_title', 'Vérifiez votre email')}</h1>
                  <p className="text-muted-foreground text-sm mt-2">
                    {t('auth.verify_email_subtitle', 'Un code à 6 chiffres a été envoyé à')}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1 flex items-center justify-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {email}
                  </p>
                </div>

                <div className="flex justify-center mb-6">
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

                <Button className="w-full h-11 shadow-[var(--shadow-primary)] mb-4" onClick={handleVerify} disabled={loading || otp.length < 6}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {t('auth.verify_code', 'Vérifier le code')}
                </Button>

                <div className="text-center space-y-2">
                  <button type="button" onClick={handleResend} className="text-sm text-primary hover:underline" disabled={loading}>
                    {t('auth.resend_code', 'Renvoyer le code')}
                  </button>
                  <div>
                    <Link to="/signup" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" />
                      {t('auth.back_to_signup', "Retour à l'inscription")}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
