import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/AdminLayout';

interface Review {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

const mockDoctors = [
  { id: 'd1', name: 'Dr. Ahmed Benali' },
  { id: 'd2', name: 'Dr. Youssef Kabir' },
  { id: 'd3', name: 'Dr. Omar Idrissi' },
];

const initialReviews: Review[] = [
  { id: 'r1', doctorId: 'd1', doctorName: 'Dr. Ahmed Benali', patientName: 'Sara Alaoui', rating: 5, comment: 'Excellent médecin, très professionnel.', date: '2026-02-28' },
  { id: 'r2', doctorId: 'd1', doctorName: 'Dr. Ahmed Benali', patientName: 'Fatima Zahra', rating: 4, comment: 'Bonne consultation, un peu d\'attente.', date: '2026-02-27' },
  { id: 'r3', doctorId: 'd2', doctorName: 'Dr. Youssef Kabir', patientName: 'Omar K.', rating: 3, comment: 'Correct mais peut mieux faire.', date: '2026-02-25' },
];

const StarRating = ({ value, onChange }: { value: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
        <Star className={`h-5 w-5 ${s <= value ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
      </button>
    ))}
  </div>
);

const AdminReviews = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState(initialReviews);
  const [open, setOpen] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const handleAdd = () => {
    if (!doctorId || !patientName.trim() || !comment.trim()) return;
    const doctor = mockDoctors.find((d) => d.id === doctorId);
    if (!doctor) return;
    setReviews((prev) => [{
      id: `r${Date.now()}`,
      doctorId,
      doctorName: doctor.name,
      patientName: patientName.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
    }, ...prev]);
    setOpen(false);
    setDoctorId('');
    setPatientName('');
    setRating(5);
    setComment('');
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const filtered = filterDoctor === 'all' ? reviews : reviews.filter((r) => r.doctorId === filterDoctor);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.reviews.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.reviews.subtitle')}</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />{t('admin.reviews.add')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.reviews.add')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('auth.role_doctor')}</Label>
                  <Select value={doctorId} onValueChange={setDoctorId}>
                    <SelectTrigger><SelectValue placeholder={t('admin.reviews.select_doctor')} /></SelectTrigger>
                    <SelectContent>
                      {mockDoctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.reviews.patient_name')}</Label>
                  <Input placeholder={t('admin.reviews.patient_name_placeholder')} value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.reviews.rating')}</Label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="space-y-2">
                  <Label>{t('admin.reviews.comment')}</Label>
                  <Textarea placeholder={t('admin.reviews.comment_placeholder')} value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>
                <Button onClick={handleAdd} className="w-full">{t('admin.reviews.submit')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-3">
          <Select value={filterDoctor} onValueChange={setFilterDoctor}>
            <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.reviews.all_doctors')}</SelectItem>
              {mockDoctors.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card><CardContent className="py-8 text-center text-muted-foreground">{t('admin.reviews.empty')}</CardContent></Card>
          )}
          {filtered.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{review.doctorName}</span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-sm text-muted-foreground">{review.patientName}</span>
                    </div>
                    <StarRating value={review.rating} />
                    <p className="text-sm text-foreground mt-1">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleDelete(review.id)}>
                    <Trash2 className="h-4 w-4" />
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

export default AdminReviews;
