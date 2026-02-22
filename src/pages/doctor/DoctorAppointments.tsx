import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Clock, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DoctorLayout from '@/components/DoctorLayout';

const mockAppointments = [
  { id: 1, patient: 'Amina Khelifi', time: '09:00', date: '2026-02-22', type: 'Consultation', status: 'confirmed', phone: '0555 12 34 56' },
  { id: 2, patient: 'Youcef Hadj', time: '09:30', date: '2026-02-22', type: 'Suivi', status: 'confirmed', phone: '0661 78 90 12' },
  { id: 3, patient: 'Sara Boumediene', time: '10:00', date: '2026-02-22', type: 'Consultation', status: 'pending', phone: '0770 34 56 78' },
  { id: 4, patient: 'Karim Mesli', time: '10:30', date: '2026-02-22', type: 'Urgence', status: 'confirmed', phone: '0550 90 12 34' },
  { id: 5, patient: 'Nadia Ferhat', time: '11:00', date: '2026-02-22', type: 'Consultation', status: 'cancelled', phone: '0660 56 78 90' },
  { id: 6, patient: 'Rachid Boudiaf', time: '14:00', date: '2026-02-23', type: 'Suivi', status: 'pending', phone: '0771 12 34 56' },
];

const DoctorAppointments = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = mockAppointments.filter((a) =>
    a.patient.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.appointments.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.appointments.subtitle')}</p>
        </div>

        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">{t('doctor.appointments.all')}</TabsTrigger>
              <TabsTrigger value="today">{t('doctor.appointments.today')}</TabsTrigger>
              <TabsTrigger value="upcoming">{t('doctor.appointments.upcoming_tab')}</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('doctor.appointments.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filtered.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{apt.patient}</p>
                        <p className="text-xs text-muted-foreground">{apt.type} · {apt.date} · {apt.time}</p>
                      </div>
                      <p className="text-xs text-muted-foreground hidden md:block">{apt.phone}</p>
                      <Badge variant={getStatusColor(apt.status) as any}>
                        {t(`doctor.appointments.status.${apt.status}`)}
                      </Badge>
                      <div className="flex gap-1">
                        {apt.status === 'pending' && (
                          <>
                            <Button size="sm" variant="default" className="h-8 text-xs">
                              {t('doctor.appointments.accept')}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs">
                              {t('doctor.appointments.decline')}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="today" className="mt-4">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {t('doctor.appointments.today_placeholder')}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                {t('doctor.appointments.upcoming_placeholder')}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DoctorLayout>
  );
};

export default DoctorAppointments;
