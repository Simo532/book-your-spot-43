import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Heart, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const { resolvedTheme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/40'
          : 'bg-background/95 backdrop-blur-xl border-b border-border'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-shadow group-hover:shadow-[var(--shadow-primary)]" style={{ background: 'var(--gradient-primary)' }}>
              <Heart className="h-4.5 w-4.5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Super<span className="text-primary">doc</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/search">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {t('nav.search')}
              </Button>
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={cn(
                      'gap-2',
                      i18n.language === lang.code && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <span>{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleDarkMode}>
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="shadow-[var(--shadow-primary)] rounded-xl px-5" style={{ background: 'var(--gradient-primary)' }}>
                {t('nav.signup')}
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={toggleDarkMode}>
              {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <button
              className="p-2 rounded-xl hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <Link to="/search" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t('nav.search')}
              </Button>
            </Link>
            <div className="flex gap-2 px-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-full border transition-colors',
                    i18n.language === lang.code
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-muted'
                  )}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                {t('nav.login')}
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setMobileOpen(false)}>
              <Button className="w-full" style={{ background: 'var(--gradient-primary)' }}>
                {t('nav.signup')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
