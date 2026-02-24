import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const initialFavorites = [
  { id: '1', firstName: 'Mohamed', lastName: 'Benali', specialty: 'Cardiologue', avatar: '', rating: 4.7, totalReviews: 128, consultPrice: 3000, currency: 'DA', city: 'Alger' },
  { id: '4', firstName: 'Fatima', lastName: 'Zerhouni', specialty: 'Pédiatre', avatar: '', rating: 4.8, totalReviews: 312, consultPrice: 2000, currency: 'DA', city: 'Alger' },
  { id: '2', firstName: 'Amira', lastName: 'Hadj', specialty: 'Dermatologue', avatar: '', rating: 4.9, totalReviews: 256, consultPrice: 2500, currency: 'DA', city: 'Oran' },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={s <= rating ? 'h-3 w-3 fill-amber-400 text-amber-400' : 'h-3 w-3 text-muted'} />
    ))}
  </div>
);

const Favorites = () => {
  const { t } = useTranslation();
  const [favDoctors, setFavDoctors] = useState(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavDoctors(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('favorites.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('favorites.subtitle', { count: favDoctors.length })}</p>
            </div>
          </div>

          {favDoctors.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('favorites.empty')}</p>
              <Link to="/search">
                <Button className="gap-2">
                  <Search className="h-4 w-4" />
                  {t('favorites.browse_doctors')}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favDoctors.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Avatar className="h-14 w-14 shrink-0">
                        <AvatarImage src={doc.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {doc.firstName[0]}{doc.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link to={`/doctor/details/${doc.id}`} className="font-semibold hover:text-primary transition-colors">
                          Dr. {doc.firstName} {doc.lastName}
                        </Link>
                        <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <StarRating rating={Math.round(doc.rating)} />
                            <span className="text-xs font-medium">{doc.rating}</span>
                            <span className="text-xs text-muted-foreground">({doc.totalReviews})</span>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" /> {doc.city}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary">{doc.consultPrice} {doc.currency}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-destructive hover:text-destructive mt-1 gap-1"
                          onClick={() => removeFavorite(doc.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          {t('favorites.remove')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
