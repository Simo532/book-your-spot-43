import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ShimmerListItem } from '@/components/ui/shimmer';
import PatientLayout from '@/components/PatientLayout';
import { tokenStorage } from '@/services/api';
import { useFavorites, useToggleFavorite } from '@/hooks/useApiHooks';

const PatientFavorites = () => {
  const { t } = useTranslation();
  const userId = tokenStorage.getUserId();
  const [search, setSearch] = useState('');

  const { data: favorites, isLoading } = useFavorites(userId || '');
  const toggleFav = useToggleFavorite();

  const allFavorites = favorites || [];
  const filtered = allFavorites.filter(f =>
    `${f.doctor.firstName} ${f.doctor.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('patient.favorites.title')}</h1>
            <p className="text-sm text-muted-foreground">{allFavorites.length} {t('patient.favorites.count')}</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.favorites.search')} className="pl-9" />
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ShimmerListItem key={i} />)
          ) : filtered.map(fav => (
            <Card key={fav.id} className="hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={fav.doctor.profilePicture} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{fav.doctor.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link to={`/doctor/details/${fav.doctor.id}`} className="font-semibold text-sm hover:text-primary transition-colors">
                    Dr. {fav.doctor.firstName} {fav.doctor.lastName}
                  </Link>
                  <p className="text-xs text-primary font-medium">{fav.doctor.speciality?.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{fav.doctor.averageRating?.toFixed(1) ?? '-'}</span>
                      <span className="text-xs text-muted-foreground">({fav.doctor.reviewCount ?? 0})</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" /> {fav.doctor.address?.city}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary text-sm">{fav.doctor.consultationFee} DA</p>
                  <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive mt-1 gap-1"
                    onClick={() => userId && toggleFav.mutate({ userId, doctorId: fav.doctor.id, isFav: true })}>
                    <Trash2 className="h-3 w-3" />{t('patient.favorites.remove')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t('patient.favorites.empty')}</p>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientFavorites;
