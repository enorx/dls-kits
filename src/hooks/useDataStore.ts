import { useState, useEffect, useCallback } from 'react';
import type { DataStore, League, Club, Kit, AppSettings } from '@/types';
import { initialData } from '@/data/initialData';

const STORAGE_KEY = 'dls_kits_data';

// Load data from localStorage or use initial data
const loadData = (): DataStore => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  // Save initial data if nothing exists
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

// Save data to localStorage
const saveData = (data: DataStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export function useDataStore() {
  const [data, setData] = useState<DataStore>(loadData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save whenever data changes
  useEffect(() => {
    if (isLoaded) {
      saveData(data);
    }
  }, [data, isLoaded]);

  // League operations
  const addLeague = useCallback((league: Omit<League, 'id' | 'createdAt'>) => {
    const newLeague: League = {
      ...league,
      id: `league-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      leagues: [...prev.leagues, newLeague]
    }));
    return newLeague;
  }, []);

  const updateLeague = useCallback((id: string, updates: Partial<League>) => {
    setData(prev => ({
      ...prev,
      leagues: prev.leagues.map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  }, []);

  const deleteLeague = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      leagues: prev.leagues.filter(l => l.id !== id),
      // Also delete associated clubs and kits
      clubs: prev.clubs.filter(c => c.leagueId !== id),
      kits: prev.kits.filter(k => {
        const club = prev.clubs.find(c => c.id === k.clubId);
        return club?.leagueId !== id;
      })
    }));
  }, []);

  // Club operations
  const addClub = useCallback((club: Omit<Club, 'id' | 'createdAt'>) => {
    const newClub: Club = {
      ...club,
      id: `club-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      clubs: [...prev.clubs, newClub]
    }));
    return newClub;
  }, []);

  const updateClub = useCallback((id: string, updates: Partial<Club>) => {
    setData(prev => ({
      ...prev,
      clubs: prev.clubs.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  }, []);

  const deleteClub = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      clubs: prev.clubs.filter(c => c.id !== id),
      // Also delete associated kits
      kits: prev.kits.filter(k => k.clubId !== id)
    }));
  }, []);

  // Kit operations
  const addKit = useCallback((kit: Omit<Kit, 'id' | 'createdAt'>) => {
    const newKit: Kit = {
      ...kit,
      id: `kit-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      kits: [...prev.kits, newKit]
    }));
    return newKit;
  }, []);

  const updateKit = useCallback((id: string, updates: Partial<Kit>) => {
    setData(prev => ({
      ...prev,
      kits: prev.kits.map(k => k.id === id ? { ...k, ...updates } : k)
    }));
  }, []);

  const deleteKit = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      kits: prev.kits.filter(k => k.id !== id)
    }));
  }, []);

  // Settings operations
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
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

  // Export data as JSON string (for admin download)
  const exportData = useCallback(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  // Import data from JSON string (for admin restore)
  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.leagues && parsed.clubs && parsed.kits && parsed.settings) {
        setData(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return {
    data,
    isLoaded,
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
    importData
  };
}

// Export return type
export type UseDataStoreReturn = ReturnType<typeof useDataStore>;
