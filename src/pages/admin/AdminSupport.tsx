import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Search, MoreHorizontal, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useAllSupportMessages, useUpdateSupportMessage, useDeleteSupportMessage } from '@/hooks/useSupportHooks';
import { ShimmerTableRow } from '@/components/ui/shimmer';
import { SupportMessage } from '@/types/support';

const AdminSupport = () => {
  const { t } = useTranslation();
  const { data: supportData, isLoading } = useAllSupportMessages(0, 50);
  const updateMutation = useUpdateSupportMessage();
  const deleteMutation = useDeleteSupportMessage();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportMessage | null>(null);

  const tickets = supportData?.content || [];

  const filtered = tickets.filter((tk) => {
    const matchSearch = tk.objet.toLowerCase().includes(search.toLowerCase()) || tk.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'treated' && tk.treated) ||
      (statusFilter === 'untreated' && !tk.treated);
    return matchSearch && matchStatus;
  });

  const handleMarkTreated = (ticket: SupportMessage) => {
    updateMutation.mutate({
      id: ticket.id!,
      message: { ...ticket, treated: true },
    });
  };

  const treatedCount = tickets.filter(t => t.treated).length;
  const untreatedCount = tickets.filter(t => !t.treated).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.support.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.support.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="text-destructive"><AlertCircle className="h-4 w-4" /></div>
              <div>
                <p className="text-2xl font-bold">{untreatedCount}</p>
                <p className="text-sm text-muted-foreground">{t('admin.support.status_open')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <div className="text-green-600"><CheckCircle2 className="h-4 w-4" /></div>
              <div>
                <p className="text-2xl font-bold">{treatedCount}</p>
                <p className="text-sm text-muted-foreground">{t('admin.support.status_resolved')}</p>
              </div>
            </CardContent>
          </Card>
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
                  <SelectItem value="untreated">{t('admin.support.status_open')}</SelectItem>
                  <SelectItem value="treated">{t('admin.support.status_resolved')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-1">{Array.from({ length: 5 }).map((_, i) => <ShimmerTableRow key={i} cols={5} />)}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.support.subject')}</TableHead>
                    <TableHead>{t('admin.users.name')}</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>{t('admin.users.status')}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tk) => (
                    <TableRow key={tk.id} className="cursor-pointer" onClick={() => setSelectedTicket(tk)}>
                      <TableCell className="font-medium">{tk.objet}</TableCell>
                      <TableCell>{tk.fullName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{tk.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${tk.treated ? 'text-green-600' : 'text-destructive'}`}>
                          {tk.treated ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          {tk.treated ? t('admin.support.status_resolved') : t('admin.support.status_open')}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleMarkTreated(tk)}>{t('admin.support.mark_resolved')}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(tk.id!)}>{t('admin.delete')}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> {selectedTicket?.objet}
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedTicket.fullName}</span>
                  <span>({selectedTicket.email})</span>
                  {selectedTicket.createdAt && <span className="ml-auto">{formatDate(selectedTicket.createdAt)}</span>}
                </div>
                <div className="rounded-xl px-4 py-2.5 text-sm bg-accent">
                  <p>{selectedTicket.message}</p>
                </div>
                {!selectedTicket.treated && (
                  <Button onClick={() => { handleMarkTreated(selectedTicket); setSelectedTicket(null); }}>
                    {t('admin.support.mark_resolved')}
                  </Button>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
