import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PhotoStepProps {
  profilePhoto: string | null;
  onFileUpload: (setter: (v: string | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setProfilePhoto: (v: string | null) => void;
}

const PhotoStep = ({ profilePhoto, onFileUpload, setProfilePhoto }: PhotoStepProps) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <label className="cursor-pointer">
          <Button variant="outline" className="gap-1.5" asChild>
            <span>
              <Upload className="h-4 w-4" />
              {t('onboarding.doctor.upload')}
            </span>
          </Button>
          <input type="file" accept="image/*" className="hidden" onChange={onFileUpload(setProfilePhoto)} />
        </label>
        <p className="text-xs text-destructive font-medium">{t('onboarding.doctor.photo_required')}</p>
      </div>
    </div>
  );
};

export default PhotoStep;
