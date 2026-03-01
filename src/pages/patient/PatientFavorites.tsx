import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import PatientLayout from '@/components/PatientLayout';

const initialFavorites = [
  { id: '1', name: 'Dr. Mohamed Benali', specialty: 'Cardiologue', rating: 4.7, totalReviews: 128, price: 3000, city: 'Alger' },
  { id: '4', name: 'Dr. Fatima Zerhouni', specialty: 'Pédiatre', rating: 4.8, totalReviews: 312, price: 2000, city: 'Alger' },
  { id: '2', name: 'Dr. Amira Hadj', specialty: 'Dermatologue', rating: 4.9, totalReviews: 256, price: 2500, city: 'Oran' },
];

const PatientFavorites = () => {
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [search, setSearch] = useState('');

  const filtered = favorites.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('patient.favorites.title')}</h1>
            <p className="text-sm text-muted-foreground">{favorites.length} {t('patient.favorites.count')}</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.favorites.search')} className="pl-9" />
        </div>

        <div className="space-y-3">
          {filtered.map(doc => (
            <Card key={doc.id} className="hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">{doc.name.split(' ').pop()?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link to={`/doctor/details/${doc.id}`} className="font-semibold text-sm hover:text-primary transition-colors">{doc.name}</Link>
                  <p className="text-xs text-primary font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{doc.rating}</span>
                      <span className="text-xs text-muted-foreground">({doc.totalReviews})</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" /> {doc.city}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-primary text-sm">{doc.price} DA</p>
                  <Button variant="ghost" size="sm" className="text-xs text-destructive hover:text-destructive mt-1 gap-1" onClick={() => setFavorites(prev => prev.filter(f => f.id !== doc.id))}>
                    <Trash2 className="h-3 w-3" />
                    {t('patient.favorites.remove')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t('patient.favorites.empty')}</p>
          )}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientFavorites;
