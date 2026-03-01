import Navbar from '@/components/Navbar';
import PatientOnboardingForm from '@/components/onboarding/PatientOnboardingForm';

const PatientOnboarding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <PatientOnboardingForm onComplete={(data) => console.log('Patient onboarding complete:', data)} />
      </div>
    </div>
  );
};

export default PatientOnboarding;
