import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Stethoscope, X, Tag, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
import AdminLayout from '@/components/AdminLayout';

interface Specialty {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  doctors_count: number;
  tags: string[];
}

const initialSpecialties: Specialty[] = [
  { id: '1', name_fr: 'Généraliste', name_en: 'General Practitioner', name_ar: 'طبيب عام', doctors_count: 1240, tags: ['Médecine familiale', 'Check-up', 'Vaccinations'] },
  { id: '2', name_fr: 'Dentiste', name_en: 'Dentist', name_ar: 'طبيب أسنان', doctors_count: 890, tags: ['Orthodontie', 'Implants', 'Blanchiment'] },
  { id: '3', name_fr: 'Cardiologue', name_en: 'Cardiologist', name_ar: 'طبيب قلب', doctors_count: 340, tags: ['Échocardiographie', 'Hypertension', 'Arythmie'] },
  { id: '4', name_fr: 'Dermatologue', name_en: 'Dermatologist', name_ar: 'طبيب جلد', doctors_count: 520, tags: ['Acné', 'Eczéma', 'Dermatologie esthétique'] },
  { id: '5', name_fr: 'Ophtalmologue', name_en: 'Ophthalmologist', name_ar: 'طبيب عيون', doctors_count: 280, tags: ['Chirurgie laser', 'Glaucome', 'Cataracte'] },
  { id: '6', name_fr: 'Pédiatre', name_en: 'Pediatrician', name_ar: 'طبيب أطفال', doctors_count: 610, tags: ['Néonatologie', 'Croissance', 'Allergies'] },
];

const AdminSpecialties = () => {
  const { t } = useTranslation();
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form state
  const [formNameFr, setFormNameFr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Tag editing inline
  const [editingTagSpec, setEditingTagSpec] = useState<string | null>(null);
  const [editingTagIdx, setEditingTagIdx] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');

  const resetForm = () => {
    setFormNameFr('');
    setFormNameEn('');
    setFormNameAr('');
    setFormTags([]);
    setTagInput('');
    setEditingSpecialty(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (spec: Specialty) => {
    setEditingSpecialty(spec);
    setFormNameFr(spec.name_fr);
    setFormNameEn(spec.name_en);
    setFormNameAr(spec.name_ar);
    setFormTags([...spec.tags]);
    setTagInput('');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formNameFr.trim()) return;
    if (editingSpecialty) {
      setSpecialties(prev => prev.map(s => s.id === editingSpecialty.id ? {
        ...s, name_fr: formNameFr, name_en: formNameEn, name_ar: formNameAr, tags: formTags,
      } : s));
    } else {
      setSpecialties(prev => [...prev, {
        id: Date.now().toString(),
        name_fr: formNameFr, name_en: formNameEn, name_ar: formNameAr,
        doctors_count: 0, tags: formTags,
      }]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      setSpecialties(prev => prev.filter(s => s.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formTags.includes(tagInput.trim())) {
      setFormTags([...formTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Inline tag operations on cards
  const deleteTagFromSpec = (specId: string, tagIdx: number) => {
    setSpecialties(prev => prev.map(s => s.id === specId ? { ...s, tags: s.tags.filter((_, i) => i !== tagIdx) } : s));
  };

  const startEditTag = (specId: string, tagIdx: number, value: string) => {
    setEditingTagSpec(specId);
    setEditingTagIdx(tagIdx);
    setEditingTagValue(value);
  };

  const saveEditTag = () => {
    if (editingTagSpec !== null && editingTagIdx !== null && editingTagValue.trim()) {
      setSpecialties(prev => prev.map(s => s.id === editingTagSpec ? {
        ...s, tags: s.tags.map((t, i) => i === editingTagIdx ? editingTagValue.trim() : t),
      } : s));
    }
    setEditingTagSpec(null);
    setEditingTagIdx(null);
    setEditingTagValue('');
  };

  const [inlineTagInput, setInlineTagInput] = useState<Record<string, string>>({});

  const addTagToSpec = (specId: string) => {
    const val = inlineTagInput[specId]?.trim();
    if (val) {
      setSpecialties(prev => prev.map(s => s.id === specId ? { ...s, tags: [...s.tags, val] } : s));
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
          <Button className="gap-2 shadow-[var(--shadow-primary)]" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {t('admin.specialties.add')}
          </Button>
        </div>

        {/* Specialty Dialog (Create / Edit) */}
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSpecialty ? t('admin.edit') : t('admin.specialties.add')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nom (Français)</Label>
                <Input placeholder="Ex: Chirurgien" value={formNameFr} onChange={e => setFormNameFr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input placeholder="Ex: Surgeon" value={formNameEn} onChange={e => setFormNameEn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>الاسم (العربية)</Label>
                <Input placeholder="مثال: جراح" dir="rtl" value={formNameAr} onChange={e => setFormNameAr(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> {t('admin.specialties.tags')}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('admin.specialties.tag_placeholder')}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formTags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button onClick={() => setFormTags(formTags.filter((_, idx) => idx !== i))} className="rounded-full hover:bg-muted p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                {t('admin.cancel')}
              </Button>
              <Button onClick={handleSave}>
                {t('admin.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.specialties.confirm_delete')}</AlertDialogTitle>
              <AlertDialogDescription>{t('admin.specialties.confirm_delete_desc')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {t('admin.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((spec) => (
            <Card key={spec.id} className="group hover:border-primary/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{spec.name_fr}</h3>
                      <p className="text-xs text-muted-foreground">{spec.name_en}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{spec.doctors_count}</Badge>
                </div>

                {/* Tags with inline CRUD */}
                <div className="mt-3 space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {spec.tags.map((tag, i) => (
                      editingTagSpec === spec.id && editingTagIdx === i ? (
                        <div key={i} className="flex items-center gap-1">
                          <Input
                            className="h-6 text-xs w-28 px-1.5"
                            value={editingTagValue}
                            onChange={e => setEditingTagValue(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEditTag(); if (e.key === 'Escape') { setEditingTagSpec(null); setEditingTagIdx(null); } }}
                            autoFocus
                          />
                          <button onClick={saveEditTag} className="text-primary hover:text-primary/80"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => { setEditingTagSpec(null); setEditingTagIdx(null); }} className="text-muted-foreground"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        <Badge key={i} variant="outline" className="text-[10px] font-medium px-2 py-0.5 gap-1 group/tag cursor-default">
                          <span onClick={() => startEditTag(spec.id, i, tag)} className="cursor-pointer hover:text-primary">{tag}</span>
                          <button onClick={() => deleteTagFromSpec(spec.id, i)} className="opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-destructive">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </Badge>
                      )
                    ))}
                  </div>
                  {/* Inline add tag */}
                  <div className="flex gap-1.5">
                    <Input
                      className="h-7 text-xs flex-1"
                      placeholder={t('admin.specialties.add_tag')}
                      value={inlineTagInput[spec.id] || ''}
                      onChange={e => setInlineTagInput(prev => ({ ...prev, [spec.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTagToSpec(spec.id); } }}
                    />
                    <Button variant="outline" size="sm" className="h-7 px-2" onClick={() => addTagToSpec(spec.id)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => openEdit(spec)}>
                    <Pencil className="h-3 w-3" /> {t('admin.edit')}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => setDeleteTarget(spec.id)}>
                    <Trash2 className="h-3 w-3" /> {t('admin.delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSpecialties;
