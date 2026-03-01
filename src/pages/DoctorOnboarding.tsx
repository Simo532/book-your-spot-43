import Navbar from '@/components/Navbar';
import DoctorOnboardingForm from '@/components/onboarding/DoctorOnboardingForm';

const DoctorOnboarding = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DoctorOnboardingForm onComplete={(data) => console.log('Doctor onboarding complete:', data)} />
      </div>
    </div>
  );
};

export default DoctorOnboarding;
