import { motion } from 'framer-motion';
import { formatDate } from '@/lib/dateUtils';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReviewsSectionProps {
  reviews: any[];
  showAll: boolean;
  setShowAll: (v: boolean) => void;
  avgRating: number;
  totalReviews: number;
  fadeUp: any;
}

const ReviewsSection = ({ reviews, showAll, setShowAll, avgRating, totalReviews, fadeUp }: ReviewsSectionProps) => {
  const { t } = useTranslation();
  const displayed = showAll ? reviews : reviews.slice(0, 3);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
      <Card>
        <CardHeader><CardTitle className="text-lg">{t('doctor_details.patient_reviews')} ({totalReviews})</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl bg-muted/50">
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-muted-foreground">{totalReviews} {t('doctor_details.reviews')}</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-4">
            {displayed.map((review) => (
              <div key={review.id} className="flex gap-3 p-4 rounded-xl border border-border hover:border-primary/20 transition-colors">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={review.patientImage} />
                  <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                    {review.patientName?.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{review.patientName}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(review.createdAt)}</span>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                  <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                  {review.response && (
                    <div className="mt-3 pl-4 border-l-2 border-primary/30">
                      <p className="text-sm"><span className="font-semibold text-primary">Dr. {review.response.doctorName}:</span> {review.response.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {reviews.length > 3 && (
            <Button variant="ghost" className="w-full gap-2" onClick={() => setShowAll(!showAll)}>
              {showAll ? t('doctor_details.show_less') : t('doctor_details.show_all_reviews')}
              {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewsSection;
