import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, CalendarCheck, MessageSquare, Settings, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DoctorLayout from '@/components/DoctorLayout';

const notifTypes = ['all', 'appointment', 'message', 'system'] as const;
type NotifType = typeof notifTypes[number];

interface Notification {
  id: number;
  type: 'appointment' | 'message' | 'system';
  title: string;
  body: string;
  time: string;
  date: string;
}

const mockNotifications: Notification[] = [
  { id: 1, type: 'system', title: '🎉 Nouveau badge débloqué', body: 'Félicitations ! Vous avez débloqué le badge : Confirmé', time: '23:50', date: '16-01-2026' },
  { id: 2, type: 'appointment', title: 'Rendez-vous terminé', body: 'Le rendez-vous avec Amina Khelifi a été marqué comme terminé.', time: '23:50', date: '16-01-2026' },
  { id: 3, type: 'appointment', title: 'Rendez-vous terminé', body: 'Le rendez-vous avec Youcef Hadj a été marqué comme terminé.', time: '23:50', date: '16-01-2026' },
  { id: 4, type: 'appointment', title: 'Paiement de Consultation', body: 'Le paiement pour la consultation avec Sara Boumediene a été effectué.', time: '23:48', date: '16-01-2026' },
  { id: 5, type: 'message', title: 'Nouveau message', body: 'Karim Mesli vous a envoyé un message.', time: '22:30', date: '16-01-2026' },
  { id: 6, type: 'system', title: 'Mise à jour du profil', body: 'Votre profil a été vérifié et approuvé par l\'équipe Superdoc.', time: '18:00', date: '15-01-2026' },
];

const DoctorNotifications = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<NotifType>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return CalendarCheck;
      case 'message': return MessageSquare;
      case 'system': return Settings;
      default: return Award;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-primary/10 text-primary';
      case 'message': return 'bg-emerald-100 text-emerald-700';
      case 'system': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('doctor.notifications.title')}</h1>

        {/* Filter */}
        <div className="flex justify-end">
          <Select value={filter} onValueChange={(v) => setFilter(v as NotifType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('doctor.notifications.filter.all')}</SelectItem>
              <SelectItem value="appointment">{t('doctor.notifications.filter.appointment')}</SelectItem>
              <SelectItem value="message">{t('doctor.notifications.filter.message')}</SelectItem>
              <SelectItem value="system">{t('doctor.notifications.filter.system')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notification cards */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                {t('doctor.notifications.empty')}
              </CardContent>
            </Card>
          ) : (
            filtered.map((notif) => {
              const Icon = getTypeIcon(notif.type);
              return (
                <Card key={notif.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Type badge */}
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className={getTypeBadgeColor(notif.type)}>
                        {t(`doctor.notifications.filter.${notif.type}`)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {/* Title */}
                    <h3 className="font-semibold text-primary text-sm mb-1">{notif.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{notif.body}</p>
                    {/* Time */}
                    <p className="text-[11px] text-primary mt-2 text-right">{notif.time}  {notif.date}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorNotifications;
