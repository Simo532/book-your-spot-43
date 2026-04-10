import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shimmer, ShimmerReview } from '@/components/ui/shimmer';
import DoctorLayout from '@/components/DoctorLayout';
import { tokenStorage } from '@/services/api';
import { useReviewsByDoctor } from '@/hooks/useApiHooks';

const DoctorReviews = () => {
  const { t } = useTranslation();
  const doctorOrPatientId = tokenStorage.getDoctorOrPatientId();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [page, setPage] = useState(0);

  const { data: reviewsData, isLoading } = useReviewsByDoctor(doctorOrPatientId || '', page, 10);
  const reviews = reviewsData?.content || [];
  const totalReviews = reviewsData?.totalElements ?? 0;
  const avgRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';
  const repliedCount = reviews.filter(r => r.response).length;

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.reviews.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.reviews.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-6 text-center">
            {isLoading ? <Shimmer className="h-10 w-16 mx-auto" /> : <div className="text-3xl font-bold">{avgRating}</div>}
            <div className="flex justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(Number(avgRating)) ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.average')}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{totalReviews}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.total')}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{repliedCount}</div>
            <p className="text-sm text-muted-foreground mt-1">{t('doctor.reviews.replied')}</p>
          </CardContent></Card>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ShimmerReview key={i} />)
          ) : reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={review.patientImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {review.patientName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{review.patientName}</span>
                        <div className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />)}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                    {review.response && (
                      <div className="mt-3 pl-4 border-l-2 border-primary/30">
                        <p className="text-sm"><span className="font-semibold text-primary">{t('doctor.reviews.your_reply')}:</span> {review.response.content}</p>
                      </div>
                    )}
                    {!review.response && (
                      replyingTo === review.id ? (
                        <div className="mt-3 flex gap-2">
                          <Input placeholder={t('doctor.reviews.reply_placeholder')} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1" />
                          <Button size="sm" onClick={() => { setReplyingTo(null); setReplyText(''); }}>{t('doctor.reviews.send')}</Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>{t('admin.cancel')}</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setReplyingTo(review.id)}>
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />{t('doctor.reviews.reply')}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reviewsData && reviewsData.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Précédent</Button>
            <span className="text-sm text-muted-foreground flex items-center px-3">{page + 1} / {reviewsData.totalPages}</span>
            <Button variant="outline" size="sm" disabled={reviewsData.last} onClick={() => setPage(p => p + 1)}>Suivant</Button>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorReviews;
