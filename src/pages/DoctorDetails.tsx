import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  MapPin,
  Phone,
  Mail,
  Clock,
  CalendarCheck,
  Award,
  ExternalLink,
  ThumbsUp,
  Briefcase,
  DollarSign,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import BookingModal from '@/components/doctor/BookingModal';
import SimilarDoctors from '@/components/doctor/SimilarDoctors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock doctor data
const mockDoctor = {
  id: '1',
  firstName: 'Mohamed',
  lastName: 'Benali',
  specialty: 'Cardiologie',
  tags: ['Échocardiographie', 'Hypertension', 'Insuffisance cardiaque', 'ECG'],
  avatar: '',
  rating: 4.7,
  totalReviews: 128,
  totalAppointments: 1540,
  experience: 15,
  consultPrice: 3000,
  currency: 'DA',
  phone: '+213 555 123 456',
  email: 'dr.benali@superdoc.com',
  about:
    "Le Dr. Mohamed Benali est un cardiologue expérimenté avec plus de 15 ans d'expérience. Diplômé de la faculté de médecine d'Alger, il s'est spécialisé en cardiologie interventionnelle à Paris. Il prend en charge les maladies cardiovasculaires, l'hypertension artérielle et l'insuffisance cardiaque. Son approche bienveillante et son expertise font de lui un praticien très apprécié par ses patients.",
  address: '12, Rue Didouche Mourad',
  city: 'Alger',
  wilaya: 'Alger',
  lat: 36.7538,
  lng: 3.0588,
  badges: ['Gold', 'Top Rated'],
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
  },
};

const mockReviews = [
  {
    id: '1',
    patient: 'Amina K.',
    avatar: '',
    rating: 5,
    date: '2026-02-15',
    comment:
      "Excellent médecin, très à l'écoute et professionnel. Je le recommande vivement.",
  },
  {
    id: '2',
    patient: 'Youcef M.',
    avatar: '',
    rating: 4,
    date: '2026-02-10',
    comment:
      "Très compétent, consultation détaillée. Le temps d'attente était un peu long mais ça valait le coup.",
  },
  {
    id: '3',
    patient: 'Fatima Z.',
    avatar: '',
    rating: 5,
    date: '2026-01-28',
    comment:
      "Dr. Benali m'a rassurée et a pris le temps de tout m'expliquer. Merci beaucoup !",
  },
  {
    id: '4',
    patient: 'Karim B.',
    avatar: '',
    rating: 4,
    date: '2026-01-20',
    comment: 'Bon suivi médical, cabinet bien équipé.',
  },
  {
    id: '5',
    patient: 'Nadia L.',
    avatar: '',
    rating: 5,
    date: '2026-01-15',
    comment: 'Le meilleur cardiologue que j\'ai consulté. Très professionnel.',
  },
];

const ratingBreakdown = [
  { stars: 5, count: 78 },
  { stars: 4, count: 32 },
  { stars: 3, count: 12 },
  { stars: 2, count: 4 },
  { stars: 1, count: 2 },
];

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}
        style={{ width: size, height: size }}
      />
    ))}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45 },
  }),
};

const DoctorDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const doctor = mockDoctor;
  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);
  const totalRatings = ratingBreakdown.reduce((a, b) => a + b.count, 0);

  const stats = [
    {
      icon: Star,
      value: doctor.rating.toFixed(1),
      label: t('doctor_details.avg_rating'),
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      icon: MessageSquare,
      value: doctor.totalReviews.toString(),
      label: t('doctor_details.total_reviews'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: CalendarCheck,
      value: doctor.totalAppointments.toLocaleString(),
      label: t('doctor_details.completed_appointments'),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
    {
      icon: Briefcase,
      value: `${doctor.experience} ${t('doctor_details.years')}`,
      label: t('doctor_details.experience'),
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      icon: DollarSign,
      value: `${doctor.consultPrice} ${doctor.currency}`,
      label: t('doctor_details.consult_price'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${doctor.lng - 0.01}%2C${doctor.lat - 0.008}%2C${doctor.lng + 0.01}%2C${doctor.lat + 0.008}&layer=mapnik&marker=${doctor.lat}%2C${doctor.lng}`;
  const mapLinkUrl = `https://www.openstreetmap.org/?mlat=${doctor.lat}&mlon=${doctor.lng}#map=16/${doctor.lat}/${doctor.lng}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Doctor Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
              <CardContent className="relative pb-6">
                <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-12">
                  {/* Avatar */}
                  <Avatar className="h-28 w-28 border-4 border-card shadow-lg">
                    <AvatarImage src={doctor.avatar} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {doctor.firstName[0]}
                      {doctor.lastName[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h1>
                        <p className="text-primary font-medium mt-1">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <StarRating rating={Math.round(doctor.rating)} />
                          <span className="font-semibold text-sm">
                            {doctor.rating}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            ({doctor.totalReviews} {t('doctor_details.reviews')})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {doctor.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsFavorite(!isFavorite)}
                          className="shrink-0"
                        >
                          <Heart
                            className={
                              isFavorite
                                ? 'h-5 w-5 fill-red-500 text-red-500'
                                : 'h-5 w-5'
                            }
                          />
                        </Button>
                        <Button className="shadow-[var(--shadow-primary)] gap-2" onClick={() => setBookingOpen(true)}>
                          <CalendarCheck className="h-4 w-4" />
                          {t('doctor_details.book_appointment')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6"
          >
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="hover:shadow-[var(--shadow-card)] transition-shadow"
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('doctor_details.about')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {doctor.about}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('doctor_details.patient_reviews')} ({doctor.totalReviews})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating Breakdown */}
                    <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl bg-muted/50">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-4xl font-bold">
                          {doctor.rating}
                        </span>
                        <StarRating rating={Math.round(doctor.rating)} />
                        <span className="text-sm text-muted-foreground">
                          {totalRatings} {t('doctor_details.reviews')}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        {ratingBreakdown.map((r) => (
                          <div
                            key={r.stars}
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm w-3">{r.stars}</span>
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <Progress
                              value={(r.count / totalRatings) * 100}
                              className="h-2 flex-1"
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {r.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Review List */}
                    <div className="space-y-4">
                      {displayedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="flex gap-3 p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
                        >
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                              {review.patient
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium text-sm">
                                {review.patient}
                              </span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <StarRating rating={review.rating} size={14} />
                            <p className="text-sm text-muted-foreground mt-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {mockReviews.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full gap-2"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                      >
                        {showAllReviews
                          ? t('doctor_details.show_less')
                          : t('doctor_details.show_all_reviews')}
                        {showAllReviews ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Price & Book */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={2}
              >
                <Card className="border-primary/20">
                  <CardContent className="p-6 space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold text-primary">
                        {doctor.consultPrice} {doctor.currency}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('doctor_details.per_consultation')}
                      </p>
                    </div>
                    <Button className="w-full shadow-[var(--shadow-primary)] gap-2" onClick={() => setBookingOpen(true)}>
                      <CalendarCheck className="h-4 w-4" />
                      {t('doctor_details.book_appointment')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart
                        className={
                          isFavorite
                            ? 'h-4 w-4 fill-red-500 text-red-500'
                            : 'h-4 w-4'
                        }
                      />
                      {isFavorite
                        ? t('doctor_details.remove_favorite')
                        : t('doctor_details.add_favorite')}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('doctor_details.contact_info')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>
                        {doctor.experience} {t('doctor_details.years_experience')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Address & Map */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={4}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t('doctor_details.address')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p>{doctor.address}</p>
                        <p className="text-muted-foreground">
                          {doctor.city}, {doctor.wilaya}
                        </p>
                      </div>
                    </div>

                    {/* OpenStreetMap Embed */}
                    <div className="rounded-xl overflow-hidden border border-border mt-3">
                      <iframe
                        width="100%"
                        height="200"
                        src={mapUrl}
                        style={{ border: 0 }}
                        title="Doctor location"
                      />
                    </div>
                    <a
                      href={mapLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 mt-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t('doctor_details.view_on_map')}
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Badges */}
              {doctor.badges.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                  custom={5}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t('doctor_details.badges')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {doctor.badges.map((badge) => (
                          <Badge
                            key={badge}
                            className="gap-1 bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15"
                          >
                            <Award className="h-3.5 w-3.5" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Similar Doctors */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mt-8">
            <SimilarDoctors currentDoctorId={id || '1'} />
          </motion.div>
        </div>
      </div>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} doctor={doctor} />
      <Footer />
    </div>
  );
};

export default DoctorDetails;
