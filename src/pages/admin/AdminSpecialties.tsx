import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import AdminLayout from '@/components/AdminLayout';

const mockSpecialties = [
  { id: '1', name_fr: 'Généraliste', name_en: 'General Practitioner', name_ar: 'طبيب عام', doctors_count: 1240 },
  { id: '2', name_fr: 'Dentiste', name_en: 'Dentist', name_ar: 'طبيب أسنان', doctors_count: 890 },
  { id: '3', name_fr: 'Cardiologue', name_en: 'Cardiologist', name_ar: 'طبيب قلب', doctors_count: 340 },
  { id: '4', name_fr: 'Dermatologue', name_en: 'Dermatologist', name_ar: 'طبيب جلد', doctors_count: 520 },
  { id: '5', name_fr: 'Ophtalmologue', name_en: 'Ophthalmologist', name_ar: 'طبيب عيون', doctors_count: 280 },
  { id: '6', name_fr: 'Pédiatre', name_en: 'Pediatrician', name_ar: 'طبيب أطفال', doctors_count: 610 },
];

const AdminSpecialties = () => {
  const { t } = useTranslation();
  const [specialties] = useState(mockSpecialties);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.specialties.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.specialties.subtitle')}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-[var(--shadow-primary)]">
                <Plus className="h-4 w-4" />
                {t('admin.specialties.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.specialties.add')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom (Français)</Label>
                  <Input placeholder="Ex: Chirurgien" />
                </div>
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input placeholder="Ex: Surgeon" />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (العربية)</Label>
                  <Input placeholder="مثال: جراح" dir="rtl" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  {t('admin.save')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

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
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Pencil className="h-3 w-3" /> {t('admin.edit')}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive">
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
