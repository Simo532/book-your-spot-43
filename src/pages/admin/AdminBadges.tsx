import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Award, Star, Trophy, Gem, Crown } from 'lucide-react';
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
import AdminLayout from '@/components/AdminLayout';
import { cn } from '@/lib/utils';

const badgeIcons = [Star, Award, Trophy, Gem, Crown];
const badgeColors = [
  'bg-green-100 text-green-700 border-green-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

const mockBadges = [
  { id: '1', name_fr: 'Nouveau', name_en: 'New', name_ar: 'جديد', min_reviews: 0, min_appointments: 0, color: 0 },
  { id: '2', name_fr: 'Expérimenté', name_en: 'Experienced', name_ar: 'ذو خبرة', min_reviews: 10, min_appointments: 50, color: 1 },
  { id: '3', name_fr: 'Expert', name_en: 'Expert', name_ar: 'خبير', min_reviews: 50, min_appointments: 200, color: 2 },
  { id: '4', name_fr: 'Top Médecin', name_en: 'Top Doctor', name_ar: 'أفضل طبيب', min_reviews: 100, min_appointments: 500, color: 3 },
  { id: '5', name_fr: 'Élite', name_en: 'Elite', name_ar: 'نخبة', min_reviews: 200, min_appointments: 1000, color: 4 },
];

const AdminBadges = () => {
  const { t } = useTranslation();
  const [badges] = useState(mockBadges);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.badges.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.badges.subtitle')}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-[var(--shadow-primary)]">
                <Plus className="h-4 w-4" />
                {t('admin.badges.add')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.badges.add')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nom (Français)</Label>
                  <Input placeholder="Ex: Confirmé" />
                </div>
                <div className="space-y-2">
                  <Label>Name (English)</Label>
                  <Input placeholder="Ex: Confirmed" />
                </div>
                <div className="space-y-2">
                  <Label>الاسم (العربية)</Label>
                  <Input placeholder="مثال: مؤكد" dir="rtl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('admin.badges.min_reviews')}</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('admin.badges.min_appointments')}</Label>
                    <Input type="number" placeholder="0" />
                  </div>
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
          {badges.map((badge, i) => {
            const Icon = badgeIcons[i % badgeIcons.length];
            return (
              <Card key={badge.id} className="group hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center border', badgeColors[badge.color])}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{badge.name_fr}</h3>
                        <p className="text-xs text-muted-foreground">{badge.name_en}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      ≥ {badge.min_reviews} {t('admin.badges.reviews')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      ≥ {badge.min_appointments} {t('admin.badges.appointments_label')}
                    </Badge>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      <Pencil className="h-3 w-3" /> {t('admin.edit')}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" /> {t('admin.delete')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBadges;
