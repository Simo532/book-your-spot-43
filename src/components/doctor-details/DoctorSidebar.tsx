import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, CalendarCheck, Phone, Mail, Briefcase, MapPin, ExternalLink, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DoctorSidebarProps {
  doctor: any;
  isFav: boolean;
  toggleFavorite: () => void;
  onBook: () => void;
  fadeUp: any;
}

const DoctorSidebar = ({ doctor, isFav, toggleFavorite, onBook, fadeUp }: DoctorSidebarProps) => {
  const { t } = useTranslation();
  const lat = doctor.address?.latitude ?? 36.7538;
  const lng = doctor.address?.longitude ?? 3.0588;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;
  const mapLinkUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-primary">{doctor.consultationFee} DA</span>
              <p className="text-sm text-muted-foreground mt-1">{t('doctor_details.per_consultation')}</p>
            </div>
            <Button className="w-full shadow-[var(--shadow-primary)] gap-2" onClick={onBook}>
              <CalendarCheck className="h-4 w-4" />{t('doctor_details.book_appointment')}
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={toggleFavorite}>
              <Heart className={isFav ? 'h-4 w-4 fill-red-500 text-red-500' : 'h-4 w-4'} />
              {isFav ? t('doctor_details.remove_favorite') : t('doctor_details.add_favorite')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
        <Card>
          <CardHeader><CardTitle className="text-lg">{t('doctor_details.contact_info')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground shrink-0" /><span>{doctor.phone}</span></div>
            <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /><span>{doctor.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><Briefcase className="h-4 w-4 text-muted-foreground shrink-0" /><span>{doctor.yearsOfExperience} {t('doctor_details.years_experience')}</span></div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}>
        <Card>
          <CardHeader><CardTitle className="text-lg">{t('doctor_details.address')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p>{doctor.address?.street}</p>
                <p className="text-muted-foreground">{doctor.address?.city}, {doctor.address?.state}</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-border mt-3">
              <iframe width="100%" height="200" src={mapUrl} style={{ border: 0 }} title="Doctor location" />
            </div>
            <a href={mapLinkUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="w-full gap-2 mt-2">
                <ExternalLink className="h-3.5 w-3.5" />{t('doctor_details.view_on_map')}
              </Button>
            </a>
          </CardContent>
        </Card>
      </motion.div>

      {doctor.badge && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Card>
            <CardHeader><CardTitle className="text-lg">{t('doctor_details.badges')}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15">
                  <Award className="h-3.5 w-3.5" />{doctor.badge.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorSidebar;
