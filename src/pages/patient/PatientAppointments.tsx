import { useState } from 'react';
import { formatDate, formatTime } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, Clock, Video, MapPin, Trash2, Search, Filter, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReviewModal from '@/components/patient/ReviewModal';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ShimmerListItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PatientLayout from '@/components/PatientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointmentsByPatient, useCancelAppointment } from '@/hooks/useApiHooks';
import { AppointmentResponseDTO } from '@/types/appointment';

const PatientAppointments = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { doctorOrPatientId } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reviewApt, setReviewApt] = useState<AppointmentResponseDTO | null>(null);
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [timeFilter, setTimeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data: appointments, isLoading } = useAppointmentsByPatient(doctorOrPatientId || '', 0, 50);
  const cancelMutation = useCancelAppointment();

  const allApts = appointments || [];

  const applyFilters = (list: AppointmentResponseDTO[]) =>
    list.filter(a => {
      if (!a.doctorName.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFilter && a.appointmentDate) {
        if (new Date(a.appointmentDate).toISOString().split('T')[0] !== format(dateFilter, 'yyyy-MM-dd')) return false;
      }
      if (timeFilter !== 'all' && a.appointmentDate) {
        const hour = new Date(a.appointmentDate).getHours();
        if (timeFilter === 'morning' && hour >= 12) return false;
        if (timeFilter === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (timeFilter === 'evening' && hour < 18) return false;
      }
      if (modeFilter !== 'all') {
        if (modeFilter === 'video' && !a.online) return false;
        if (modeFilter === 'cabinet' && a.online) return false;
      }
      return true;
    });

  const upcoming = allApts.filter(a => ['CONFIRMED', 'PENDING', 'PAID'].includes(a.status));
  const past = allApts.filter(a => ['COMPLETED', 'CANCELLED'].includes(a.status));
  const hasActiveFilters = dateFilter || timeFilter !== 'all' || modeFilter !== 'all';

  const handleDelete = () => {
    if (!deleteId) return;
    cancelMutation.mutate(deleteId);
    setDeleteId(null);
  };

  const AppointmentCard = ({ apt }: { apt: AppointmentResponseDTO }) => {
    const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate) : null;
    return (
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {apt.online ? <Video className="h-5 w-5 text-primary" /> : <MapPin className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{apt.doctorName}</p>
          <p className="text-xs text-muted-foreground">{apt.doctorCity}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            {aptDate ? `${formatDate(aptDate)} · ${formatTime(aptDate)}` : 'ASAP'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant={apt.status === 'CONFIRMED' ? 'default' : apt.status === 'PENDING' ? 'secondary' : apt.status === 'COMPLETED' ? 'default' : 'destructive'}>
            {t(`patient.appointments.status.${apt.status.toLowerCase()}`)}
          </Badge>
          <div className="flex gap-1">
            {apt.online && ['CONFIRMED', 'PAID'].includes(apt.status) && (
              <Button variant="default" size="sm" className="text-xs gap-1 h-7" onClick={() => navigate(`/zoom/${apt.id}`)}>
                <Video className="h-3 w-3" />{t('zoom.join', 'Rejoindre')}
              </Button>
            )}
            {['CONFIRMED', 'PENDING'].includes(apt.status) && (
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7 text-destructive hover:text-destructive" onClick={() => setDeleteId(apt.id)}>
                <Trash2 className="h-3 w-3" />{t('patient.appointments.cancel')}
              </Button>
            )}
            {apt.status === 'COMPLETED' && (
              <Button variant="outline" size="sm" className="text-xs gap-1 h-7" onClick={() => setReviewApt(apt)}>
                <MessageSquare className="h-3 w-3" />{t('patient.review.add', 'Avis')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          <Card><CardContent className="p-4">
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
                <Button variant="ghost" size="sm" onClick={() => { setDateFilter(undefined); setTimeFilter('all'); setModeFilter('all'); }} className="text-xs text-destructive hover:text-destructive">
                  {t('patient.appointments.filters.clear')}
                </Button>
              )}
            </div>
          </CardContent></Card>
        )}

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <ShimmerListItem key={i} />)}</div>
        ) : (
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
        )}

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
