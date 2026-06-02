import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Onboarding
import SplashScreen from './pages/onboarding/SplashScreen';
import WelcomeScreen from './pages/onboarding/WelcomeScreen';
import AppIntroScreen from './pages/onboarding/AppIntroScreen';

// Auth
import LoginScreen from './pages/auth/LoginScreen';
import SignupScreen from './pages/auth/SignupScreen';
import ForgotPasswordScreen from './pages/auth/ForgotPasswordScreen';
import OTPScreen from './pages/auth/OTPScreen';
import ResetPasswordScreen from './pages/auth/ResetPasswordScreen';

// Profile Setup
import SkinTypeScreen from './pages/setup/SkinTypeScreen';
import AllergyScreen from './pages/setup/AllergyScreen';
import MedicationScreen from './pages/setup/MedicationScreen';
import HealthConditionsScreen from './pages/setup/HealthConditionsScreen';
import PeriodSyncScreen from './pages/setup/PeriodSyncScreen';
import ProfileSetupLoading from './pages/setup/ProfileSetupLoading';

// Dashboard
import DashboardScreen from './pages/dashboard/DashboardScreen';

// Scanner
import ScannerScreen from './pages/scanner/ScannerScreen';
import ScanResultScreen from './pages/scanner/ScanResultScreen';
import IngredientBreakdownScreen from './pages/scanner/IngredientBreakdownScreen';
import IngredientDeepDiveScreen from './pages/scanner/IngredientDeepDiveScreen';
import AllergyWarningScreen from './pages/scanner/AllergyWarningScreen';
import ChemicalConflictScreen from './pages/scanner/ChemicalConflictScreen';
import SafeAlternativesScreen from './pages/scanner/SafeAlternativesScreen';
import ProductComparisonScreen from './pages/scanner/ProductComparisonScreen';
import ScanHistoryScreen from './pages/scanner/ScanHistoryScreen';

// CareBot
import CareBotScreen from './pages/carebot/CareBotScreen';
import RoutineBuilderScreen from './pages/carebot/RoutineBuilderScreen';

// Skin Journey
import SkinJourneyScreen from './pages/journey/SkinJourneyScreen';
import SkinProgressScreen from './pages/journey/SkinProgressScreen';
import HydrationTrackerScreen from './pages/journey/HydrationTrackerScreen';
import GlowScoreScreen from './pages/journey/GlowScoreScreen';
import AIInsightsScreen from './pages/journey/AIInsightsScreen';
import LogSkinEntryScreen from './pages/journey/LogSkinEntryScreen';

// Cabinet
import CabinetScreen from './pages/cabinet/CabinetScreen';
import AddProductScreen from './pages/cabinet/AddProductScreen';

// Community
import CommunityScreen from './pages/community/CommunityScreen';
import ReportAlertScreen from './pages/community/ReportAlertScreen';

// Settings
import SettingsScreen from './pages/settings/SettingsScreen';
import AccountSettingsScreen from './pages/settings/AccountSettingsScreen';
import NotificationsScreen from './pages/settings/NotificationsScreen';
import PrivacyScreen from './pages/settings/PrivacyScreen';

// Misc
import NotFoundScreen from './pages/misc/NotFoundScreen';
import OfflineScreen from './pages/misc/OfflineScreen';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="centered-page">
      <div className="spinner spinner-lg" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="centered-page">
      <div className="spinner spinner-lg" />
    </div>
  );
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Onboarding */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/intro" element={<AppIntroScreen />} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupScreen /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/otp" element={<OTPScreen />} />
      <Route path="/reset-password" element={<ResetPasswordScreen />} />

      {/* Profile Setup */}
      <Route path="/setup/skin-type" element={<ProtectedRoute><SkinTypeScreen /></ProtectedRoute>} />
      <Route path="/setup/allergies" element={<ProtectedRoute><AllergyScreen /></ProtectedRoute>} />
      <Route path="/setup/medications" element={<ProtectedRoute><MedicationScreen /></ProtectedRoute>} />
      <Route path="/setup/health" element={<ProtectedRoute><HealthConditionsScreen /></ProtectedRoute>} />
      <Route path="/setup/period" element={<ProtectedRoute><PeriodSyncScreen /></ProtectedRoute>} />
      <Route path="/setup/loading" element={<ProtectedRoute><ProfileSetupLoading /></ProtectedRoute>} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />

      {/* Scanner */}
      <Route path="/scan" element={<ProtectedRoute><ScannerScreen /></ProtectedRoute>} />
      <Route path="/scan/result/:id" element={<ProtectedRoute><ScanResultScreen /></ProtectedRoute>} />
      <Route path="/scan/ingredients/:id" element={<ProtectedRoute><IngredientBreakdownScreen /></ProtectedRoute>} />
      <Route path="/scan/ingredient-dive" element={<ProtectedRoute><IngredientDeepDiveScreen /></ProtectedRoute>} />
      <Route path="/scan/allergy-warning/:id" element={<ProtectedRoute><AllergyWarningScreen /></ProtectedRoute>} />
      <Route path="/scan/conflict/:id" element={<ProtectedRoute><ChemicalConflictScreen /></ProtectedRoute>} />
      <Route path="/scan/alternatives" element={<ProtectedRoute><SafeAlternativesScreen /></ProtectedRoute>} />
      <Route path="/scan/compare" element={<ProtectedRoute><ProductComparisonScreen /></ProtectedRoute>} />
      <Route path="/scan/history" element={<ProtectedRoute><ScanHistoryScreen /></ProtectedRoute>} />

      {/* CareBot */}
      <Route path="/carebot" element={<ProtectedRoute><CareBotScreen /></ProtectedRoute>} />
      <Route path="/carebot/routine" element={<ProtectedRoute><RoutineBuilderScreen /></ProtectedRoute>} />

      {/* Skin Journey */}
      <Route path="/journey" element={<ProtectedRoute><SkinJourneyScreen /></ProtectedRoute>} />
      <Route path="/journey/progress" element={<ProtectedRoute><SkinProgressScreen /></ProtectedRoute>} />
      <Route path="/journey/hydration" element={<ProtectedRoute><HydrationTrackerScreen /></ProtectedRoute>} />
      <Route path="/journey/glow-score" element={<ProtectedRoute><GlowScoreScreen /></ProtectedRoute>} />
      <Route path="/journey/insights" element={<ProtectedRoute><AIInsightsScreen /></ProtectedRoute>} />
      <Route path="/journey/log" element={<ProtectedRoute><LogSkinEntryScreen /></ProtectedRoute>} />

      {/* Cabinet */}
      <Route path="/cabinet" element={<ProtectedRoute><CabinetScreen /></ProtectedRoute>} />
      <Route path="/cabinet/add" element={<ProtectedRoute><AddProductScreen /></ProtectedRoute>} />

      {/* Community */}
      <Route path="/community" element={<ProtectedRoute><CommunityScreen /></ProtectedRoute>} />
      <Route path="/community/report" element={<ProtectedRoute><ReportAlertScreen /></ProtectedRoute>} />

      {/* Settings */}
      <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
      <Route path="/settings/account" element={<ProtectedRoute><AccountSettingsScreen /></ProtectedRoute>} />
      <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
      <Route path="/settings/privacy" element={<ProtectedRoute><PrivacyScreen /></ProtectedRoute>} />

      {/* Misc */}
      <Route path="/offline" element={<OfflineScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'white',
              color: '#1E293B',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#00A86B', secondary: 'white' } },
            error: { iconTheme: { primary: '#EB5757', secondary: 'white' } },
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
