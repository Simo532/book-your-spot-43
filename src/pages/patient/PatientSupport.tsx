import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LifeBuoy, Send, Plus, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PatientLayout from '@/components/PatientLayout';

const initialTickets = [
  { id: 'T-1001', subject: 'Problème de paiement', message: 'Je n\'arrive pas à payer en ligne.', status: 'open', date: '2026-02-28', reply: null },
  { id: 'T-1002', subject: 'Annulation de rendez-vous', message: 'Mon rendez-vous n\'a pas été annulé.', status: 'resolved', date: '2026-02-25', reply: 'Votre rendez-vous a bien été annulé. Désolé pour le désagrément.' },
];

const PatientSupport = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState(initialTickets);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCreate = () => {
    const newTicket = {
      id: `T-${1000 + tickets.length + 1}`,
      subject,
      message,
      status: 'open' as const,
      date: new Date().toISOString().slice(0, 10),
      reply: null,
    };
    setTickets([newTicket, ...tickets]);
    setSubject('');
    setMessage('');
    setOpen(false);
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
                <Button onClick={handleCreate} className="w-full gap-2" disabled={!subject || !message}>
                  <Send className="h-4 w-4" />
                  {t('patient.support.send')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {tickets.map(ticket => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    {ticket.status === 'open' ? <Clock className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{ticket.id}</span>
                      <Badge variant={ticket.status === 'open' ? 'secondary' : 'default'}>
                        {t(`patient.support.status_${ticket.status}`)}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ticket.message}</p>
                    {ticket.reply && (
                      <div className="mt-3 p-3 rounded-lg bg-accent/50 border border-border">
                        <p className="text-xs font-medium text-primary mb-1">Superdoc</p>
                        <p className="text-xs text-muted-foreground">{ticket.reply}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2">{ticket.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientSupport;
