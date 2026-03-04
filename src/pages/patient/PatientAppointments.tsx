import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Clock, Video, MapPin, RefreshCw, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PatientLayout from '@/components/PatientLayout';

const initialAppointments = [
  { id: 1, doctor: 'Dr. Ahmed Benali', specialty: 'Cardiologue', date: '2026-03-03', time: '09:00', status: 'confirmed', type: 'cabinet', gender: 'male' },
  { id: 2, doctor: 'Dr. Amina Khelifi', specialty: 'Dermatologue', date: '2026-03-07', time: '14:30', status: 'pending', type: 'video', gender: 'female' },
  { id: 3, doctor: 'Dr. Omar Idrissi', specialty: 'Dentiste', date: '2026-02-20', time: '10:00', status: 'completed', type: 'cabinet', gender: 'male' },
  { id: 4, doctor: 'Dr. Fatima Zerhouni', specialty: 'Pédiatre', date: '2026-02-15', time: '11:00', status: 'cancelled', type: 'video', gender: 'female' },
];

const PatientAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState('');
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [timeFilter, setTimeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (list: typeof appointments) =>
    list.filter(a => {
      if (!a.doctor.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFilter && a.date !== format(dateFilter, 'yyyy-MM-dd')) return false;
      if (timeFilter !== 'all') {
        const hour = parseInt(a.time.split(':')[0]);
        if (timeFilter === 'morning' && hour >= 12) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === 'evening' && hour < 18) return false;
      }
      if (genderFilter !== 'all' && a.gender !== genderFilter) return false;
      if (modeFilter !== 'all' && a.type !== modeFilter) return false;
      return true;
    });

  const upcoming = appointments.filter(a => ['confirmed', 'pending'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  const clearFilters = () => {
    setDateFilter(undefined);
    setTimeFilter('all');
    setGenderFilter('all');
    setModeFilter('all');
  };

  const hasActiveFilters = dateFilter || timeFilter !== 'all' || genderFilter !== 'all' || modeFilter !== 'all';

  const handleReschedule = () => {
    if (!rescheduleId || !newDate || !newTime) return;
    setAppointments(prev => prev.map(a => a.id === rescheduleId ? { ...a, date: newDate, time: newTime, status: 'pending' } : a));
    setRescheduleId(null);
    setNewDate('');
    setNewTime('');
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setAppointments(prev => prev.map(a => a.id === deleteId ? { ...a, status: 'cancelled' } : a));
    setDeleteId(null);
  };

  const AppointmentCard = ({ apt }: { apt: typeof appointments[0] }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        {apt.type === 'video' ? <Video className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{apt.doctor}</p>
        <p className="text-xs text-muted-foreground">{apt.specialty}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Clock className="h-3 w-3" /> {apt.date} · {apt.time}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Badge variant={apt.status === 'confirmed' ? 'default' : apt.status === 'pending' ? 'secondary' : apt.status === 'completed' ? 'default' : 'destructive'}>
          {t(`patient.appointments.status.${apt.status}`)}
        </Badge>
        {['confirmed', 'pending'].includes(apt.status) && (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={() => { setRescheduleId(apt.id); setNewDate(apt.date); setNewTime(apt.time); }}>
              <RefreshCw className="h-3 w-3" />
              {t('patient.appointments.reschedule')}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(apt.id)}>
              <Trash2 className="h-3 w-3" />
              {t('patient.appointments.cancel')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('patient.appointments.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('patient.appointments.subtitle')}</p>
        </div>

        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.appointments.search')} className="pl-9" />
          </div>
          <Button variant={hasActiveFilters ? 'default' : 'outline'} size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('patient.appointments.filters.date')}</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("w-[160px] justify-start text-left font-normal text-xs", !dateFilter && "text-muted-foreground")}>
                        <CalendarCheck className="mr-2 h-3.5 w-3.5" />
                        {dateFilter ? format(dateFilter, 'dd/MM/yyyy') : t('patient.appointments.filters.select_date')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('patient.appointments.filters.time')}</label>
                  <Select value={timeFilter} onValueChange={setTimeFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('patient.appointments.filters.all_times')}</SelectItem>
                      <SelectItem value="morning">{t('patient.appointments.filters.morning')}</SelectItem>
                      <SelectItem value="afternoon">{t('patient.appointments.filters.afternoon')}</SelectItem>
                      <SelectItem value="evening">{t('patient.appointments.filters.evening')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('patient.appointments.filters.gender')}</label>
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('patient.appointments.filters.all_genders')}</SelectItem>
                      <SelectItem value="male">{t('patient.appointments.filters.male')}</SelectItem>
                      <SelectItem value="female">{t('patient.appointments.filters.female')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{t('patient.appointments.filters.mode')}</label>
                  <Select value={modeFilter} onValueChange={setModeFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('patient.appointments.filters.all_modes')}</SelectItem>
                      <SelectItem value="cabinet">{t('patient.appointments.filters.cabinet')}</SelectItem>
                      <SelectItem value="video">{t('patient.appointments.filters.online')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-destructive hover:text-destructive">
                    {t('patient.appointments.filters.clear')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">{t('patient.appointments.upcoming_tab')} ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">{t('patient.appointments.past_tab')} ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-3 mt-4">
            {applyFilters(upcoming).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('patient.appointments.no_upcoming')}</p>
            ) : applyFilters(upcoming).map(a => <AppointmentCard key={a.id} apt={a} />)}
          </TabsContent>
          <TabsContent value="past" className="space-y-3 mt-4">
            {applyFilters(past).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('patient.appointments.no_past')}</p>
            ) : applyFilters(past).map(a => <AppointmentCard key={a.id} apt={a} />)}
          </TabsContent>
        </Tabs>

        <Dialog open={rescheduleId !== null} onOpenChange={() => setRescheduleId(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t('patient.appointments.reschedule')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>{t('patient.appointments.new_date')}</Label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t('patient.appointments.new_time')}</Label>
                <Input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
              </div>
              <Button onClick={handleReschedule} className="w-full">{t('patient.appointments.confirm_reschedule')}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('patient.appointments.cancel_title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('patient.appointments.cancel_desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t('patient.appointments.confirm_cancel')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PatientLayout>
  );
};

export default PatientAppointments;
