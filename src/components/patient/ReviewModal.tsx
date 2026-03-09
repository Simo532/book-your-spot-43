import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreateReview } from '@/hooks/useApiHooks';
import { toast } from 'sonner';

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  doctorName: string;
  patientId: string;
}

const ReviewModal = ({ open, onOpenChange, doctorId, doctorName, patientId }: ReviewModalProps) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error(t('patient.review.rating_required', 'Veuillez donner une note'));
      return;
    }
    createReview.mutate(
      { patientId, doctorId, rating, comment },
      {
        onSuccess: () => {
          toast.success(t('patient.review.success', 'Avis envoyé avec succès'));
          setRating(0);
          setComment('');
          onOpenChange(false);
        },
        onError: () => toast.error(t('patient.review.error', "Erreur lors de l'envoi")),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('patient.review.title', 'Laisser un avis')} — {doctorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'h-8 w-8 transition-colors',
                    s <= (hover || rating) ? 'fill-amber-400 text-amber-400' : 'text-muted'
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('patient.review.comment_placeholder', 'Partagez votre expérience...')}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('admin.cancel', 'Annuler')}
            </Button>
            <Button onClick={handleSubmit} disabled={createReview.isPending}>
              {createReview.isPending
                ? t('patient.review.sending', 'Envoi...')
                : t('patient.review.submit', 'Envoyer')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
