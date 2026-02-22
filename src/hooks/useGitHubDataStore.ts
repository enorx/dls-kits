import { useState, useEffect, useCallback, useRef } from 'react';
import type { DataStore, League, Club, Kit, AppSettings } from '@/types';
import { initialData } from '@/data/initialData';
import {
  fetchDataFromGitHub,
  commitDataToGitHub,
  uploadImage,
  checkWriteAccess,
  githubConfig,
} from '@/services/githubApi';

// Local cache key (for fallback only)
const CACHE_KEY = 'dls_kits_cache';
const CACHE_TIMESTAMP_KEY = 'dls_kits_cache_timestamp';

// Commit state type
export interface CommitState {
  isCommitting: boolean;
  progress: number;
  message: string;
  error: string | null;
}

export function useGitHubDataStore() {
  // Data state
  const [data, setData] = useState<DataStore>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasWriteAccess, setHasWriteAccess] = useState(false);
  
  // Commit state
  const [commitState, setCommitState] = useState<CommitState>({
    isCommitting: false,
    progress: 0,
    message: '',
    error: null,
  });

  // Track pending changes
  const pendingChangesRef = useRef(false);
  const dataRef = useRef(data);
  
  // Keep data ref in sync
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Load data from GitHub on mount
  useEffect(() => {
    loadData();
  }, []);

  // Check GitHub configuration
  const isGitHubConfigured = githubConfig.isConfigured;

  // Load data from GitHub with cache fallback
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    // If GitHub not configured, use initial data
    if (!isGitHubConfigured) {
      console.warn('GitHub not configured, using initial data');
      setData(initialData);
      setIsLoading(false);
      return;
    }

    try {
      // Try to fetch from GitHub
      const githubData = await fetchDataFromGitHub();
      setData(githubData);
      
      // Cache the data locally
      localStorage.setItem(CACHE_KEY, JSON.stringify(githubData));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      // Check write access
      const canWrite = await checkWriteAccess();
      setHasWriteAccess(canWrite);
      
      setLoadError(null);
    } catch (error) {
      console.error('Failed to load from GitHub:', error);
      
      // Try to use cached data
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setData(cachedData);
          setLoadError('Using cached data. GitHub sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } catch {
          setData(initialData);
          setLoadError('Failed to load data from GitHub and cache is invalid');
        }
      } else {
        setData(initialData);
        setLoadError('Failed to load data from GitHub: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [isGitHubConfigured]);

  // Refresh data from GitHub
  const refreshData = useCallback(async () => {
    // Clear cache
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
    await loadData();
  }, [loadData]);

  // Commit changes to GitHub
  const commitChanges = useCallback(async (message: string): Promise<boolean> => {
    if (!isGitHubConfigured) {
      setCommitState(prev => ({
        ...prev,
        error: 'GitHub not configured',
      }));
      return false;
    }

    if (!hasWriteAccess) {
      setCommitState(prev => ({
        ...prev,
        error: 'No write access to repository',
      }));
      return false;
    }

    setCommitState({
      isCommitting: true,
      progress: 10,
      message: 'Preparing commit...',
      error: null,
    });

    try {
      setCommitState(prev => ({ ...prev, progress: 30, message: 'Committing data.json...' }));
      
      await commitDataToGitHub(dataRef.current, message);
      
      setCommitState(prev => ({ ...prev, progress: 80, message: 'Updating cache...' }));
      
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataRef.current));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
      pendingChangesRef.current = false;
      
      setCommitState(prev => ({ ...prev, progress: 100, message: 'Complete!' }));
      
      // Reset after a delay
      setTimeout(() => {
        setCommitState({
          isCommitting: false,
          progress: 0,
          message: '',
          error: null,
        });
      }, 2000);
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCommitState({
        isCommitting: false,
        progress: 0,
        message: '',
        error: errorMessage,
      });
      return false;
    }
  }, [isGitHubConfigured, hasWriteAccess]);

  // Upload image to GitHub
  const uploadImageToGitHub = useCallback(async (
    file: File,
    fileName?: string
  ): Promise<{ url: string; path: string } | null> => {
    if (!isGitHubConfigured) {
      // Fallback: return as data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            path: `data:image/${file.type.split('/')[1]};base64`,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          // Remove data URL prefix
          const base64Content = result.split(',')[1];
          resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const name = fileName || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const result = await uploadImage(
        name,
        base64,
        `Upload image: ${name}`
      );

      return { url: result.url, path: result.path };
    } catch (error) {
      console.error('Failed to upload image:', error);
      
      // Fallback: return as data URL
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result as string,
            path: 'local',
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }, [isGitHubConfigured]);

  // League operations
  const addLeague = useCallback((league: Omit<League, 'id' | 'createdAt'>) => {
    const newLeague: League = {
      ...league,
      id: `league-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      leagues: [...prev.leagues, newLeague],
    }));
    pendingChangesRef.current = true;
    return newLeague;
  }, []);

  const updateLeague = useCallback((id: string, updates: Partial<League>) => {
    setData(prev => ({
      ...prev,
      leagues: prev.leagues.map(l => l.id === id ? { ...l, ...updates } : l),
    }));
    pendingChangesRef.current = true;
  }, []);

  const deleteLeague = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      leagues: prev.leagues.filter(l => l.id !== id),
      clubs: prev.clubs.filter(c => c.leagueId !== id),
      kits: prev.kits.filter(k => {
        const club = prev.clubs.find(c => c.id === k.clubId);
        return club?.leagueId !== id;
      }),
    }));
    pendingChangesRef.current = true;
  }, []);

  // Club operations
  const addClub = useCallback((club: Omit<Club, 'id' | 'createdAt'>) => {
    const newClub: Club = {
      ...club,
      id: `club-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      clubs: [...prev.clubs, newClub],
    }));
    pendingChangesRef.current = true;
    return newClub;
  }, []);

  const updateClub = useCallback((id: string, updates: Partial<Club>) => {
    setData(prev => ({
      ...prev,
      clubs: prev.clubs.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
    pendingChangesRef.current = true;
  }, []);

  const deleteClub = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      clubs: prev.clubs.filter(c => c.id !== id),
      kits: prev.kits.filter(k => k.clubId !== id),
    }));
    pendingChangesRef.current = true;
  }, []);

  // Kit operations
  const addKit = useCallback((kit: Omit<Kit, 'id' | 'createdAt'>) => {
    const newKit: Kit = {
      ...kit,
      id: `kit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setData(prev => ({
      ...prev,
      kits: [...prev.kits, newKit],
    }));
    pendingChangesRef.current = true;
    return newKit;
  }, []);

  const updateKit = useCallback((id: string, updates: Partial<Kit>) => {
    setData(prev => ({
      ...prev,
      kits: prev.kits.map(k => k.id === id ? { ...k, ...updates } : k),
    }));
    pendingChangesRef.current = true;
  }, []);

  const deleteKit = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      kits: prev.kits.filter(k => k.id !== id),
    }));
    pendingChangesRef.current = true;
  }, []);

  // Settings operations
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
    pendingChangesRef.current = true;
  }, []);

  // Getters
  const getLeagueById = useCallback((id: string) => {
    return data.leagues.find(l => l.id === id);
  }, [data.leagues]);

  const getClubById = useCallback((id: string) => {
    return data.clubs.find(c => c.id === id);
  }, [data.clubs]);

  const getKitById = useCallback((id: string) => {
    return data.kits.find(k => k.id === id);
  }, [data.kits]);

  const getClubsByLeague = useCallback((leagueId: string) => {
    return data.clubs.filter(c => c.leagueId === leagueId);
  }, [data.clubs]);

  const getKitsByClub = useCallback((clubId: string) => {
    return data.kits.filter(k => k.clubId === clubId);
  }, [data.kits]);

  const getKitsByLeague = useCallback((leagueId: string) => {
    const clubIds = data.clubs.filter(c => c.leagueId === leagueId).map(c => c.id);
    return data.kits.filter(k => clubIds.includes(k.clubId));
  }, [data.clubs, data.kits]);

  // Export data
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Import data
  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.leagues && parsed.clubs && parsed.kits && parsed.settings) {
        setData(parsed);
        pendingChangesRef.current = true;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Check if there are pending changes
  const hasPendingChanges = pendingChangesRef.current;

  return {
    // Data
    data,
    isLoading,
    loadError,
    
    // GitHub status
    isGitHubConfigured,
    hasWriteAccess,
    
    // Commit state
    commitState,
    hasPendingChanges,
    
    // Actions
    loadData,
    refreshData,
    commitChanges,
    uploadImageToGitHub,
    
    // League operations
    addLeague,
    updateLeague,
    deleteLeague,
    
    // Club operations
    addClub,
    updateClub,
    deleteClub,
    
    // Kit operations
    addKit,
    updateKit,
    deleteKit,
    
    // Settings
    updateSettings,
    
    // Getters
    getLeagueById,
    getClubById,
    getKitById,
    getClubsByLeague,
    getKitsByClub,
    getKitsByLeague,
    
    // Import/Export
    exportData,
    importData,
  };
}

// Export return type
export type UseGitHubDataStoreReturn = ReturnType<typeof useGitHubDataStore>;
