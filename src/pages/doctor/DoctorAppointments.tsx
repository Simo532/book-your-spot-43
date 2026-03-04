import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Clock, Search, Filter, Video, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import DoctorLayout from '@/components/DoctorLayout';

const mockAppointments = [
  { id: 1, patient: 'Amina Khelifi', time: '09:00', date: '2026-02-22', type: 'Consultation', status: 'confirmed', phone: '0555 12 34 56', gender: 'female', mode: 'cabinet' },
  { id: 2, patient: 'Youcef Hadj', time: '09:30', date: '2026-02-22', type: 'Suivi', status: 'confirmed', phone: '0661 78 90 12', gender: 'male', mode: 'video' },
  { id: 3, patient: 'Sara Boumediene', time: '10:00', date: '2026-02-22', type: 'Consultation', status: 'pending', phone: '0770 34 56 78', gender: 'female', mode: 'cabinet' },
  { id: 4, patient: 'Karim Mesli', time: '10:30', date: '2026-02-22', type: 'Urgence', status: 'confirmed', phone: '0550 90 12 34', gender: 'male', mode: 'video' },
  { id: 5, patient: 'Nadia Ferhat', time: '11:00', date: '2026-02-22', type: 'Consultation', status: 'cancelled', phone: '0660 56 78 90', gender: 'female', mode: 'cabinet' },
  { id: 6, patient: 'Rachid Boudiaf', time: '14:00', date: '2026-02-23', type: 'Suivi', status: 'pending', phone: '0771 12 34 56', gender: 'male', mode: 'video' },
];

const DoctorAppointments = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [timeFilter, setTimeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = mockAppointments.filter((a) => {
    if (!a.patient.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFilter && a.date !== format(dateFilter, 'yyyy-MM-dd')) return false;
    if (timeFilter !== 'all') {
      const hour = parseInt(a.time.split(':')[0]);
      if (timeFilter === 'morning' && hour >= 12) return false;
      if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
      if (timeFilter === 'evening' && hour < 18) return false;
    }
    if (genderFilter !== 'all' && a.gender !== genderFilter) return false;
    if (modeFilter !== 'all' && a.mode !== modeFilter) return false;
    return true;
  });

  const clearFilters = () => {
    setDateFilter(undefined);
    setTimeFilter('all');
    setGenderFilter('all');
    setModeFilter('all');
  };

  const hasActiveFilters = dateFilter || timeFilter !== 'all' || genderFilter !== 'all' || modeFilter !== 'all';

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
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('doctor.appointments.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant={hasActiveFilters ? 'default' : 'outline'} size="icon" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-3 items-end">
                  {/* Date filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{t('doctor.appointments.filters.date')}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("w-[160px] justify-start text-left font-normal text-xs", !dateFilter && "text-muted-foreground")}>
                          <CalendarCheck className="mr-2 h-3.5 w-3.5" />
                          {dateFilter ? format(dateFilter, 'dd/MM/yyyy') : t('doctor.appointments.filters.select_date')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Time filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{t('doctor.appointments.filters.time')}</label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('doctor.appointments.filters.all_times')}</SelectItem>
                        <SelectItem value="morning">{t('doctor.appointments.filters.morning')}</SelectItem>
                        <SelectItem value="afternoon">{t('doctor.appointments.filters.afternoon')}</SelectItem>
                        <SelectItem value="evening">{t('doctor.appointments.filters.evening')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gender filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{t('doctor.appointments.filters.gender')}</label>
                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                      <SelectTrigger className="w-[130px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('doctor.appointments.filters.all_genders')}</SelectItem>
                        <SelectItem value="male">{t('doctor.appointments.filters.male')}</SelectItem>
                        <SelectItem value="female">{t('doctor.appointments.filters.female')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mode filter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">{t('doctor.appointments.filters.mode')}</label>
                    <Select value={modeFilter} onValueChange={setModeFilter}>
                      <SelectTrigger className="w-[140px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('doctor.appointments.filters.all_modes')}</SelectItem>
                        <SelectItem value="cabinet">{t('doctor.appointments.filters.cabinet')}</SelectItem>
                        <SelectItem value="video">{t('doctor.appointments.filters.online')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-destructive hover:text-destructive">
                      {t('doctor.appointments.filters.clear')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">{t('doctor.appointments.filters.no_results')}</p>
                  ) : filtered.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
                        {apt.mode === 'video' ? <Video className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
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
