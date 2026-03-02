import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Pencil, Trash2, Zap, TrendingUp, Star, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Boost {
  id: string;
  type: string;
  xpPoints: number;
  active: boolean;
  createdAt: string;
}

const boostTypes = [
  { value: 'profile_completion', icon: Star },
  { value: 'top_search', icon: TrendingUp },
  { value: 'featured', icon: Eye },
  { value: 'priority', icon: Zap },
];

const initialBoosts: Boost[] = [
  { id: '1', type: 'profile_completion', xpPoints: 50, active: true, createdAt: '2025-12-01' },
  { id: '2', type: 'top_search', xpPoints: 100, active: true, createdAt: '2025-12-05' },
  { id: '3', type: 'featured', xpPoints: 200, active: false, createdAt: '2025-12-10' },
  { id: '4', type: 'priority', xpPoints: 150, active: true, createdAt: '2025-12-15' },
];

const AdminBoosts = () => {
  const { t } = useTranslation();
  const [boosts, setBoosts] = useState<Boost[]>(initialBoosts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBoost, setEditingBoost] = useState<Boost | null>(null);
  const [form, setForm] = useState({ type: '', xpPoints: 0, active: true });

  const openAdd = () => {
    setEditingBoost(null);
    setForm({ type: '', xpPoints: 0, active: true });
    setDialogOpen(true);
  };

  const openEdit = (boost: Boost) => {
    setEditingBoost(boost);
    setForm({ type: boost.type, xpPoints: boost.xpPoints, active: boost.active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.type || form.xpPoints <= 0) {
      toast({ title: t('admin.boosts.error_fill'), variant: 'destructive' });
      return;
    }
    if (editingBoost) {
      setBoosts(prev => prev.map(b => b.id === editingBoost.id ? { ...b, ...form } : b));
      toast({ title: t('admin.boosts.updated') });
    } else {
      setBoosts(prev => [...prev, { id: Date.now().toString(), ...form, createdAt: new Date().toISOString().split('T')[0] }]);
      toast({ title: t('admin.boosts.created') });
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
  const totalXP = boosts.reduce((sum, b) => sum + b.xpPoints, 0);

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
                  <TableHead>{t('admin.boosts.type')}</TableHead>
                  <TableHead>{t('admin.boosts.xp_points')}</TableHead>
                  <TableHead>{t('admin.boosts.status')}</TableHead>
                  <TableHead>{t('admin.boosts.created')}</TableHead>
                  <TableHead className="text-right">{t('admin.boosts.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boosts.map(boost => {
                  const typeInfo = boostTypes.find(bt => bt.value === boost.type);
                  const Icon = typeInfo?.icon || Zap;
                  return (
                    <TableRow key={boost.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-medium">{t(`admin.boosts.types.${boost.type}`)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{boost.xpPoints} XP</Badge>
                      </TableCell>
                      <TableCell>
                        <Switch checked={boost.active} onCheckedChange={() => toggleActive(boost.id)} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{boost.createdAt}</TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBoost ? t('admin.boosts.edit') : t('admin.boosts.add')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.boosts.type')}</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue placeholder={t('admin.boosts.select_type')} /></SelectTrigger>
                <SelectContent>
                  {boostTypes.map(bt => (
                    <SelectItem key={bt.value} value={bt.value}>{t(`admin.boosts.types.${bt.value}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('admin.boosts.xp_points')}</Label>
              <Input type="number" value={form.xpPoints} onChange={e => setForm(f => ({ ...f, xpPoints: Number(e.target.value) }))} />
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
