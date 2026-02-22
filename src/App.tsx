import { useState, useEffect } from 'react';
import type { View } from '@/types';
import { useGitHubDataStore } from '@/hooks/useGitHubDataStore';
import { useFavorites } from '@/hooks/useFavorites';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// Screens
import { HomeScreen } from '@/screens/HomeScreen';
import { ClubsScreen } from '@/screens/ClubsScreen';
import { KitsScreen } from '@/screens/KitsScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { FavoritesScreen } from '@/screens/FavoritesScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { AdminDashboard } from '@/screens/AdminDashboard';
import { AdminLogin } from '@/screens/AdminLogin';
import { LoadingScreen } from '@/screens/LoadingScreen';

// Components
import { BottomNav } from '@/components/BottomNav';
import { Toast } from '@/components/Toast';

// Toast context
import { createContext, useContext } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  
  const dataStore = useGitHubDataStore();
  const favorites = useFavorites();
  const adminAuth = useAdminAuth();

  // Check URL for admin access on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('key');
    
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/admin')) {
      setIsAdminRoute(true);
      if (adminAuth.validateSecretKey(adminKey)) {
        setCurrentView('admin');
      } else {
        // Invalid key - redirect to home
        window.history.replaceState({}, '', '/');
        setIsAdminRoute(false);
        setCurrentView('home');
      }
    }
  }, [adminAuth]);

  // Show toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Navigation handlers
  const navigateToLeague = (leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setCurrentView('clubs');
  };

  const navigateToClub = (clubId: string) => {
    setSelectedClubId(clubId);
    setCurrentView('kits');
  };

  const navigateBack = () => {
    if (currentView === 'kits') {
      setSelectedClubId(null);
      setCurrentView('clubs');
    } else if (currentView === 'clubs') {
      setSelectedLeagueId(null);
      setCurrentView('home');
    }
  };

  const handleNavChange = (view: View) => {
    if (view !== 'admin') {
      setCurrentView(view);
    }
  };

  // Show loading screen while data is loading
  if (dataStore.isLoading && !isAdminRoute) {
    return <LoadingScreen error={dataStore.loadError} onRetry={dataStore.refreshData} />;
  }

  // Render current screen
  const renderScreen = () => {
    if (isAdminRoute && currentView === 'admin') {
      if (!adminAuth.isAuthenticated) {
        return (
          <AdminLogin 
            onLogin={adminAuth.login} 
            onCancel={() => {
              window.history.replaceState({}, '', '/');
              setIsAdminRoute(false);
              setCurrentView('home');
            }}
          />
        );
      }
      return (
        <AdminDashboard 
          dataStore={dataStore}
          onLogout={() => {
            adminAuth.logout();
            window.history.replaceState({}, '', '/');
            setIsAdminRoute(false);
            setCurrentView('home');
          }}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomeScreen 
            leagues={dataStore.data.leagues}
            onLeagueClick={navigateToLeague}
          />
        );
      
      case 'clubs':
        if (!selectedLeagueId) return null;
        const league = dataStore.getLeagueById(selectedLeagueId);
        const clubs = dataStore.getClubsByLeague(selectedLeagueId);
        return (
          <ClubsScreen
            league={league!}
            clubs={clubs}
            onClubClick={navigateToClub}
            onBack={navigateBack}
          />
        );
      
      case 'kits':
        if (!selectedClubId) return null;
        const club = dataStore.getClubById(selectedClubId);
        const kits = dataStore.getKitsByClub(selectedClubId);
        return (
          <KitsScreen
            club={club!}
            kits={kits}
            favorites={favorites}
            onBack={navigateBack}
            showToast={showToast}
          />
        );
      
      case 'search':
        return (
          <SearchScreen
            leagues={dataStore.data.leagues}
            clubs={dataStore.data.clubs}
            kits={dataStore.data.kits}
            favorites={favorites}
            onLeagueClick={navigateToLeague}
            onClubClick={navigateToClub}
            showToast={showToast}
          />
        );
      
      case 'favorites':
        return (
          <FavoritesScreen
            kits={dataStore.data.kits}
            clubs={dataStore.data.clubs}
            favorites={favorites}
            showToast={showToast}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            settings={dataStore.data.settings}
            isGitHubConfigured={dataStore.isGitHubConfigured}
            hasWriteAccess={dataStore.hasWriteAccess}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-background">
        {/* Main content */}
        <main className={`${!isAdminRoute ? 'pb-24' : ''} pt-safe min-h-screen`}>
          {renderScreen()}
        </main>

        {/* Bottom Navigation - hidden on admin route */}
        {!isAdminRoute && (
          <BottomNav 
            currentView={currentView} 
            onNavChange={handleNavChange}
          />
        )}

        {/* Toast notification */}
        {toastMessage && <Toast message={toastMessage} />}
      </div>
    </ToastContext.Provider>
  );
}

export default App;
