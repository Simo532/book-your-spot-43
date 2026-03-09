import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Stethoscope, X, Tag, Check } from 'lucide-react';
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
import {
  useAllSpecialities, useCreateSpeciality, useUpdateSpeciality, useDeleteSpeciality,
  useTagsBySpeciality, useCreateTag, useDeleteTag,
} from '@/hooks/useSpecialityHooks';

const AdminSpecialties = () => {
  const { t } = useTranslation();
  const { data: specialities, isLoading } = useAllSpecialities();
  const createSpec = useCreateSpeciality();
  const updateSpec = useUpdateSpeciality();
  const deleteSpec = useDeleteSpeciality();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [inlineTagInput, setInlineTagInput] = useState<Record<string, string>>({});

  // Track which speciality's tags to show
  const [selectedSpecForTags, setSelectedSpecForTags] = useState<string | null>(null);

  const resetForm = () => { setFormName(''); setFormDesc(''); setEditingId(null); };

  const openCreate = () => { resetForm(); setDialogOpen(true); };
  const openEdit = (spec: { id: string; name: string; description: string }) => {
    setEditingId(spec.id);
    setFormName(spec.name);
    setFormDesc(spec.description);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingId) {
      updateSpec.mutate({ id: editingId, dto: { name: formName, description: formDesc } });
    } else {
      createSpec.mutate({ name: formName, description: formDesc });
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteSpec.mutate(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const addTagToSpec = (specId: string) => {
    const val = inlineTagInput[specId]?.trim();
    if (val) {
      createTag.mutate({ name: val, specialityId: specId });
      setInlineTagInput(prev => ({ ...prev, [specId]: '' }));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.specialties.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.specialties.subtitle')}</p>
          </div>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t('admin.specialties.add')}
          </Button>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? t('admin.edit') : t('admin.specialties.add')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{t('admin.specialties.name')}</Label>
                <Input placeholder="Ex: Chirurgien" value={formName} onChange={e => setFormName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input placeholder="Description..." value={formDesc} onChange={e => setFormDesc(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>{t('admin.cancel')}</Button>
              <Button onClick={handleSave}>{t('admin.save')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
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
            {(specialities || []).map((spec) => (
              <SpecialityCard
                key={spec.id}
                spec={spec}
                t={t}
                inlineTagInput={inlineTagInput}
                setInlineTagInput={setInlineTagInput}
                onEdit={() => openEdit(spec)}
                onDelete={() => setDeleteTarget(spec.id)}
                onAddTag={() => addTagToSpec(spec.id)}
                onDeleteTag={(tagId: string) => deleteTag.mutate(tagId)}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

function SpecialityCard({ spec, t, inlineTagInput, setInlineTagInput, onEdit, onDelete, onAddTag, onDeleteTag }: any) {
  const { data: tags } = useTagsBySpeciality(spec.id);

  return (
    <Card className="group hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{spec.name}</h3>
              <p className="text-xs text-muted-foreground">{spec.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {(tags || []).map((tag: any) => (
              <Badge key={tag.id} variant="outline" className="text-[10px] font-medium px-2 py-0.5 gap-1 group/tag">
                <span>{tag.name}</span>
                <button onClick={() => onDeleteTag(tag.id)} className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-destructive">
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Input
              className="h-7 text-xs flex-1"
              placeholder={t('admin.specialties.add_tag')}
              value={inlineTagInput[spec.id] || ''}
              onChange={e => setInlineTagInput((prev: any) => ({ ...prev, [spec.id]: e.target.value }))}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddTag(); } }}
            />
            <Button variant="outline" size="sm" className="h-7 px-2" onClick={onAddTag}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={onEdit}>
            <Pencil className="h-3 w-3" /> {t('admin.edit')}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-3 w-3" /> {t('admin.delete')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminSpecialties;
