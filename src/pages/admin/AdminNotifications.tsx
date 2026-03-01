import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Send, Clock, Users, Stethoscope, User, Search, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/components/AdminLayout';

const mockUsers = [
  { id: '1', name: 'Dr. Ahmed Benali', role: 'doctor' },
  { id: '2', name: 'Dr. Amina Khelifi', role: 'doctor' },
  { id: '3', name: 'Sara Alaoui', role: 'patient' },
  { id: '4', name: 'Mohamed Hadj', role: 'patient' },
  { id: '5', name: 'Fatima Zerhouni', role: 'patient' },
];

const sentNotifications = [
  { id: 1, title: 'Maintenance prévue', target: 'all', scheduledAt: null, sentAt: '2026-02-28 14:00', status: 'sent' },
  { id: 2, title: 'Nouvelles fonctionnalités', target: 'doctors', scheduledAt: null, sentAt: '2026-02-27 10:00', status: 'sent' },
  { id: 3, title: 'Promotion de mars', target: 'patients', scheduledAt: '2026-03-01 09:00', sentAt: null, status: 'scheduled' },
  { id: 4, title: 'Rappel vérification', target: 'specific', scheduledAt: null, sentAt: '2026-02-26 16:30', status: 'sent' },
];

const AdminNotifications = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [timing, setTiming] = useState('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(sentNotifications);

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const toggleUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSend = () => {
    const newNotif = {
      id: notifications.length + 1,
      title,
      target,
      scheduledAt: timing === 'scheduled' ? `${scheduledDate} ${scheduledTime}` : null,
      sentAt: timing === 'immediate' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : null,
      status: timing === 'immediate' ? 'sent' as const : 'scheduled' as const,
    };
    setNotifications([newNotif, ...notifications]);
    setTitle('');
    setMessage('');
    setTarget('all');
    setTiming('immediate');
    setSelectedUsers([]);
    setOpen(false);
  };

  const targetIcon = (t: string) => {
    switch (t) {
      case 'all': return <Users className="h-3.5 w-3.5" />;
      case 'doctors': return <Stethoscope className="h-3.5 w-3.5" />;
      case 'patients': return <User className="h-3.5 w-3.5" />;
      default: return <User className="h-3.5 w-3.5" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.notifications.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.notifications.subtitle')}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Bell className="h-4 w-4" />
                {t('admin.notifications.new')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t('admin.notifications.new')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('admin.notifications.notif_title')}</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t('admin.notifications.title_placeholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.notifications.message')}</Label>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('admin.notifications.message_placeholder')} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label>{t('admin.notifications.target')}</Label>
                  <Select value={target} onValueChange={setTarget}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('admin.notifications.target_all')}</SelectItem>
                      <SelectItem value="doctors">{t('admin.notifications.target_doctors')}</SelectItem>
                      <SelectItem value="patients">{t('admin.notifications.target_patients')}</SelectItem>
                      <SelectItem value="specific">{t('admin.notifications.target_specific')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {target === 'specific' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder={t('admin.notifications.search_user')} className="pl-9" />
                    </div>
                    <div className="max-h-32 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                      {filteredUsers.map(u => (
                        <label key={u.id} className="flex items-center gap-3 px-3 py-2 hover:bg-accent/50 cursor-pointer">
                          <input type="checkbox" checked={selectedUsers.includes(u.id)} onChange={() => toggleUser(u.id)} className="rounded" />
                          <span className="text-sm flex-1">{u.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{u.role}</Badge>
                        </label>
                      ))}
                    </div>
                    {selectedUsers.length > 0 && (
                      <p className="text-xs text-muted-foreground">{selectedUsers.length} {t('admin.notifications.selected')}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('admin.notifications.timing')}</Label>
                  <RadioGroup value={timing} onValueChange={setTiming} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="immediate" id="immediate" />
                      <Label htmlFor="immediate" className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <Send className="h-3.5 w-3.5" />
                        {t('admin.notifications.immediate')}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled" className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        {t('admin.notifications.scheduled')}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {timing === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t('admin.notifications.date')}</Label>
                      <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t('admin.notifications.time')}</Label>
                      <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                    </div>
                  </div>
                )}

                <Button onClick={handleSend} className="w-full gap-2" disabled={!title || !message}>
                  {timing === 'immediate' ? <Send className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                  {timing === 'immediate' ? t('admin.notifications.send_now') : t('admin.notifications.schedule')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'sent').length}</p>
                  <p className="text-xs text-muted-foreground">{t('admin.notifications.total_sent')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'scheduled').length}</p>
                  <p className="text-xs text-muted-foreground">{t('admin.notifications.total_scheduled')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12,458</p>
                  <p className="text-xs text-muted-foreground">{t('admin.notifications.total_recipients')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('admin.notifications.history')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    {n.status === 'sent' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{n.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.status === 'sent' ? `${t('admin.notifications.sent_at')} ${n.sentAt}` : `${t('admin.notifications.scheduled_for')} ${n.scheduledAt}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      {targetIcon(n.target)}
                      {t(`admin.notifications.target_${n.target}`)}
                    </Badge>
                    <Badge variant={n.status === 'sent' ? 'default' : 'secondary'}>
                      {n.status === 'sent' ? t('admin.notifications.status_sent') : t('admin.notifications.status_scheduled')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
