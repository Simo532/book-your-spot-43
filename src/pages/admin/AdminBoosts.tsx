import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Zap, TrendingUp, Star, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BoostType {
  id: string;
  name: string;
  xpAmount: number;
  durationDays: number;
  price: number;
  active: boolean;
  description: string;
}

const initialBoosts: BoostType[] = [
  { id: '1', name: 'BOOST_3_DAYS', xpAmount: 50, durationDays: 3, price: 29.99, active: true, description: 'Boost de 3 jours pour améliorer la visibilité' },
  { id: '2', name: 'BOOST_7_DAYS', xpAmount: 100, durationDays: 7, price: 49.99, active: true, description: 'Boost de 7 jours avec meilleur classement' },
  { id: '3', name: 'BOOST_14_DAYS', xpAmount: 200, durationDays: 14, price: 79.99, active: false, description: 'Boost de 14 jours premium' },
  { id: '4', name: 'BOOST_30_DAYS', xpAmount: 500, durationDays: 30, price: 129.99, active: true, description: 'Boost mensuel avec visibilité maximale' },
];

const emptyForm = { name: '', xpAmount: 0, durationDays: 0, price: 0, active: true, description: '' };

const AdminBoosts = () => {
  const { t } = useTranslation();
  const [boosts, setBoosts] = useState<BoostType[]>(initialBoosts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBoost, setEditingBoost] = useState<BoostType | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingBoost(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (boost: BoostType) => {
    setEditingBoost(boost);
    setForm({ name: boost.name, xpAmount: boost.xpAmount, durationDays: boost.durationDays, price: boost.price, active: boost.active, description: boost.description });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || form.xpAmount <= 0 || form.durationDays <= 0 || form.price <= 0) {
      toast({ title: t('admin.boosts.error_fill'), variant: 'destructive' });
      return;
    }
    if (editingBoost) {
      setBoosts(prev => prev.map(b => b.id === editingBoost.id ? { ...b, ...form } : b));
      toast({ title: t('admin.boosts.updated') });
    } else {
      setBoosts(prev => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: t('admin.boosts.created_msg') });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setBoosts(prev => prev.filter(b => b.id !== deleteId));
      toast({ title: t('admin.boosts.deleted') });
      setDeleteId(null);
    }
  };

  const toggleActive = (id: string) => {
    setBoosts(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const totalActive = boosts.filter(b => b.active).length;
  const totalXP = boosts.reduce((sum, b) => sum + b.xpAmount, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.boosts.title')}</h1>
            <p className="text-muted-foreground">{t('admin.boosts.subtitle')}</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('admin.boosts.add')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Zap className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.boosts.total')}</p>
                  <p className="text-2xl font-bold">{boosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10"><TrendingUp className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.boosts.active_count')}</p>
                  <p className="text-2xl font-bold">{totalActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><Star className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.boosts.total_xp')}</p>
                  <p className="text-2xl font-bold">{totalXP} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.boosts.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.boosts.name')}</TableHead>
                  <TableHead>{t('admin.boosts.xp_amount')}</TableHead>
                  <TableHead>{t('admin.boosts.duration')}</TableHead>
                  <TableHead>{t('admin.boosts.price')}</TableHead>
                  <TableHead>{t('admin.boosts.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.boosts.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boosts.map(boost => (
                  <TableRow key={boost.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{boost.name}</span>
                        {boost.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">{boost.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{boost.xpAmount} XP</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{boost.durationDays} {t('admin.boosts.days')}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{boost.price.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={boost.active} onCheckedChange={() => toggleActive(boost.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(boost)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(boost.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBoost ? t('admin.boosts.edit') : t('admin.boosts.add')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.boosts.name')}</Label>
              <Input
                placeholder="BOOST_3_DAYS"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('admin.boosts.xp_amount')}</Label>
                <Input type="number" value={form.xpAmount} onChange={e => setForm(f => ({ ...f, xpAmount: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>{t('admin.boosts.duration')}</Label>
                <Input type="number" value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.boosts.price')}</Label>
              <Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.boosts.description')}</Label>
              <Textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('admin.boosts.active_label')}</Label>
              <Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t('admin.cancel')}</Button>
            <Button onClick={handleSave}>{t('admin.save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.boosts.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.boosts.confirm_delete_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('admin.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBoosts;
