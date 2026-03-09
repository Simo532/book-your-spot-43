import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Search, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShimmerChatItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import PatientLayout from '@/components/PatientLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChatsByPatient, useChatMessages, useSendMessage } from '@/hooks/useApiHooks';
import { SenderType } from '@/types/chatMessage';

const PatientMessages = () => {
  const { t } = useTranslation();
  const { doctorOrPatientId } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const { data: chatsData, isLoading: chatsLoading } = useChatsByPatient(doctorOrPatientId || '', 0, 20);
  const { data: messagesData } = useChatMessages(selectedChatId, 0, 50);
  const sendMessage = useSendMessage();

  const chats = chatsData?.content || [];
  const messages = messagesData?.content || [];

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) setSelectedChatId(chats[0].id);
  }, [chats, selectedChatId]);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const filteredChats = chats.filter(c => (c.doctorFullName || '').toLowerCase().includes(search.toLowerCase()));

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChatId || !doctorOrPatientId) return;
    sendMessage.mutate({
      chatId: selectedChatId,
      senderId: doctorOrPatientId,
      senderType: SenderType.PATIENT,
      content: newMessage,
      contentType: 'TEXT',
    });
    setNewMessage('');
  };

  return (
    <PatientLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('patient.messages.title')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
          <div className="border border-border rounded-xl flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('patient.messages.search')} className="pl-9 h-9" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatsLoading ? (
                Array.from({ length: 3 }).map((_, i) => <ShimmerChatItem key={i} />)
              ) : filteredChats.map(c => (
                <button key={c.id} onClick={() => setSelectedChatId(c.id)}
                  className={cn('w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors border-b border-border', selectedChatId === c.id && 'bg-accent')}>
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={c.doctorImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {(c.doctorFullName || '').split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.doctorFullName}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 border border-border rounded-xl flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedChat.doctorImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {(selectedChat.doctorFullName || '').split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-semibold">{selectedChat.doctorFullName}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {[...messages].reverse().map(m => (
                    <div key={m.id} className={cn('flex', m.senderType === 'PATIENT' ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[70%] px-3 py-2 rounded-xl text-sm', m.senderType === 'PATIENT' ? 'bg-primary text-primary-foreground' : 'bg-accent')}>
                        <p>{m.content}</p>
                        <p className={cn('text-[10px] mt-1', m.senderType === 'PATIENT' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                          {formatTime(m.sentAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border flex gap-2">
                  <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={t('patient.messages.type_message')} className="flex-1" />
                  <Button size="icon" onClick={handleSend} disabled={sendMessage.isPending}><Send className="h-4 w-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                {t('patient.messages.select_conversation') || 'Sélectionnez une conversation'}
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientMessages;
