import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, Heart, SlidersHorizontal, X, Map as MapIcon, List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchDoctors, useToggleFavorite, useFavorites } from '@/hooks/useApiHooks';
import { useAuth } from '@/contexts/AuthContext';
import { Gender } from '@/types/doctor';

const cities = ['Alger', 'Oran', 'Constantine', 'Blida', 'Annaba', 'Sétif'];

const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'} style={{ width: size, height: size }} />
    ))}
  </div>
);

const SearchResults = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [bestRated, setBestRated] = useState(false);
  const [closestToMe, setClosestToMe] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [page, setPage] = useState(0);

  const searchParams = useMemo(() => ({
    city: selectedCity !== 'all' ? selectedCity : undefined,
    gender: selectedGender !== 'all' ? (selectedGender.toUpperCase() as Gender) : undefined,
    minFee: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxFee: priceRange[1] < 5000 ? priceRange[1] : undefined,
    minExp: minExperience > 0 ? minExperience : undefined,
    userLat: closestToMe && userLocation ? userLocation.lat : undefined,
    userLon: closestToMe && userLocation ? userLocation.lng : undefined,
    sortBy: bestRated ? 'topRated' : closestToMe && userLocation ? 'nearby' : 'topRated,nearby',
    page,
    size: 12,
  }), [selectedCity, selectedGender, priceRange, minExperience, bestRated, closestToMe, userLocation, page]);

  const { data: searchData, isLoading } = useSearchDoctors(searchParams);
  const { data: favoritesData } = useFavorites(userId || '');
  const toggleFavMutation = useToggleFavorite();

  const favoriteIds = useMemo(() => new Set(favoritesData?.map(f => f.doctor.id) || []), [favoritesData]);

  const doctors = useMemo(() => {
    const results = searchData?.content || [];
    if (!searchQuery) return results;
    return results.filter(d =>
      d.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.speciality?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchData, searchQuery]);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setClosestToMe(true);
      });
    }
  };

  const toggleFavorite = (doctorId: string) => {
    if (!userId) return;
    toggleFavMutation.mutate({ userId, doctorId, isFav: favoriteIds.has(doctorId) });
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t('search.city')}</Label>
        <Select value={selectedCity} onValueChange={v => { setSelectedCity(v); setPage(0); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.all_cities')}</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{t('search.price_range')}</Label>
        <Slider value={priceRange} onValueChange={v => { setPriceRange(v); setPage(0); }} min={0} max={5000} step={100} className="mt-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0]} DA</span><span>{priceRange[1]} DA</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('search.experience')}</Label>
        <Slider value={[minExperience]} onValueChange={v => { setMinExperience(v[0]); setPage(0); }} min={0} max={30} step={1} className="mt-2" />
        <p className="text-xs text-muted-foreground">{minExperience}+ {t('search.years')}</p>
      </div>
      <div className="space-y-2">
        <Label>{t('search.gender')}</Label>
        <Select value={selectedGender} onValueChange={v => { setSelectedGender(v); setPage(0); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.all')}</SelectItem>
            <SelectItem value="male">{t('search.male')}</SelectItem>
            <SelectItem value="female">{t('search.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="best-rated" checked={bestRated} onCheckedChange={(v) => setBestRated(!!v)} />
        <Label htmlFor="best-rated" className="cursor-pointer">{t('search.best_rated')}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="closest" checked={closestToMe} onCheckedChange={(v) => { if (v && !userLocation) handleLocateMe(); else setClosestToMe(!!v); }} />
        <Label htmlFor="closest" className="cursor-pointer">{t('search.closest')}</Label>
      </div>
      <Button variant="outline" className="w-full" onClick={() => { setSelectedCity('all'); setPriceRange([0, 5000]); setMinExperience(0); setSelectedGender('all'); setBestRated(false); setClosestToMe(false); setPage(0); }}>
        {t('search.reset_filters')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t('search.placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />{t('search.filters')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader><SheetTitle>{t('search.filters')}</SheetTitle></SheetHeader>
                  <div className="mt-6"><FiltersContent /></div>
                </SheetContent>
              </Sheet>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
              <Button variant={viewMode === 'map' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('map')}><MapIcon className="h-4 w-4" /></Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {searchData?.totalElements ?? 0} {t('search.results_found')}
          </p>

          <div className="flex gap-6">
            <aside className="hidden lg:block w-72 shrink-0">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />{t('search.filters')}
                  </h3>
                  <FiltersContent />
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}><CardContent className="p-5 space-y-3">
                      <div className="flex gap-3"><Skeleton className="h-14 w-14 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div></div>
                      <Skeleton className="h-8 w-full" />
                    </CardContent></Card>
                  ))}
                </div>
              ) : viewMode === 'map' ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <iframe title="Doctors Map" width="100%" height="500" frameBorder="0" scrolling="no"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=2%2C35%2C4%2C37&layer=mapnik`}
                      className="rounded-lg" />
                    <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                      {doctors.map(d => (
                        <Link key={d.id} to={`/doctor/details/${d.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Dr. {d.firstName} {d.lastName}</p>
                            <p className="text-xs text-muted-foreground">{d.address?.city} — {d.speciality?.name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {d.averageRating?.toFixed(1) ?? '-'}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {doctors.map((doc, i) => (
                      <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.3 }}>
                        <Card className="group hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all h-full">
                          <CardContent className="p-5 flex flex-col h-full">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-14 w-14 shrink-0">
                                <AvatarImage src={doc.profilePicture} />
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">{doc.firstName[0]}{doc.lastName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <Link to={`/doctor/details/${doc.id}`} className="font-semibold hover:text-primary transition-colors truncate block">
                                  Dr. {doc.firstName} {doc.lastName}
                                </Link>
                                <p className="text-xs text-primary font-medium">{doc.speciality?.name}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <StarRating rating={Math.round(doc.averageRating ?? 0)} size={12} />
                                  <span className="text-xs font-medium">{doc.averageRating?.toFixed(1) ?? '-'}</span>
                                  <span className="text-xs text-muted-foreground">({doc.reviewCount ?? 0})</span>
                                </div>
                              </div>
                              <button onClick={(e) => { e.preventDefault(); toggleFavorite(doc.id); }} className="shrink-0 p-1.5 rounded-full hover:bg-accent transition-colors">
                                <Heart className={favoriteIds.has(doc.id) ? 'h-4 w-4 fill-red-500 text-red-500' : 'h-4 w-4 text-muted-foreground'} />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {doc.tags?.map(tag => (
                                <Badge key={tag.id} variant="outline" className="text-[10px] px-1.5 py-0">{tag.name}</Badge>
                              ))}
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />{doc.address?.city}
                              </div>
                              <span className="font-bold text-primary text-sm">{doc.consultationFee} DA</span>
                            </div>
                            <Link to={`/doctor/details/${doc.id}`}>
                              <Button className="w-full mt-3 gap-2" size="sm">{t('search.view_profile')}</Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {doctors.length === 0 && (
                      <div className="col-span-full text-center py-16">
                        <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">{t('search.no_results')}</p>
                      </div>
                    )}
                  </div>
                  {searchData && searchData.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                        {t('search.previous') || 'Précédent'}
                      </Button>
                      <span className="text-sm text-muted-foreground flex items-center px-3">
                        {page + 1} / {searchData.totalPages}
                      </span>
                      <Button variant="outline" size="sm" disabled={searchData.last} onClick={() => setPage(p => p + 1)}>
                        {t('search.next') || 'Suivant'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
