import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Users, BarChart3, Stethoscope, Award, Settings, LogOut,
  ChevronLeft, Globe, MessageSquare, LifeBuoy, Wallet, Star, Bell, Zap, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
];

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, path: '/admin' },
  { key: 'users', icon: Users, path: '/admin/users' },
  { key: 'chat', icon: MessageSquare, path: '/admin/chat' },
  { key: 'support', icon: LifeBuoy, path: '/admin/support' },
  { key: 'balances', icon: Wallet, path: '/admin/balances' },
  { key: 'reviews', icon: Star, path: '/admin/reviews' },
  { key: 'notifications', icon: Bell, path: '/admin/notifications' },
  { key: 'analytics', icon: BarChart3, path: '/admin/analytics' },
  { key: 'specialties', icon: Stethoscope, path: '/admin/specialties' },
  { key: 'badges', icon: Award, path: '/admin/badges' },
  { key: 'boosts', icon: Zap, path: '/admin/boosts' },
  { key: 'xp_rules', icon: Target, path: '/admin/xp-rules' },
  { key: 'settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
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

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
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
                {t(`admin.nav.${item.key}`)}
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
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
