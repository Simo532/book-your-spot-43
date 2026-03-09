import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, CalendarCheck, MessageSquare, Settings, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShimmerNotification } from '@/components/ui/shimmer';
import DoctorLayout from '@/components/DoctorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationsByDoctor, useDeleteNotification, useMarkNotificationsRead } from '@/hooks/useApiHooks';

const DoctorNotifications = () => {
  const { t } = useTranslation();
  const { doctorOrPatientId } = useAuth();
  const [filter, setFilter] = useState<string>('all');

  const { data: notifsData, isLoading } = useNotificationsByDoctor(doctorOrPatientId || '', 0, 50);
  const deleteNotif = useDeleteNotification();
  const markRead = useMarkNotificationsRead();

  const allNotifs = notifsData?.content || [];
  const filtered = filter === 'all' ? allNotifs : allNotifs.filter(n => n.type.toLowerCase() === filter);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'appointment': return CalendarCheck;
      case 'chat': return MessageSquare;
      case 'system': return Settings;
      default: return Award;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'appointment': return 'bg-primary/10 text-primary';
      case 'chat': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('doctor.notifications.title')}</h1>

        <div className="flex justify-between items-center">
          {allNotifs.filter(n => !n.read).length > 0 && (
            <Button variant="outline" size="sm" onClick={() => markRead.mutate(allNotifs.filter(n => !n.read).map(n => n.id))}>
              {t('doctor.notifications.mark_all_read') || 'Tout marquer comme lu'}
            </Button>
          )}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('doctor.notifications.filter.all')}</SelectItem>
              <SelectItem value="appointment">{t('doctor.notifications.filter.appointment')}</SelectItem>
              <SelectItem value="chat">{t('doctor.notifications.filter.message')}</SelectItem>
              <SelectItem value="system">{t('doctor.notifications.filter.system')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
          ) : filtered.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground">{t('doctor.notifications.empty')}</CardContent></Card>
          ) : (
            filtered.map((notif) => {
              const Icon = getTypeIcon(notif.type);
              return (
                <Card key={notif.id} className={`overflow-hidden ${!notif.read ? 'border-l-4 border-l-primary' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className={getTypeBadgeColor(notif.type)}>
                        {t(`doctor.notifications.filter.${notif.type.toLowerCase() === 'chat' ? 'message' : notif.type.toLowerCase()}`)}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteNotif.mutate(notif.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-primary text-sm mb-1">{notif.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                    <p className="text-[11px] text-primary mt-2 text-right">{new Date(notif.createdAt).toLocaleString('fr')}</p>
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
