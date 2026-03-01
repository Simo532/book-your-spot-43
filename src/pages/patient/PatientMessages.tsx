import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import PatientLayout from '@/components/PatientLayout';

const conversations = [
  { id: 1, name: 'Dr. Ahmed Benali', lastMessage: 'D\'accord, à lundi alors.', time: '14:30', unread: 2 },
  { id: 2, name: 'Dr. Amina Khelifi', lastMessage: 'Les résultats sont bons.', time: 'Hier', unread: 0 },
  { id: 3, name: 'Support Superdoc', lastMessage: 'Votre ticket a été résolu.', time: '25 Fév', unread: 0 },
];

const messages = [
  { id: 1, from: 'doctor', text: 'Bonjour Sara, comment allez-vous ?', time: '14:00' },
  { id: 2, from: 'patient', text: 'Bonjour docteur, je vais bien merci. Je voulais confirmer mon rendez-vous de lundi.', time: '14:15' },
  { id: 3, from: 'doctor', text: 'D\'accord, à lundi alors.', time: '14:30' },
];

const PatientMessages = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(conversations[0]);
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  return (
    <PatientLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('patient.messages.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
          {/* List */}
          <div className="border border-border rounded-xl flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.messages.search')} className="pl-9 h-9" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                <button key={c.id} onClick={() => setSelected(c)} className={cn('w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors border-b border-border', selected?.id === c.id && 'bg-accent')}>
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">{c.name}</p>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 border border-border rounded-xl flex flex-col">
            <div className="p-4 border-b border-border flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{selected.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold">{selected.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={cn('flex', m.from === 'patient' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[70%] px-3 py-2 rounded-xl text-sm', m.from === 'patient' ? 'bg-primary text-primary-foreground' : 'bg-accent')}>
                    <p>{m.text}</p>
                    <p className={cn('text-[10px] mt-1', m.from === 'patient' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder={t('patient.messages.type_message')} className="flex-1" />
              <Button size="icon"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientMessages;
