import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';

const conversations = [
  { id: 1, name: 'Amina Khelifi', lastMsg: 'Merci docteur pour le rendez-vous.', time: '10:30', unread: 2 },
  { id: 2, name: 'Youcef Hadj', lastMsg: 'Est-ce que je peux avancer le rendez-vous ?', time: '09:15', unread: 0 },
  { id: 3, name: 'Sara Boumediene', lastMsg: 'D\'accord, à demain.', time: 'Hier', unread: 1 },
  { id: 4, name: 'Karim Mesli', lastMsg: 'J\'ai envoyé les résultats d\'analyse.', time: 'Hier', unread: 0 },
];

const messages = [
  { id: 1, sender: 'patient', text: 'Bonjour docteur, est-ce que je peux avancer mon rendez-vous de demain ?', time: '09:10' },
  { id: 2, sender: 'doctor', text: 'Bonjour, oui bien sûr. Quel créneau vous conviendrait ?', time: '09:12' },
  { id: 3, sender: 'patient', text: 'Est-ce que 14h serait possible ?', time: '09:13' },
  { id: 4, sender: 'doctor', text: 'Parfait, je vous mets à 14h. À demain !', time: '09:15' },
];

const DoctorMessages = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.messages.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.messages.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          {/* Conversation list */}
          <Card className="lg:col-span-1 flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('doctor.messages.search')} className="pl-9" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors border-b border-border',
                    selected === conv.id && 'bg-accent'
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {conv.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Messages area */}
          <Card className="lg:col-span-2 flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AK</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">
                  {conversations.find(c => c.id === selected)?.name}
                </p>
                <p className="text-xs text-muted-foreground">{t('doctor.messages.online')}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender === 'doctor' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2.5',
                      msg.sender === 'doctor'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-accent rounded-bl-md'
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn(
                      'text-[10px] mt-1',
                      msg.sender === 'doctor' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-border flex gap-2">
              <Input
                placeholder={t('doctor.messages.type_message')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorMessages;
