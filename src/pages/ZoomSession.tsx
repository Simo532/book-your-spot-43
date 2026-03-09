import { useState, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MessageSquare, Users, Settings, Maximize2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ZoomSession = () => {
  const { appointmentId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleEndCall = useCallback(() => {
    toast.info(t('zoom.call_ended', 'Appel terminé'));
    navigate(-1);
  }, [navigate, t]);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
            <Video className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">{t('zoom.title', 'Consultation en ligne')}</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] h-5 gap-1">
                <Clock className="h-2.5 w-2.5" />
                {t('zoom.placeholder_duration', '00:00')}
              </Badge>
              <span className="text-[10px] text-muted-foreground">ID: {appointmentId?.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 flex relative">
        <div className={cn("flex-1 flex items-center justify-center p-4 transition-all", isChatOpen && "mr-80")}>
          {/* Main video placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-4xl aspect-video bg-muted rounded-2xl border border-border overflow-hidden flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary/15 text-primary text-2xl font-bold">DR</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">{t('zoom.waiting_title', 'En attente de connexion...')}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('zoom.waiting_subtitle', 'La session vidéo démarrera lorsque le Zoom SDK sera intégré')}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {t('zoom.placeholder_badge', 'Placeholder — Zoom SDK à intégrer')}
              </Badge>
            </div>

            {/* Self view (picture-in-picture) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 right-4 w-40 h-28 rounded-xl bg-card border-2 border-border overflow-hidden flex items-center justify-center shadow-lg"
            >
              {isVideoOn ? (
                <div className="text-center">
                  <Avatar className="h-12 w-12 mx-auto">
                    <AvatarFallback className="bg-accent text-accent-foreground text-sm font-bold">ME</AvatarFallback>
                  </Avatar>
                  <p className="text-[10px] text-muted-foreground mt-1">{t('zoom.you', 'Vous')}</p>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="h-6 w-6 text-muted-foreground mx-auto" />
                  <p className="text-[10px] text-muted-foreground mt-1">{t('zoom.camera_off', 'Caméra désactivée')}</p>
                </div>
              )}
            </motion.div>

            {/* Participants count */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-card/80 backdrop-blur rounded-lg px-3 py-1.5 border border-border">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">2 {t('zoom.participants', 'participants')}</span>
            </div>
          </motion.div>
        </div>

        {/* Chat sidebar */}
        {isChatOpen && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border flex flex-col"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t('zoom.chat', 'Chat')}</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsChatOpen(false)}>
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-xs text-muted-foreground text-center">
                {t('zoom.chat_placeholder', 'Le chat sera disponible une fois le Zoom SDK intégré')}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-card border-t border-border px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant={isMuted ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => { setIsMuted(!isMuted); toast.info(isMuted ? t('zoom.unmuted', 'Micro activé') : t('zoom.muted', 'Micro désactivé')); }}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            variant={!isVideoOn ? 'destructive' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => { setIsVideoOn(!isVideoOn); toast.info(isVideoOn ? t('zoom.video_off_toast', 'Caméra désactivée') : t('zoom.video_on_toast', 'Caméra activée')); }}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant={isScreenSharing ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => { setIsScreenSharing(!isScreenSharing); toast.info(isScreenSharing ? t('zoom.share_stopped', 'Partage arrêté') : t('zoom.share_started', 'Partage d\'écran')); }}
          >
            <Monitor className="h-5 w-5" />
          </Button>

          <Button
            variant={isChatOpen ? 'default' : 'outline'}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <div className="w-px h-8 bg-border mx-1" />

          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ZoomSession;
