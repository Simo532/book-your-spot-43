import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import DoctorLayout from '@/components/DoctorLayout';

const mockReviews = [
  { id: 1, patient: 'Fatima Zahra', rating: 5, text: 'Excellent médecin, très à l\'écoute et professionnel. Je recommande vivement.', date: '2026-02-21', replied: false },
  { id: 2, patient: 'Ahmed Bensalem', rating: 4, text: 'Bon diagnostic, temps d\'attente raisonnable. Cabinet propre et bien équipé.', date: '2026-02-20', replied: true, reply: 'Merci beaucoup Ahmed !' },
  { id: 3, patient: 'Nadia Ferhat', rating: 5, text: 'Un médecin exceptionnel. Très compétent et humain.', date: '2026-02-19', replied: false },
  { id: 4, patient: 'Rachid Boudiaf', rating: 3, text: 'Compétent mais le temps d\'attente était un peu long.', date: '2026-02-18', replied: true, reply: 'Désolé pour l\'attente, nous travaillons à améliorer cela.' },
  { id: 5, patient: 'Samira Ould Ali', rating: 5, text: 'Meilleur cardiologue de la région, sans hésitation.', date: '2026-02-17', replied: false },
];

const DoctorReviews = () => {
  const { t } = useTranslation();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.reviews.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.reviews.subtitle')}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{avgRating}</div>
              <div className="flex justify-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.average')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{mockReviews.length}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.total')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold">{mockReviews.filter(r => r.replied).length}</div>
              <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.replied')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {review.patient.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{review.patient}</span>
                        <div className="flex">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{review.text}</p>

                    {review.replied && review.reply && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30">
                        <p className="text-sm"><span className="font-semibold text-primary">{t('doctor.reviews.your_reply')}:</span> {review.reply}</p>
                      </div>
                    )}

                    {!review.replied && (
                      <>
                        {replyingTo === review.id ? (
                          <div className="mt-3 flex gap-2">
                            <Input
                              placeholder={t('doctor.reviews.reply_placeholder')}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                              {t('doctor.reviews.send')}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                              {t('admin.cancel')}
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-xs"
                            onClick={() => setReplyingTo(review.id)}
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            {t('doctor.reviews.reply')}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorReviews;
