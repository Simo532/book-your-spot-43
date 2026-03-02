import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import DoctorLayout from '@/components/DoctorLayout';
import AvailabilityManager from '@/components/doctor/AvailabilityManager';

const DoctorAvailability = () => {
  const { t } = useTranslation();

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            {t('doctor.availability.title')}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.availability.subtitle')}</p>
        </div>
        <AvailabilityManager />
      </div>
    </DoctorLayout>
  );
};

export default DoctorAvailability;
