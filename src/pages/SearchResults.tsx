import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Star, Heart, SlidersHorizontal, X, Map as MapIcon, List,
  ChevronDown,
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
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mockDoctors = [
  { id: '1', firstName: 'Mohamed', lastName: 'Benali', specialty: 'Cardiologue', avatar: '', rating: 4.7, totalReviews: 128, consultPrice: 3000, currency: 'DA', city: 'Alger', wilaya: 'Alger', experience: 15, gender: 'male', lat: 36.7538, lng: 3.0588, tags: ['Échocardiographie', 'Hypertension'] },
  { id: '2', firstName: 'Amira', lastName: 'Hadj', specialty: 'Dermatologue', avatar: '', rating: 4.9, totalReviews: 256, consultPrice: 2500, currency: 'DA', city: 'Oran', wilaya: 'Oran', experience: 12, gender: 'female', lat: 35.6969, lng: -0.6331, tags: ['Acné', 'Eczéma'] },
  { id: '3', firstName: 'Karim', lastName: 'Messaoud', specialty: 'Généraliste', avatar: '', rating: 4.3, totalReviews: 89, consultPrice: 1500, currency: 'DA', city: 'Constantine', wilaya: 'Constantine', experience: 8, gender: 'male', lat: 36.365, lng: 6.6147, tags: ['Check-up', 'Vaccinations'] },
  { id: '4', firstName: 'Fatima', lastName: 'Zerhouni', specialty: 'Pédiatre', avatar: '', rating: 4.8, totalReviews: 312, consultPrice: 2000, currency: 'DA', city: 'Alger', wilaya: 'Alger', experience: 20, gender: 'female', lat: 36.7600, lng: 3.0500, tags: ['Néonatologie', 'Allergies'] },
  { id: '5', firstName: 'Youcef', lastName: 'Boudiaf', specialty: 'Ophtalmologue', avatar: '', rating: 4.5, totalReviews: 167, consultPrice: 3500, currency: 'DA', city: 'Blida', wilaya: 'Blida', experience: 10, gender: 'male', lat: 36.4703, lng: 2.8277, tags: ['Chirurgie laser', 'Glaucome'] },
  { id: '6', firstName: 'Nadia', lastName: 'Rahmani', specialty: 'Dentiste', avatar: '', rating: 4.6, totalReviews: 198, consultPrice: 2000, currency: 'DA', city: 'Oran', wilaya: 'Oran', experience: 7, gender: 'female', lat: 35.6900, lng: -0.6400, tags: ['Orthodontie', 'Implants'] },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [minExperience, setMinExperience] = useState(0);
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [bestRated, setBestRated] = useState(false);
  const [closestToMe, setClosestToMe] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setClosestToMe(true);
      });
    }
  };

  const filteredDoctors = useMemo(() => {
    let results = mockDoctors.filter(d => {
      const matchesSearch = !searchQuery || d.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || d.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'all' || d.city === selectedCity;
      const matchesPrice = d.consultPrice >= priceRange[0] && d.consultPrice <= priceRange[1];
      const matchesExp = d.experience >= minExperience;
      const matchesGender = selectedGender === 'all' || d.gender === selectedGender;
      return matchesSearch && matchesCity && matchesPrice && matchesExp && matchesGender;
    });

    if (bestRated) results.sort((a, b) => b.rating - a.rating);
    if (closestToMe && userLocation) {
      results.sort((a, b) => getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) - getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng));
    }
    return results;
  }, [searchQuery, selectedCity, priceRange, minExperience, selectedGender, bestRated, closestToMe, userLocation]);

  // Build map URL showing all filtered doctors
  const mapBounds = useMemo(() => {
    if (filteredDoctors.length === 0) return null;
    const lats = filteredDoctors.map(d => d.lat);
    const lngs = filteredDoctors.map(d => d.lng);
    return {
      minLat: Math.min(...lats) - 0.5,
      maxLat: Math.max(...lats) + 0.5,
      minLng: Math.min(...lngs) - 0.5,
      maxLng: Math.max(...lngs) + 0.5,
    };
  }, [filteredDoctors]);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* City */}
      <div className="space-y-2">
        <Label>{t('search.city')}</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.all_cities')}</SelectItem>
            {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label>{t('search.price_range')}</Label>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={5000} step={100} className="mt-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0]} DA</span>
          <span>{priceRange[1]} DA</span>
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <Label>{t('search.experience')}</Label>
        <Slider value={[minExperience]} onValueChange={v => setMinExperience(v[0])} min={0} max={30} step={1} className="mt-2" />
        <p className="text-xs text-muted-foreground">{minExperience}+ {t('search.years')}</p>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label>{t('search.gender')}</Label>
        <Select value={selectedGender} onValueChange={setSelectedGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.all')}</SelectItem>
            <SelectItem value="male">{t('search.male')}</SelectItem>
            <SelectItem value="female">{t('search.female')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Best rated */}
      <div className="flex items-center gap-2">
        <Checkbox id="best-rated" checked={bestRated} onCheckedChange={(v) => setBestRated(!!v)} />
        <Label htmlFor="best-rated" className="cursor-pointer">{t('search.best_rated')}</Label>
      </div>

      {/* Closest */}
      <div className="flex items-center gap-2">
        <Checkbox id="closest" checked={closestToMe} onCheckedChange={(v) => { if (v && !userLocation) handleLocateMe(); else setClosestToMe(!!v); }} />
        <Label htmlFor="closest" className="cursor-pointer">{t('search.closest')}</Label>
      </div>

      <Button variant="outline" className="w-full" onClick={() => { setSelectedCity('all'); setPriceRange([0, 5000]); setMinExperience(0); setSelectedGender('all'); setBestRated(false); setClosestToMe(false); }}>
        {t('search.reset_filters')}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {/* Mobile filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t('search.filters')}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader><SheetTitle>{t('search.filters')}</SheetTitle></SheetHeader>
                  <div className="mt-6"><FiltersContent /></div>
                </SheetContent>
              </Sheet>

              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {filteredDoctors.length} {t('search.results_found')}
          </p>

          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t('search.filters')}
                  </h3>
                  <FiltersContent />
                </CardContent>
              </Card>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {viewMode === 'map' ? (
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {mapBounds && (
                      <iframe
                        title="Doctors Map"
                        width="100%"
                        height="500"
                        frameBorder="0"
                        scrolling="no"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds.minLng}%2C${mapBounds.minLat}%2C${mapBounds.maxLng}%2C${mapBounds.maxLat}&layer=mapnik`}
                        className="rounded-lg"
                      />
                    )}
                    {/* Doctor markers list below map */}
                    <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
                      {filteredDoctors.map(d => (
                        <Link key={d.id} to={`/doctor/details/${d.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">Dr. {d.firstName} {d.lastName}</p>
                            <p className="text-xs text-muted-foreground">{d.city} — {d.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {d.rating}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDoctors.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Card className="group hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all h-full">
                        <CardContent className="p-5 flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <Avatar className="h-14 w-14 shrink-0">
                              <AvatarImage src={doc.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {doc.firstName[0]}{doc.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <Link to={`/doctor/details/${doc.id}`} className="font-semibold hover:text-primary transition-colors truncate block">
                                Dr. {doc.firstName} {doc.lastName}
                              </Link>
                              <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <StarRating rating={Math.round(doc.rating)} size={12} />
                                <span className="text-xs font-medium">{doc.rating}</span>
                                <span className="text-xs text-muted-foreground">({doc.totalReviews})</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => { e.preventDefault(); toggleFavorite(doc.id); }}
                              className="shrink-0 p-1.5 rounded-full hover:bg-accent transition-colors"
                            >
                              <Heart className={favorites.has(doc.id) ? 'h-4 w-4 fill-red-500 text-red-500' : 'h-4 w-4 text-muted-foreground'} />
                            </button>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-3">
                            {doc.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                            ))}
                          </div>

                          {/* Details */}
                          <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {doc.city}
                            </div>
                            <span className="font-bold text-primary text-sm">
                              {doc.consultPrice} {doc.currency}
                            </span>
                          </div>

                          <Link to={`/doctor/details/${doc.id}`}>
                            <Button className="w-full mt-3 gap-2" size="sm">
                              {t('search.view_profile')}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {filteredDoctors.length === 0 && (
                    <div className="col-span-full text-center py-16">
                      <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">{t('search.no_results')}</p>
                    </div>
                  )}
                </div>
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
