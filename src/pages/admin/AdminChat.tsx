import { useState } from 'react';
import { formatTime } from '@/lib/dateUtils';
import { useTranslation } from 'react-i18next';
import { Send, Search, Plus, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/components/AdminLayout';

interface Message {
  id: string;
  text: string;
  sender: 'admin' | 'user';
  timestamp: string;
}

interface Conversation {
  id: string;
  userName: string;
  userRole: 'patient' | 'doctor';
  lastMessage: string;
  unread: number;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    userName: 'Sara Alaoui',
    userRole: 'patient',
    lastMessage: 'Merci pour votre aide !',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Bonjour, bienvenue sur Superdoc ! Comment pouvons-nous vous aider ?', sender: 'admin', timestamp: '10:00' },
      { id: 'm2', text: 'Bonjour, j\'ai une question sur mon rendez-vous', sender: 'user', timestamp: '10:05' },
      { id: 'm3', text: 'Bien sûr, je suis à votre écoute.', sender: 'admin', timestamp: '10:06' },
      { id: 'm4', text: 'Merci pour votre aide !', sender: 'user', timestamp: '10:10' },
    ],
  },
  {
    id: '2',
    userName: 'Dr. Ahmed Benali',
    userRole: 'doctor',
    lastMessage: 'D\'accord, merci.',
    unread: 2,
    messages: [
      { id: 'm1', text: 'Bonjour Dr. Benali, nous avons une mise à jour concernant votre profil.', sender: 'admin', timestamp: '09:00' },
      { id: 'm2', text: 'D\'accord, merci.', sender: 'user', timestamp: '09:15' },
    ],
  },
  {
    id: '3',
    userName: 'Fatima Zahra',
    userRole: 'patient',
    lastMessage: 'Je comprends, merci beaucoup.',
    unread: 1,
    messages: [
      { id: 'm1', text: 'Bonjour Fatima, votre solde a été mis à jour.', sender: 'admin', timestamp: '14:00' },
      { id: 'm2', text: 'Je comprends, merci beaucoup.', sender: 'user', timestamp: '14:20' },
    ],
  },
];

const mockUsers = [
  { id: 'u1', name: 'Sara Alaoui', role: 'patient' },
  { id: 'u2', name: 'Dr. Ahmed Benali', role: 'doctor' },
  { id: 'u3', name: 'Fatima Zahra', role: 'patient' },
  { id: 'u4', name: 'Dr. Youssef Kabir', role: 'doctor' },
  { id: 'u5', name: 'Omar Idrissi', role: 'doctor' },
];

const AdminChat = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatUser, setNewChatUser] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');

  const selected = conversations.find((c) => c.id === selectedId);

  const filteredConversations = conversations.filter((c) =>
    c.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!messageText.trim() || !selectedId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: messageText,
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, text: messageText, sender: 'admin' as const, timestamp: formatTime(new Date()) },
              ],
            }
          : c
      )
    );
    setMessageText('');
  };

  const handleNewChat = () => {
    if (!newChatUser || !newChatMessage.trim()) return;
    const user = mockUsers.find((u) => u.id === newChatUser);
    if (!user) return;
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      userName: user.name,
      userRole: user.role as 'patient' | 'doctor',
      lastMessage: newChatMessage,
      unread: 0,
      messages: [
        { id: `m${Date.now()}`, text: newChatMessage, sender: 'admin', timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedId(newConv.id);
    setNewChatOpen(false);
    setNewChatUser('');
    setNewChatMessage('');
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.chat.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.chat.subtitle')}</p>
          </div>
          <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />{t('admin.chat.new_chat')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('admin.chat.new_chat')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <Select value={newChatUser} onValueChange={setNewChatUser}>
                  <SelectTrigger><SelectValue placeholder={t('admin.chat.select_user')} /></SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.role === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder={t('admin.chat.first_message')}
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                />
                <Button onClick={handleNewChat} className="w-full">{t('admin.chat.start_chat')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
          {/* Conversation list */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('admin.chat.search')} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-border hover:bg-accent/50 ${selectedId === conv.id ? 'bg-accent' : ''}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">{conv.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{conv.userName}</span>
                        {conv.unread > 0 && (
                          <Badge variant="default" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">{conv.unread}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {conv.userRole === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">{conv.lastMessage}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selected ? (
              <>
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">{selected.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{selected.userName}</CardTitle>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {selected.userRole === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {selected.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-accent text-foreground'}`}>
                            {msg.sender === 'admin' && (
                              <span className="text-[10px] opacity-80 block mb-0.5">Superdoc</span>
                            )}
                            <p>{msg.text}</p>
                            <span className={`text-[10px] mt-1 block ${msg.sender === 'admin' ? 'opacity-70' : 'text-muted-foreground'}`}>{msg.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border flex gap-2">
                    <Input
                      placeholder={t('admin.chat.type_message')}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSend}><Send className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>{t('admin.chat.no_selection')}</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChat;
