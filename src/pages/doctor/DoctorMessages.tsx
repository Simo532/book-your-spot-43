import { useState, useEffect } from 'react';
import { formatTime, formatDate } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Search, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShimmerChatItem } from '@/components/ui/shimmer';
import { cn } from '@/lib/utils';
import DoctorLayout from '@/components/DoctorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useChatsByDoctor, useChatMessages, useSendMessage } from '@/hooks/useApiHooks';
import { SenderType } from '@/types/chatMessage';

const DoctorMessages = () => {
  const { t } = useTranslation();
  const { doctorOrPatientId } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chatsData, isLoading: chatsLoading } = useChatsByDoctor(doctorOrPatientId || '', 0, 20);
  const { data: messagesData } = useChatMessages(selectedChatId, 0, 50);
  const sendMessage = useSendMessage();

  const chats = chatsData?.content || [];
  const messages = messagesData?.content || [];

  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) setSelectedChatId(chats[0].id);
  }, [chats, selectedChatId]);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const filteredChats = chats.filter(c => (c.patientFullName || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSend = () => {
    if (!newMessage.trim() || !selectedChatId || !doctorOrPatientId) return;
    sendMessage.mutate({
      chatId: selectedChatId,
      senderId: doctorOrPatientId,
      senderType: SenderType.DOCTOR,
      content: newMessage,
      contentType: 'TEXT',
    });
    setNewMessage('');
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.messages.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.messages.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          <Card className="lg:col-span-1 flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('doctor.messages.search')} className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <ShimmerChatItem key={i} />)
              ) : filteredChats.map((chat) => (
                <button key={chat.id} onClick={() => setSelectedChatId(chat.id)}
                  className={cn('w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors border-b border-border', selectedChatId === chat.id && 'bg-accent')}>
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={chat.patientImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {(chat.patientFullName || '').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm truncate block">{chat.patientFullName}</span>
                    <span className="text-xs text-muted-foreground">{new Date(chat.createdAt).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedChat.patientImage} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {(selectedChat.patientFullName || '').split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm">{selectedChat.patientFullName}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {[...messages].reverse().map((msg) => (
                    <div key={msg.id} className={cn('flex', msg.senderType === 'DOCTOR' ? 'justify-end' : 'justify-start')}>
                      <div className={cn('max-w-[70%] rounded-2xl px-4 py-2.5', msg.senderType === 'DOCTOR' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-accent rounded-bl-md')}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn('text-[10px] mt-1', msg.senderType === 'DOCTOR' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                          {new Date(msg.sentAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border flex gap-2">
                  <Input placeholder={t('doctor.messages.type_message')} value={newMessage} onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()} className="flex-1" />
                  <Button size="icon" onClick={handleSend} disabled={sendMessage.isPending}><Send className="h-4 w-4" /></Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                {t('doctor.messages.select_conversation') || 'Sélectionnez une conversation'}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorMessages;
