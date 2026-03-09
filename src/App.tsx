import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UserRole } from "./types/auth";
import AuthGuard from "./components/guards/AuthGuard";
import RoleGuard from "./components/guards/RoleGuard";
import PublicGuard from "./components/guards/PublicGuard";
import "./i18n";

// ─── Lazy-loaded pages ────────────────────────────────────────────
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const DoctorOnboarding = lazy(() => import("./pages/DoctorOnboarding"));
const PatientOnboarding = lazy(() => import("./pages/PatientOnboarding"));
const DoctorDetails = lazy(() => import("./pages/DoctorDetails"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Favorites = lazy(() => import("./pages/Favorites"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSpecialties = lazy(() => import("./pages/admin/AdminSpecialties"));
const AdminBadges = lazy(() => import("./pages/admin/AdminBadges"));
const AdminChat = lazy(() => import("./pages/admin/AdminChat"));
const AdminSupport = lazy(() => import("./pages/admin/AdminSupport"));
const AdminBalances = lazy(() => import("./pages/admin/AdminBalances"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));
const AdminBoosts = lazy(() => import("./pages/admin/AdminBoosts"));
const AdminXPRules = lazy(() => import("./pages/admin/AdminXPRules"));

// Doctor
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const DoctorAppointments = lazy(() => import("./pages/doctor/DoctorAppointments"));
const DoctorMessages = lazy(() => import("./pages/doctor/DoctorMessages"));
const DoctorReviews = lazy(() => import("./pages/doctor/DoctorReviews"));
const DoctorAnalytics = lazy(() => import("./pages/doctor/DoctorAnalytics"));
const DoctorBadges = lazy(() => import("./pages/doctor/DoctorBadges"));
const DoctorBoosts = lazy(() => import("./pages/doctor/DoctorBoosts"));
const DoctorXpPoints = lazy(() => import("./pages/doctor/DoctorXpPoints"));
const DoctorAvailability = lazy(() => import("./pages/doctor/DoctorAvailability"));
const DoctorProfile = lazy(() => import("./pages/doctor/DoctorProfile"));
const DoctorSettings = lazy(() => import("./pages/doctor/DoctorSettings"));
const DoctorNotifications = lazy(() => import("./pages/doctor/DoctorNotifications"));

// Patient
const PatientDashboard = lazy(() => import("./pages/patient/PatientDashboard"));
const PatientAppointments = lazy(() => import("./pages/patient/PatientAppointments"));
const PatientMessages = lazy(() => import("./pages/patient/PatientMessages"));
const PatientFavorites = lazy(() => import("./pages/patient/PatientFavorites"));
const PatientSupport = lazy(() => import("./pages/patient/PatientSupport"));
const PatientProfile = lazy(() => import("./pages/patient/PatientProfile"));
const PatientPassword = lazy(() => import("./pages/patient/PatientPassword"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* ─── Public routes ─────────────────────────────── */}
              <Route path="/" element={<Index />} />
              <Route path="/doctor/details/:id" element={<DoctorDetails />} />
              <Route path="/search" element={<SearchResults />} />

              {/* ─── Guest-only routes (redirect if logged in) ── */}
              <Route element={<PublicGuard />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* ─── Authenticated routes ─────────────────────── */}
              <Route element={<AuthGuard />}>
                <Route path="/doctor/onboarding" element={<DoctorOnboarding />} />
                <Route path="/patient/onboarding" element={<PatientOnboarding />} />
                <Route path="/favorites" element={<Favorites />} />
              </Route>

              {/* ─── Admin routes ─────────────────────────────── */}
              <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN]} />}>
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
              </Route>

              {/* ─── Doctor routes ────────────────────────────── */}
              <Route element={<RoleGuard allowedRoles={[UserRole.DOCTOR]} />}>
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
                <Route path="/doctor/notifications" element={<DoctorNotifications />} />
              </Route>

              {/* ─── Patient routes ───────────────────────────── */}
              <Route element={<RoleGuard allowedRoles={[UserRole.PATIENT]} />}>
                <Route path="/patient" element={<PatientDashboard />} />
                <Route path="/patient/appointments" element={<PatientAppointments />} />
                <Route path="/patient/messages" element={<PatientMessages />} />
                <Route path="/patient/favorites" element={<PatientFavorites />} />
                <Route path="/patient/support" element={<PatientSupport />} />
                <Route path="/patient/profile" element={<PatientProfile />} />
                <Route path="/patient/password" element={<PatientPassword />} />
              </Route>

              {/* ─── Catch-all ────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
