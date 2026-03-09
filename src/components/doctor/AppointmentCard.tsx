import { formatTime, formatDate, formatDateTime } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Phone, Clock, Calendar as CalendarIcon, Globe, MapPin, CheckCircle, XCircle, Quote, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppointmentResponseDTO } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: AppointmentResponseDTO;
  onAccept: () => void;
  onDecline: () => void;
  onJoinZoom: () => void;
}

const AppointmentCard = ({ appointment: apt, onAccept, onDecline, onJoinZoom }: AppointmentCardProps) => {
  const { t } = useTranslation();
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const aptTime = apt.appointmentDate ? formatTime(apt.appointmentDate) : 'ASAP';
  const aptDate = apt.appointmentDate ? formatDate(apt.appointmentDate) : '-';

  return (
    <Card className="overflow-hidden border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarImage src={apt.patientImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{getInitials(apt.patientName)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm">{apt.patientName}</h3>
              <span className="text-primary font-bold text-lg">{apt.consultationFee} DA</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Phone className="h-3 w-3" /><span>{apt.patientTel}</span>
              <span>- {apt.patientAge} {t('doctor.appointments.years')}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{aptTime}</span></div>
              <div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /><span>{aptDate}</span></div>
              {apt.online && <Badge variant="outline" className="text-[10px] h-5 gap-1"><Globe className="h-2.5 w-2.5" />{t('doctor.appointments.filters.online')}</Badge>}
            </div>
          </div>
        </div>
        {apt.patientMessage && (
          <div className="mt-3 relative pl-4 pr-2">
            <Quote className="absolute left-0 top-0 h-4 w-4 text-primary/30" />
            <p className="text-xs text-muted-foreground italic leading-relaxed">{apt.patientMessage}</p>
          </div>
        )}
        <div className="mt-3 text-[11px] text-primary space-y-0.5">
          <p>{t('doctor.appointments.requested_at')} {formatDateTime(apt.createdAt)}</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {apt.online && ['CONFIRMED', 'PAID'].includes(apt.status) && (
            <Button size="sm" className="gap-1.5 h-9" variant="default" onClick={onJoinZoom}>
              <Video className="h-3.5 w-3.5" />{t('zoom.join', 'Rejoindre la session')}
            </Button>
          )}
          {apt.status === 'COMPLETED' && <div className="flex items-center gap-1.5 text-emerald-600"><CheckCircle className="h-5 w-5" /><span className="text-sm font-medium">{t('doctor.appointments.status.completed')}</span></div>}
          {apt.status === 'CANCELLED' && <div className="flex items-center gap-1.5 text-destructive"><XCircle className="h-5 w-5" /><span className="text-sm font-medium">{t('doctor.appointments.status.cancelled')}</span></div>}
          {apt.status === 'CONFIRMED' && !apt.online && <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{t('doctor.appointments.status.confirmed')}</Badge>}
          {apt.status === 'PAID' && !apt.online && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">{t('doctor.appointments.status.paid')}</Badge>}
          {apt.status === 'PENDING' && (
            <div className="flex gap-2 w-full">
              <Button size="sm" className="flex-1 h-9" onClick={onAccept}>{t('doctor.appointments.accept')}</Button>
              <Button size="sm" variant="outline" className="flex-1 h-9" onClick={onDecline}>{t('doctor.appointments.decline')}</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
