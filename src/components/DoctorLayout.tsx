import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, CalendarCheck, MessageSquare, Star, BarChart3, User,
  Award, Settings, LogOut, ChevronLeft, Globe, Bell, Zap, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
];

interface DoctorLayoutProps {
  children: ReactNode;
}

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/doctor' },
  { key: 'appointments', icon: CalendarCheck, path: '/doctor/appointments' },
  { key: 'messages', icon: MessageSquare, path: '/doctor/messages' },
  { key: 'notifications', icon: Bell, path: '/doctor/notifications' },
  { key: 'reviews', icon: Star, path: '/doctor/reviews' },
  { key: 'analytics', icon: BarChart3, path: '/doctor/analytics' },
  { key: 'badges', icon: Award, path: '/doctor/badges' },
  { key: 'boosts', icon: Zap, path: '/doctor/boosts' },
  { key: 'xp_points', icon: Star, path: '/doctor/xp-points' },
  { key: 'availability', icon: Clock, path: '/doctor/availability' },
  { key: 'profile', icon: User, path: '/doctor/profile' },
  { key: 'settings', icon: Settings, path: '/doctor/settings' },
];

const DoctorLayout = ({ children }: DoctorLayoutProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="flex min-h-screen bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 z-40 w-64 bg-card/95 backdrop-blur-xl border-border flex flex-col shadow-[var(--shadow-card)]',
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <ChevronLeft className={cn('h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors', isRtl && 'rotate-180')} />
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold">
              Super<span className="text-primary">doc</span>
            </span>
          </Link>
        </div>

        {/* Doctor mini profile */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">MB</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Dr. Mohamed Benali</p>
              <p className="text-xs text-muted-foreground truncate">{t('doctor.nav.cardiologist')}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/doctor'
                ? location.pathname === '/doctor'
                : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.key}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-primary)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {t(`doctor.nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Globe className="h-4 w-4" />
                {languages.find((l) => l.code === i18n.language)?.label || 'FR'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code} onClick={() => i18n.changeLanguage(lang.code)}>
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn('flex-1', isRtl ? 'mr-64' : 'ml-64')}>
        <header className={cn(
          'sticky top-0 z-30 h-14 bg-card/80 backdrop-blur-lg border-b border-border flex items-center gap-3',
          isRtl ? 'justify-start px-6 flex-row-reverse' : 'justify-end px-6'
        )}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </Button>
        </header>
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default DoctorLayout;
