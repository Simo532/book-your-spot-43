import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, Stethoscope, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';
import { UserRole } from '@/types/auth';

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('auth.password_mismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    if (!firstName || !lastName || !email || !password) {
      toast.error(t('auth.fill_all_fields', 'Veuillez remplir tous les champs'));
      return;
    }
    setLoading(true);
    try {
      await authService.signup({
        email,
        password,
        firstName,
        lastName,
        role: role === 'doctor' ? UserRole.DOCTOR : UserRole.PATIENT,
      });
      toast.success(t('auth.signup_success', 'Inscription réussie ! Vérifiez votre email.'));
      navigate('/verify-email', { state: { email } });
    } catch {
      // Error toast handled by global interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12" style={{ background: 'var(--gradient-primary)' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/5" />
          </div>
          <div className="relative z-10 max-w-md">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">Superdoc</span>
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Join 5,000+ healthcare professionals
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Whether you're a patient seeking care or a doctor growing your practice — Superdoc is built for you.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[420px]"
          >
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                </div>
              </Link>
            </div>

            <h1 className="text-2xl font-bold mb-1">{t('auth.signup_title')}</h1>
            <p className="text-muted-foreground text-sm mb-6">{t('auth.signup_subtitle')}</p>

            {/* Role Selector */}
            <div className="mb-6">
              <Label className="mb-3 block text-sm font-medium">{t('auth.role_select')}</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                    role === 'patient'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30 hover:bg-muted/30'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    role === 'patient' ? 'bg-primary/15' : 'bg-muted'
                  )}>
                    <Heart className={cn('h-4 w-4', role === 'patient' ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <span className={cn('font-medium text-sm', role === 'patient' ? 'text-primary' : 'text-muted-foreground')}>
                    {t('auth.role_patient')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                    role === 'doctor'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30 hover:bg-muted/30'
                  )}
                >
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    role === 'doctor' ? 'bg-primary/15' : 'bg-muted'
                  )}>
                    <Stethoscope className={cn('h-4 w-4', role === 'doctor' ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <span className={cn('font-medium text-sm', role === 'doctor' ? 'text-primary' : 'text-muted-foreground')}>
                    {t('auth.role_doctor')}
                  </span>
                </button>
              </div>
            </div>

            {/* Google Button */}
            <Button variant="outline" className="w-full gap-3 h-12 rounded-xl border-2 mb-6 hover:bg-muted/50" type="button" onClick={() => toast.info('Google Sign-In sera disponible prochainement')}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t('auth.google_button')}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">{t('auth.first_name', 'Prénom')}</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      placeholder="Ahmed"
                      className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">{t('auth.last_name', 'Nom')}</Label>
                  <Input
                    id="lastName"
                    placeholder="Benali"
                    className="h-12 rounded-xl border-2 focus:border-primary"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">{t('auth.confirm_password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl border-2 focus:border-primary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 shadow-[var(--shadow-primary)] rounded-xl text-base" style={{ background: 'var(--gradient-primary)' }} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('auth.signup_button')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t('auth.has_account')}{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                {t('nav.login')}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
