import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Award, Star, Trophy, Gem, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/AdminLayout';
import { cn } from '@/lib/utils';
import { useAllBadges, useCreateBadge, useUpdateBadge, useDeleteBadge } from '@/hooks/useBadgeHooks';
import { BadgeRequestDTO } from '@/types/badge';

const badgeIcons = [Star, Award, Trophy, Gem, Crown];

const AdminBadges = () => {
  const { t } = useTranslation();
  const { data: badges, isLoading } = useAllBadges();
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge();
  const deleteBadge = useDeleteBadge();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', commentNumber: 0, appointmentNumber: 0, color: '#3b82f6', rating: 0, visibility: 1 });

  const resetForm = () => {
    setForm({ title: '', description: '', commentNumber: 0, appointmentNumber: 0, color: '#3b82f6', rating: 0, visibility: 1 });
    setEditingId(null);
  };

  const openEdit = (badge: any) => {
    setEditingId(badge.id);
    setForm({
      title: badge.title, description: badge.description,
      commentNumber: badge.commentNumber, appointmentNumber: badge.appointmentNumber,
      color: badge.color, rating: badge.rating, visibility: badge.visibility,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const dto: BadgeRequestDTO = { ...form };
    if (editingId) {
      updateBadge.mutate({ id: editingId, dto });
    } else {
      createBadge.mutate({ dto });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteBadge.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.badges.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.badges.subtitle')}</p>
          </div>
          <Button className="gap-2" onClick={() => { resetForm(); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" />
            {t('admin.badges.add')}
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? t('admin.edit') : t('admin.badges.add')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('admin.badges.min_reviews')}</Label>
                  <Input type="number" value={form.commentNumber} onChange={e => setForm({ ...form, commentNumber: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.badges.min_appointments')}</Label>
                  <Input type="number" value={form.appointmentNumber} onChange={e => setForm({ ...form, appointmentNumber: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="h-10 w-20" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave}>{t('admin.save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.specialties.confirm_delete')}</AlertDialogTitle>
              <AlertDialogDescription>{t('admin.specialties.confirm_delete_desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('admin.delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(badges || []).map((badge, i) => {
              const Icon = badgeIcons[i % badgeIcons.length];
              return (
                <Card key={badge.id} className="group hover:border-primary/30 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ backgroundColor: badge.color + '20', borderColor: badge.color + '40', color: badge.color }}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{badge.title}</h3>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        ≥ {badge.commentNumber} {t('admin.badges.reviews')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ≥ {badge.appointmentNumber} {t('admin.badges.appointments_label')}
                      </Badge>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => openEdit(badge)}>
                        <Pencil className="h-3 w-3" /> {t('admin.edit')}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteId(badge.id)}>
                        <Trash2 className="h-3 w-3" /> {t('admin.delete')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBadges;
