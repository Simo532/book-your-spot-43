import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Stethoscope,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  Globe,
  MessageSquare,
  LifeBuoy,
  Wallet,
  Star,
  Bell,
  Zap,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="font-bold">
              Super<span className="text-primary">doc</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-primary)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <item.icon className="h-4.5 w-4.5" />
                {t(`admin.nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-2">
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
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
