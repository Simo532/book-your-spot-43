import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Heart, ShieldCheck, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/services/api';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigateAfterLogin = () => {
    if (tokenStorage.isDoctor()) navigate('/doctor');
    else if (tokenStorage.isPatient()) navigate('/patient');
    else if (tokenStorage.isAdmin()) navigate('/admin');
    else navigate('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const tokens = await authService.login(email, password);
      authService.saveLoginData(tokens);
      toast.success(t('auth.login_success', 'Connexion réussie'));
      navigateAfterLogin();
    } catch (err: unknown) {
      // Error toast is handled by the global interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast.info('Google Sign-In sera disponible prochainement');
  };

  const trustPoints = [
    { icon: ShieldCheck, text: 'Secure & encrypted' },
    { icon: Clock, text: 'Book in 2 minutes' },
    { icon: Users, text: '120K+ patients' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen">
        {/* Left side - Branding (hidden on mobile) */}
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
              Your health, simplified.
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-10 leading-relaxed">
              Connect with top-rated doctors, book appointments instantly, and manage your healthcare journey — all in one place.
            </p>
            <div className="space-y-4">
              {trustPoints.map((point) => (
                <div key={point.text} className="flex items-center gap-3 text-primary-foreground/80">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <point.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{point.text}</span>
                </div>
              ))}
            </div>
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
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                </div>
              </Link>
            </div>

            <h1 className="text-2xl font-bold mb-1">{t('auth.login_title')}</h1>
            <p className="text-muted-foreground text-sm mb-8">{t('auth.login_subtitle')}</p>

            {/* Google Button */}
            <Button variant="outline" className="w-full gap-3 h-12 rounded-xl border-2 mb-6 hover:bg-muted/50" type="button" onClick={handleGoogleSignIn}>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    {t('auth.forgot_password')}
                  </Link>
                </div>
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

              <Button type="submit" className="w-full h-12 shadow-[var(--shadow-primary)] rounded-xl text-base" style={{ background: 'var(--gradient-primary)' }} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t('auth.login_button')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t('auth.no_account')}{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline">
                {t('nav.signup')}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
