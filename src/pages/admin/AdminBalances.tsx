import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Minus, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/components/AdminLayout';

interface UserBalance {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
  balance: number;
  history: { type: 'credit' | 'debit'; amount: number; reason: string; date: string }[];
}

const mockBalances: UserBalance[] = [
  { id: '1', name: 'Sara Alaoui', role: 'patient', balance: 2500, history: [
    { type: 'credit', amount: 3000, reason: 'Rechargement', date: '2026-02-28' },
    { type: 'debit', amount: 500, reason: 'Paiement RDV', date: '2026-02-27' },
  ]},
  { id: '2', name: 'Dr. Ahmed Benali', role: 'doctor', balance: 15000, history: [
    { type: 'credit', amount: 15000, reason: 'Revenus consultations', date: '2026-02-28' },
  ]},
  { id: '3', name: 'Fatima Zahra', role: 'patient', balance: 800, history: [
    { type: 'credit', amount: 1000, reason: 'Rechargement', date: '2026-02-25' },
    { type: 'debit', amount: 200, reason: 'Paiement RDV', date: '2026-02-26' },
  ]},
  { id: '4', name: 'Dr. Youssef Kabir', role: 'doctor', balance: 8500, history: [
    { type: 'credit', amount: 8500, reason: 'Revenus consultations', date: '2026-02-20' },
  ]},
];

const AdminBalances = () => {
  const { t } = useTranslation();
  const [balances, setBalances] = useState(mockBalances);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [adjustDialog, setAdjustDialog] = useState<UserBalance | null>(null);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const filtered = balances.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleAdjust = () => {
    const amount = parseFloat(adjustAmount);
    if (!adjustDialog || isNaN(amount) || amount <= 0 || !adjustReason.trim()) return;
    setBalances((prev) => prev.map((u) => {
      if (u.id !== adjustDialog.id) return u;
      const newBalance = adjustType === 'credit' ? u.balance + amount : u.balance - amount;
      return {
        ...u,
        balance: Math.max(0, newBalance),
        history: [{ type: adjustType, amount, reason: adjustReason, date: new Date().toISOString().split('T')[0] }, ...u.history],
      };
    }));
    setAdjustDialog(null);
    setAdjustAmount('');
    setAdjustReason('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.balances.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.balances.subtitle')}</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <Wallet className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{balances.reduce((s, u) => s + u.balance, 0).toLocaleString()} DA</p>
                <p className="text-sm text-muted-foreground">{t('admin.balances.total_balance')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <ArrowUpRight className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{balances.filter((u) => u.role === 'patient').reduce((s, u) => s + u.balance, 0).toLocaleString()} DA</p>
                <p className="text-sm text-muted-foreground">{t('admin.balances.patients_total')}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex items-center gap-3">
              <ArrowDownRight className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{balances.filter((u) => u.role === 'doctor').reduce((s, u) => s + u.balance, 0).toLocaleString()} DA</p>
                <p className="text-sm text-muted-foreground">{t('admin.balances.doctors_total')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('admin.balances.search')} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.users.all_roles')}</SelectItem>
                  <SelectItem value="patient">{t('auth.role_patient')}</SelectItem>
                  <SelectItem value="doctor">{t('auth.role_doctor')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.users.name')}</TableHead>
                  <TableHead>{t('admin.users.role')}</TableHead>
                  <TableHead>{t('admin.balances.balance')}</TableHead>
                  <TableHead>{t('admin.balances.last_transaction')}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'} className="capitalize">
                        {user.role === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{user.balance.toLocaleString()} DA</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.history[0] && (
                        <span className={`inline-flex items-center gap-1 ${user.history[0].type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                          {user.history[0].type === 'credit' ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                          {user.history[0].amount.toLocaleString()} DA
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setAdjustDialog(user)}>
                        {t('admin.balances.adjust')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Adjust dialog */}
        <Dialog open={!!adjustDialog} onOpenChange={(open) => !open && setAdjustDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.balances.adjust_title')} — {adjustDialog?.name}</DialogTitle>
            </DialogHeader>
            {adjustDialog && (
              <div className="space-y-4 pt-2">
                <p className="text-sm text-muted-foreground">{t('admin.balances.current')}: <span className="font-bold text-foreground">{adjustDialog.balance.toLocaleString()} DA</span></p>
                <div className="space-y-2">
                  <Label>{t('admin.balances.type')}</Label>
                  <div className="flex gap-2">
                    <Button variant={adjustType === 'credit' ? 'default' : 'outline'} onClick={() => setAdjustType('credit')} className="flex-1 gap-2">
                      <Plus className="h-4 w-4" /> {t('admin.balances.credit')}
                    </Button>
                    <Button variant={adjustType === 'debit' ? 'destructive' : 'outline'} onClick={() => setAdjustType('debit')} className="flex-1 gap-2">
                      <Minus className="h-4 w-4" /> {t('admin.balances.debit')}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.balances.amount')}</Label>
                  <Input type="number" min="0" placeholder="0" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.balances.reason')}</Label>
                  <Textarea placeholder={t('admin.balances.reason_placeholder')} value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} />
                </div>
                <Button onClick={handleAdjust} className="w-full">{t('admin.balances.confirm')}</Button>

                {/* History */}
                {adjustDialog.history.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">{t('admin.balances.history')}</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {adjustDialog.history.map((h, i) => (
                        <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                          <div className="flex items-center gap-2">
                            <span className={h.type === 'credit' ? 'text-green-600' : 'text-destructive'}>
                              {h.type === 'credit' ? '+' : '-'}{h.amount.toLocaleString()} DA
                            </span>
                            <span className="text-muted-foreground">{h.reason}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBalances;
