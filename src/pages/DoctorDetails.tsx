import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Heart, MapPin, Phone, Mail, Clock, CalendarCheck, Award, ExternalLink,
  ThumbsUp, Briefcase, DollarSign, MessageSquare, ChevronDown, ChevronUp,
} from 'lucide-react';
import BookingModal from '@/components/doctor/BookingModal';
import SimilarDoctors from '@/components/doctor/SimilarDoctors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDoctorById, useReviewsByDoctor, useDoctorCompletedCount, useToggleFavorite, useIsFavorite } from '@/hooks/useApiHooks';
import { useAuth } from '@/contexts/AuthContext';

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'} style={{ width: size, height: size }} />
    ))}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45 } }),
};

const DoctorDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userId } = useAuth();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);

  const { data: doctor, isLoading: doctorLoading } = useDoctorById(id || '');
  const { data: reviewsData, isLoading: reviewsLoading } = useReviewsByDoctor(id || '', reviewPage, 10);
  const { data: completedCount } = useDoctorCompletedCount(id || '');
  const { data: isFav } = useIsFavorite(userId || '', id || '');
  const toggleFavMutation = useToggleFavorite();

  const toggleFavorite = () => {
    if (!userId || !id) return;
    toggleFavMutation.mutate({ userId, doctorId: id, isFav: !!isFav });
  };

  if (doctorLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 px-4 text-center"><p className="text-muted-foreground">{t('doctor_details.not_found') || 'Doctor not found'}</p></div>
        <Footer />
      </div>
    );
  }

  const reviews = reviewsData?.content || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const totalReviews = doctor.reviewCount ?? reviewsData?.totalElements ?? 0;
  const avgRating = doctor.averageRating ?? 0;

  const stats = [
    { icon: Star, value: avgRating.toFixed(1), label: t('doctor_details.avg_rating'), color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { icon: MessageSquare, value: totalReviews.toString(), label: t('doctor_details.total_reviews'), color: 'text-primary', bgColor: 'bg-primary/10' },
    { icon: CalendarCheck, value: (completedCount ?? 0).toLocaleString(), label: t('doctor_details.completed_appointments'), color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { icon: Briefcase, value: `${doctor.yearsOfExperience} ${t('doctor_details.years')}`, label: t('doctor_details.experience'), color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
    { icon: DollarSign, value: `${doctor.consultationFee} DA`, label: t('doctor_details.consult_price'), color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  const lat = doctor.address?.latitude ?? 36.7538;
  const lng = doctor.address?.longitude ?? 3.0588;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.008}%2C${lng + 0.01}%2C${lat + 0.008}&layer=mapnik&marker=${lat}%2C${lng}`;
  const mapLinkUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  const bookingDoctor = {
    id: doctor.id,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    specialty: doctor.speciality?.name || '',
    avatar: doctor.profilePicture || '',
    consultPrice: doctor.consultationFee,
    currency: 'DA',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Doctor Header */}
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
                          {doctor.tags?.map((tag) => <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={toggleFavorite} className="shrink-0">
                          <Heart className={isFav ? 'h-5 w-5 fill-red-500 text-red-500' : 'h-5 w-5'} />
                        </Button>
                        <Button className="shadow-[var(--shadow-primary)] gap-2" onClick={() => setBookingOpen(true)}>
                          <CalendarCheck className="h-4 w-4" />{t('doctor_details.book_appointment')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="hover:shadow-[var(--shadow-card)] transition-shadow">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t('doctor_details.about')}</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed">{doctor.bio || t('doctor_details.no_bio')}</p></CardContent>
                </Card>
              </motion.div>

              {/* Reviews */}
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
                      {displayedReviews.map((review) => (
                        <div key={review.id} className="flex gap-3 p-4 rounded-xl border border-border hover:border-primary/20 transition-colors">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={review.patientImage} />
                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                              {review.patientName?.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">{review.patientName}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {formatDate(review.createdAt)}
                              </span>
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
                      <Button variant="ghost" className="w-full gap-2" onClick={() => setShowAllReviews(!showAllReviews)}>
                        {showAllReviews ? t('doctor_details.show_less') : t('doctor_details.show_all_reviews')}
                        {showAllReviews ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Card className="border-primary/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-primary">{doctor.consultationFee} DA</span>
                      <p className="text-sm text-muted-foreground mt-1">{t('doctor_details.per_consultation')}</p>
                    </div>
                    <Button className="w-full shadow-[var(--shadow-primary)] gap-2" onClick={() => setBookingOpen(true)}>
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
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mt-8">
            <SimilarDoctors currentDoctorId={id || ''} />
          </motion.div>
        </div>
      </div>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} doctor={bookingDoctor} />
      <Footer />
    </div>
  );
};

export default DoctorDetails;
