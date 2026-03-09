import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Phone, Mail, Clock, CalendarCheck, Award, ExternalLink, Briefcase, DollarSign, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import BookingModal from '@/components/doctor/BookingModal';
import SimilarDoctors from '@/components/doctor/SimilarDoctors';
import StarRating from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDoctorById, useReviewsByDoctor, useDoctorCompletedCount, useToggleFavorite, useIsFavorite } from '@/hooks/useApiHooks';
import { useAuth } from '@/contexts/AuthContext';
import DoctorHeader from '@/components/doctor-details/DoctorHeader';
import DoctorSidebar from '@/components/doctor-details/DoctorSidebar';
import ReviewsSection from '@/components/doctor-details/ReviewsSection';

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
  const { data: reviewsData } = useReviewsByDoctor(id || '', reviewPage, 10);
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
  const totalReviews = doctor.reviewCount ?? reviewsData?.totalElements ?? 0;
  const avgRating = doctor.averageRating ?? 0;

  const stats = [
    { icon: CalendarCheck, value: avgRating.toFixed(1), label: t('doctor_details.avg_rating'), color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { icon: MessageSquare, value: totalReviews.toString(), label: t('doctor_details.total_reviews'), color: 'text-primary', bgColor: 'bg-primary/10' },
    { icon: CalendarCheck, value: (completedCount ?? 0).toLocaleString(), label: t('doctor_details.completed_appointments'), color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { icon: Briefcase, value: `${doctor.yearsOfExperience} ${t('doctor_details.years')}`, label: t('doctor_details.experience'), color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
    { icon: DollarSign, value: `${doctor.consultationFee} DA`, label: t('doctor_details.consult_price'), color: 'text-primary', bgColor: 'bg-primary/10' },
  ];

  const bookingDoctor = {
    id: doctor.id, firstName: doctor.firstName, lastName: doctor.lastName,
    specialty: doctor.speciality?.name || '', avatar: doctor.profilePicture || '',
    consultPrice: doctor.consultationFee, currency: 'DA',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <DoctorHeader doctor={doctor} avgRating={avgRating} totalReviews={totalReviews} isFav={!!isFav} toggleFavorite={toggleFavorite} onBook={() => setBookingOpen(true)} fadeUp={fadeUp} />

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
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t('doctor_details.about')}</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground leading-relaxed">{doctor.bio || t('doctor_details.no_bio')}</p></CardContent>
                </Card>
              </motion.div>
              <ReviewsSection reviews={reviews} showAll={showAllReviews} setShowAll={setShowAllReviews} avgRating={avgRating} totalReviews={totalReviews} fadeUp={fadeUp} />
            </div>
            <DoctorSidebar doctor={doctor} isFav={!!isFav} toggleFavorite={toggleFavorite} onBook={() => setBookingOpen(true)} fadeUp={fadeUp} />
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
