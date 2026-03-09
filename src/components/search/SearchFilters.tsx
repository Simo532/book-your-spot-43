import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const cities = ['Alger', 'Oran', 'Constantine', 'Blida', 'Annaba', 'Sétif'];

interface SearchFiltersProps {
  selectedSpeciality: string;
  setSelectedSpeciality: (v: string) => void;
  selectedCity: string;
  setSelectedCity: (v: string) => void;
  priceRange: number[];
  setPriceRange: (v: number[]) => void;
  minExperience: number;
  setMinExperience: (v: number) => void;
  selectedGender: string;
  setSelectedGender: (v: string) => void;
  bestRated: boolean;
  setBestRated: (v: boolean) => void;
  closestToMe: boolean;
  setClosestToMe: (v: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
  handleLocateMe: () => void;
  specialities: Array<{ id: string; name: string }>;
  setPage: (v: number) => void;
  resetFilters: () => void;
}

const SearchFilters = ({
  selectedSpeciality, setSelectedSpeciality, selectedCity, setSelectedCity,
  priceRange, setPriceRange, minExperience, setMinExperience, selectedGender,
  setSelectedGender, bestRated, setBestRated, closestToMe, setClosestToMe,
  userLocation, handleLocateMe, specialities, setPage, resetFilters,
}: SearchFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-semibold">{t('search.speciality') || 'Spécialité'}</Label>
        <Select value={selectedSpeciality} onValueChange={v => { setSelectedSpeciality(v); setPage(0); }}>
          <SelectTrigger><SelectValue placeholder={t('search.all_specialities') || 'Toutes les spécialités'} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('search.all_specialities') || 'Toutes les spécialités'}</SelectItem>
            {specialities?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="border-t border-border pt-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">{t('search.extra_filters') || 'Filtres supplémentaires'}</p>
      </div>
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
        <div className="flex justify-between text-xs text-muted-foreground"><span>{priceRange[0]} DA</span><span>{priceRange[1]} DA</span></div>
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
      <Button variant="outline" className="w-full" onClick={resetFilters}>{t('search.reset_filters')}</Button>
    </div>
  );
};

export default SearchFilters;
