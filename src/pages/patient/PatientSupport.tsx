import { useState } from 'react';
import { formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, Send, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ShimmerListItem } from '@/components/ui/shimmer';
import PatientLayout from '@/components/PatientLayout';
import { tokenStorage } from '@/services/api';
import { useAllSupportMessages, useCreateSupportMessage } from '@/hooks/useSupportHooks';

const PatientSupport = () => {
  const { t } = useTranslation();
  const userName = (() => { const f = tokenStorage.getUserFirstName(); const l = tokenStorage.getUserLastName(); return f && l ? `${f} ${l}` : null; })();
  const userEmail = tokenStorage.getUserEmail();
  const { data: supportData, isLoading } = useAllSupportMessages(0, 50);
  const createMutation = useCreateSupportMessage();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const tickets = supportData?.content || [];

  const handleCreate = () => {
    createMutation.mutate({
      fullName: userName || '',
      email: userEmail || '',
      objet: subject,
      message,
      treated: false,
    }, {
      onSuccess: () => {
        setSubject('');
        setMessage('');
        setOpen(false);
      },
    });
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LifeBuoy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('patient.support.title')}</h1>
              <p className="text-sm text-muted-foreground">{t('patient.support.subtitle')}</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />{t('patient.support.new_ticket')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('patient.support.new_ticket')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>{t('patient.support.subject')}</Label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder={t('patient.support.subject_placeholder')} />
                </div>
                <div className="space-y-2">
                  <Label>{t('patient.support.message')}</Label>
                  <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('patient.support.message_placeholder')} rows={4} />
                </div>
                <Button onClick={handleCreate} className="w-full gap-2" disabled={!subject || !message || createMutation.isPending}>
                  <Send className="h-4 w-4" />
                  {t('patient.support.send')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <ShimmerListItem key={i} />)}</div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                      {ticket.treated ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Clock className="h-4 w-4 text-amber-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={ticket.treated ? 'default' : 'secondary'}>
                          {ticket.treated ? t('patient.support.status_resolved') : t('patient.support.status_open')}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold">{ticket.objet}</p>
                      <p className="text-xs text-muted-foreground mt-1">{ticket.message}</p>
                      {ticket.createdAt && (
                        <p className="text-[10px] text-muted-foreground mt-2">{formatDate(ticket.createdAt)}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {tickets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">{t('patient.support.no_tickets')}</div>
            )}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default PatientSupport;
