import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MoreHorizontal, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AdminLayout from '@/components/AdminLayout';

interface Ticket {
  id: string;
  subject: string;
  userName: string;
  userRole: 'patient' | 'doctor';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  messages: { sender: string; text: string; date: string }[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TK-001', subject: 'Problème de paiement', userName: 'Sara Alaoui', userRole: 'patient',
    status: 'open', priority: 'high', createdAt: '2026-02-28',
    messages: [{ sender: 'Sara Alaoui', text: 'Mon paiement n\'a pas été confirmé.', date: '2026-02-28' }],
  },
  {
    id: 'TK-002', subject: 'Mise à jour du profil', userName: 'Dr. Ahmed Benali', userRole: 'doctor',
    status: 'in_progress', priority: 'medium', createdAt: '2026-02-27',
    messages: [{ sender: 'Dr. Ahmed Benali', text: 'Je ne peux pas modifier ma photo.', date: '2026-02-27' }],
  },
  {
    id: 'TK-003', subject: 'Annulation de rendez-vous', userName: 'Fatima Zahra', userRole: 'patient',
    status: 'resolved', priority: 'low', createdAt: '2026-02-25',
    messages: [
      { sender: 'Fatima Zahra', text: 'Je voudrais annuler mon rendez-vous.', date: '2026-02-25' },
      { sender: 'Admin', text: 'Votre rendez-vous a été annulé avec succès.', date: '2026-02-25' },
    ],
  },
];

const statusIcons = {
  open: <AlertCircle className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  resolved: <CheckCircle2 className="h-4 w-4" />,
};

const statusColors = {
  open: 'text-destructive',
  in_progress: 'text-yellow-600',
  resolved: 'text-green-600',
};

const priorityVariants: Record<string, 'default' | 'secondary' | 'destructive'> = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
};

const AdminSupport = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState(mockTickets);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');

  const filtered = tickets.filter((tk) => {
    const matchSearch = tk.subject.toLowerCase().includes(search.toLowerCase()) || tk.userName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || tk.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id: string, newStatus: Ticket['status']) => {
    setTickets((prev) => prev.map((tk) => tk.id === id ? { ...tk, status: newStatus } : tk));
    if (selectedTicket?.id === id) setSelectedTicket((prev) => prev ? { ...prev, status: newStatus } : prev);
  };

  const handleReply = () => {
    if (!reply.trim() || !selectedTicket) return;
    const newMsg = { sender: 'Admin', text: reply, date: new Date().toISOString().split('T')[0] };
    setTickets((prev) => prev.map((tk) => tk.id === selectedTicket.id ? { ...tk, messages: [...tk.messages, newMsg] } : tk));
    setSelectedTicket((prev) => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
    setReply('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.support.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.support.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['open', 'in_progress', 'resolved'] as const).map((s) => (
            <Card key={s}>
              <CardContent className="pt-6 flex items-center gap-3">
                <div className={statusColors[s]}>{statusIcons[s]}</div>
                <div>
                  <p className="text-2xl font-bold">{tickets.filter((tk) => tk.status === s).length}</p>
                  <p className="text-sm text-muted-foreground">{t(`admin.support.status_${s}`)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('admin.support.search')} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.support.all_status')}</SelectItem>
                  <SelectItem value="open">{t('admin.support.status_open')}</SelectItem>
                  <SelectItem value="in_progress">{t('admin.support.status_in_progress')}</SelectItem>
                  <SelectItem value="resolved">{t('admin.support.status_resolved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.support.ticket_id')}</TableHead>
                  <TableHead>{t('admin.support.subject')}</TableHead>
                  <TableHead>{t('admin.users.name')}</TableHead>
                  <TableHead>{t('admin.support.priority')}</TableHead>
                  <TableHead>{t('admin.users.status')}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tk) => (
                  <TableRow key={tk.id} className="cursor-pointer" onClick={() => setSelectedTicket(tk)}>
                    <TableCell className="font-mono text-xs">{tk.id}</TableCell>
                    <TableCell className="font-medium">{tk.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tk.userName}
                        <Badge variant="outline" className="text-[10px]">
                          {tk.userRole === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priorityVariants[tk.priority]}>{t(`admin.support.priority_${tk.priority}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${statusColors[tk.status]}`}>
                        {statusIcons[tk.status]}
                        {t(`admin.support.status_${tk.status}`)}
                      </span>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusChange(tk.id, 'in_progress')}>{t('admin.support.mark_in_progress')}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(tk.id, 'resolved')}>{t('admin.support.mark_resolved')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ticket detail dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> {selectedTicket?.subject}
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedTicket.userName}</span>
                  <Badge variant="outline" className="text-[10px]">{selectedTicket.userRole === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}</Badge>
                  <span className="ml-auto">{selectedTicket.createdAt}</span>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.messages.map((msg, i) => (
                    <div key={i} className={`rounded-xl px-4 py-2.5 text-sm ${msg.sender === 'Admin' ? 'bg-primary text-primary-foreground ml-8' : 'bg-accent mr-8'}`}>
                      <span className="text-[10px] font-medium block mb-0.5 opacity-80">{msg.sender}</span>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea placeholder={t('admin.support.reply_placeholder')} value={reply} onChange={(e) => setReply(e.target.value)} className="min-h-[60px]" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Select value={selectedTicket.status} onValueChange={(v) => handleStatusChange(selectedTicket.id, v as Ticket['status'])}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">{t('admin.support.status_open')}</SelectItem>
                      <SelectItem value="in_progress">{t('admin.support.status_in_progress')}</SelectItem>
                      <SelectItem value="resolved">{t('admin.support.status_resolved')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleReply}>{t('admin.support.send_reply')}</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
