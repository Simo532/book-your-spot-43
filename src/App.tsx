import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorOnboarding from "./pages/DoctorOnboarding";
import PatientOnboarding from "./pages/PatientOnboarding";
import DoctorDetails from "./pages/DoctorDetails";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSpecialties from "./pages/admin/AdminSpecialties";
import AdminBadges from "./pages/admin/AdminBadges";
import AdminChat from "./pages/admin/AdminChat";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminBalances from "./pages/admin/AdminBalances";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminBoosts from "./pages/admin/AdminBoosts";
import AdminXPRules from "./pages/admin/AdminXPRules";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorMessages from "./pages/doctor/DoctorMessages";
import DoctorReviews from "./pages/doctor/DoctorReviews";
import DoctorAnalytics from "./pages/doctor/DoctorAnalytics";
import DoctorBadges from "./pages/doctor/DoctorBadges";
import DoctorBoosts from "./pages/doctor/DoctorBoosts";
import DoctorXpPoints from "./pages/doctor/DoctorXpPoints";
import DoctorAvailability from "./pages/doctor/DoctorAvailability";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorSettings from "./pages/doctor/DoctorSettings";
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientMessages from "./pages/patient/PatientMessages";
import PatientFavorites from "./pages/patient/PatientFavorites";
import PatientSupport from "./pages/patient/PatientSupport";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientPassword from "./pages/patient/PatientPassword";
import NotFound from "./pages/NotFound";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
          <Route path="/doctor/details/:id" element={<DoctorDetails />} />
          <Route path="/patient/onboarding" element={<PatientOnboarding />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/specialties" element={<AdminSpecialties />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/chat" element={<AdminChat />} />
          <Route path="/admin/support" element={<AdminSupport />} />
          <Route path="/admin/balances" element={<AdminBalances />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/boosts" element={<AdminBoosts />} />
          <Route path="/admin/xp-rules" element={<AdminXPRules />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          <Route path="/doctor/messages" element={<DoctorMessages />} />
          <Route path="/doctor/reviews" element={<DoctorReviews />} />
          <Route path="/doctor/analytics" element={<DoctorAnalytics />} />
          <Route path="/doctor/badges" element={<DoctorBadges />} />
          <Route path="/doctor/boosts" element={<DoctorBoosts />} />
          <Route path="/doctor/xp-points" element={<DoctorXpPoints />} />
          <Route path="/doctor/availability" element={<DoctorAvailability />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/settings" element={<DoctorSettings />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<PatientAppointments />} />
          <Route path="/patient/messages" element={<PatientMessages />} />
          <Route path="/patient/favorites" element={<PatientFavorites />} />
          <Route path="/patient/support" element={<PatientSupport />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/password" element={<PatientPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
