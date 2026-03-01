import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarCheck, Clock, Video, MapPin, RefreshCw, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import PatientLayout from '@/components/PatientLayout';

const initialAppointments = [
  { id: 1, doctor: 'Dr. Ahmed Benali', specialty: 'Cardiologue', date: '2026-03-03', time: '09:00', status: 'confirmed', type: 'cabinet' },
  { id: 2, doctor: 'Dr. Amina Khelifi', specialty: 'Dermatologue', date: '2026-03-07', time: '14:30', status: 'pending', type: 'video' },
  { id: 3, doctor: 'Dr. Omar Idrissi', specialty: 'Dentiste', date: '2026-02-20', time: '10:00', status: 'completed', type: 'cabinet' },
  { id: 4, doctor: 'Dr. Fatima Zerhouni', specialty: 'Pédiatre', date: '2026-02-15', time: '11:00', status: 'cancelled', type: 'video' },
];

const PatientAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState('');
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const upcoming = appointments.filter(a => ['confirmed', 'pending'].includes(a.status));
  const past = appointments.filter(a => ['completed', 'cancelled'].includes(a.status));

  const filtered = (list: typeof appointments) =>
    list.filter(a => a.doctor.toLowerCase().includes(search.toLowerCase()));

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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.appointments.search')} className="pl-9" />
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">{t('patient.appointments.upcoming_tab')} ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">{t('patient.appointments.past_tab')} ({past.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-3 mt-4">
            {filtered(upcoming).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('patient.appointments.no_upcoming')}</p>
            ) : filtered(upcoming).map(a => <AppointmentCard key={a.id} apt={a} />)}
          </TabsContent>
          <TabsContent value="past" className="space-y-3 mt-4">
            {filtered(past).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t('patient.appointments.no_past')}</p>
            ) : filtered(past).map(a => <AppointmentCard key={a.id} apt={a} />)}
          </TabsContent>
        </Tabs>

        {/* Reschedule dialog */}
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

        {/* Delete confirmation */}
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
