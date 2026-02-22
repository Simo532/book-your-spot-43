import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">
                Super<span className="text-primary">doc</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.links')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contact@superdoc.com</li>
              <li>+212 600 000 000</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {year} Superdoc. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
