import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Super<span className="text-primary">doc</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{t('footer.links')}</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          {/* For Professionals */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Professionals</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/signup" className="hover:text-primary transition-colors">Join as Doctor</Link></li>
              <li><Link to="/search" className="hover:text-primary transition-colors">Find a Doctor</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                contact@superdoc.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +212 600 000 000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Casablanca, Morocco
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <span>© {year} Superdoc. {t('footer.rights')}.</span>
          <span>Made with ❤️ in Morocco</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
