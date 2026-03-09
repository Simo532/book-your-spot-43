import { motion } from 'framer-motion';
import StarRating from '@/components/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DoctorHeaderProps {
  doctor: any;
  avgRating: number;
  totalReviews: number;
  isFav: boolean;
  toggleFavorite: () => void;
  onBook: () => void;
  fadeUp: any;
}

const DoctorHeader = ({ doctor, avgRating, totalReviews, isFav, toggleFavorite, onBook, fadeUp }: DoctorHeaderProps) => {
  const { t } = useTranslation();

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
        <CardContent className="relative pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-12">
            <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
              <AvatarImage src={doctor.profilePicture} />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">{doctor.firstName[0]}{doctor.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Dr. {doctor.firstName} {doctor.lastName}</h1>
                  <p className="text-primary font-medium mt-1">{doctor.speciality?.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={Math.round(avgRating)} />
                    <span className="font-semibold text-sm">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({totalReviews} {t('doctor_details.reviews')})</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doctor.tags?.map((tag: any) => <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={toggleFavorite} className="shrink-0">
                    <Heart className={isFav ? 'h-5 w-5 fill-red-500 text-red-500' : 'h-5 w-5'} />
                  </Button>
                  <Button className="shadow-[var(--shadow-primary)] gap-2" onClick={onBook}>
                    <CalendarCheck className="h-4 w-4" />{t('doctor_details.book_appointment')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DoctorHeader;
