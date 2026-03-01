import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const similarDoctors = [
  { id: '2', firstName: 'Amina', lastName: 'Khelifi', specialty: 'Cardiologie', rating: 4.5, totalReviews: 89, consultPrice: 2500, currency: 'DA', city: 'Alger', avatar: '' },
  { id: '3', firstName: 'Youcef', lastName: 'Hadj', specialty: 'Cardiologie', rating: 4.8, totalReviews: 156, consultPrice: 3500, currency: 'DA', city: 'Oran', avatar: '' },
  { id: '4', firstName: 'Fatima', lastName: 'Boudiaf', specialty: 'Cardiologie', rating: 4.3, totalReviews: 67, consultPrice: 2800, currency: 'DA', city: 'Constantine', avatar: '' },
  { id: '6', firstName: 'Karim', lastName: 'Meziane', specialty: 'Cardiologie', rating: 4.6, totalReviews: 112, consultPrice: 3200, currency: 'DA', city: 'Alger', avatar: '' },
];

const SimilarDoctors = ({ currentDoctorId }: { currentDoctorId: string }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const doctors = similarDoctors.filter((d) => d.id !== currentDoctorId);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{t('doctor_details.similar_doctors')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {doctors.map((doc) => (
          <Card
            key={doc.id}
            className="group hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/doctor/details/${doc.id}`)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={doc.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {doc.firstName[0]}{doc.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">Dr. {doc.firstName} {doc.lastName}</p>
                  <p className="text-xs text-primary">{doc.specialty}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{doc.rating}</span>
                  <span className="text-muted-foreground">({doc.totalReviews})</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {doc.city}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs font-bold">
                  {doc.consultPrice} {doc.currency}
                </Badge>
                <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                  <CalendarCheck className="h-3 w-3" />
                  {t('doctor_details.book_appointment')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarDoctors;
