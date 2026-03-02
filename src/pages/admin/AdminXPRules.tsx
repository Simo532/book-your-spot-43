import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Trophy, Target, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface XPRule {
  id: string;
  title: string;
  description: string;
  xpPoints: number;
  active: boolean;
}

const initialRules: XPRule[] = [
  { id: '1', title: 'Compléter le profil', description: 'Le médecin complète 100% de son profil', xpPoints: 50, active: true },
  { id: '2', title: 'Premier rendez-vous', description: 'Le médecin reçoit son premier patient', xpPoints: 30, active: true },
  { id: '3', title: '10 avis positifs', description: 'Obtenir 10 avis avec une note ≥ 4', xpPoints: 100, active: true },
  { id: '4', title: '50 rendez-vous', description: 'Atteindre 50 rendez-vous confirmés', xpPoints: 200, active: false },
  { id: '5', title: 'Réponse rapide', description: 'Répondre aux messages en moins de 2h', xpPoints: 20, active: true },
];

const AdminXPRules = () => {
  const { t } = useTranslation();
  const [rules, setRules] = useState<XPRule[]>(initialRules);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<XPRule | null>(null);
  const [form, setForm] = useState({ title: '', description: '', xpPoints: 0, active: true });

  const openAdd = () => {
    setEditingRule(null);
    setForm({ title: '', description: '', xpPoints: 0, active: true });
    setDialogOpen(true);
  };

  const openEdit = (rule: XPRule) => {
    setEditingRule(rule);
    setForm({ title: rule.title, description: rule.description, xpPoints: rule.xpPoints, active: rule.active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || form.xpPoints <= 0) {
      toast({ title: t('admin.xp_rules.error_fill'), variant: 'destructive' });
      return;
    }
    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...form } : r));
      toast({ title: t('admin.xp_rules.updated') });
    } else {
      setRules(prev => [...prev, { id: Date.now().toString(), ...form }]);
      toast({ title: t('admin.xp_rules.created') });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      setRules(prev => prev.filter(r => r.id !== deleteId));
      toast({ title: t('admin.xp_rules.deleted') });
      setDeleteId(null);
    }
  };

  const toggleActive = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const totalActive = rules.filter(r => r.active).length;
  const totalXP = rules.reduce((sum, r) => sum + r.xpPoints, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.xp_rules.title')}</h1>
            <p className="text-muted-foreground">{t('admin.xp_rules.subtitle')}</p>
          </div>
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('admin.xp_rules.add')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Target className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.xp_rules.total')}</p>
                  <p className="text-2xl font-bold">{rules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.xp_rules.active_count')}</p>
                  <p className="text-2xl font-bold">{totalActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><Trophy className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.xp_rules.total_xp')}</p>
                  <p className="text-2xl font-bold">{totalXP} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.xp_rules.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.xp_rules.rule_title')}</TableHead>
                  <TableHead>{t('admin.xp_rules.description')}</TableHead>
                  <TableHead>{t('admin.xp_rules.xp_points')}</TableHead>
                  <TableHead>{t('admin.xp_rules.status')}</TableHead>
                  <TableHead className="text-right">{t('admin.xp_rules.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map(rule => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">{rule.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{rule.xpPoints} XP</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch checked={rule.active} onCheckedChange={() => toggleActive(rule.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(rule)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(rule.id)}>
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

        {/* Info */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Trophy className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('admin.xp_rules.info_title')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('admin.xp_rules.info_desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRule ? t('admin.xp_rules.edit') : t('admin.xp_rules.add')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.xp_rules.rule_title')}</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={t('admin.xp_rules.title_placeholder')} />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.xp_rules.description')}</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t('admin.xp_rules.desc_placeholder')} />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.xp_rules.xp_points')}</Label>
              <Input type="number" value={form.xpPoints} onChange={e => setForm(f => ({ ...f, xpPoints: Number(e.target.value) }))} />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t('admin.xp_rules.active_label')}</Label>
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
            <AlertDialogTitle>{t('admin.xp_rules.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.xp_rules.confirm_delete_desc')}</AlertDialogDescription>
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

export default AdminXPRules;
