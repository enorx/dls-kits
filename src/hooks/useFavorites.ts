import { useState, useEffect, useCallback } from 'react';
import type { Kit } from '@/types';

const FAVORITES_KEY = 'dls_kits_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((kitId: string) => {
    setFavorites(prev => {
      if (prev.includes(kitId)) return prev;
      return [...prev, kitId];
    });
  }, []);

  const removeFavorite = useCallback((kitId: string) => {
    setFavorites(prev => prev.filter(id => id !== kitId));
  }, []);

  const toggleFavorite = useCallback((kitId: string) => {
    setFavorites(prev => {
      if (prev.includes(kitId)) {
        return prev.filter(id => id !== kitId);
      }
      return [...prev, kitId];
    });
  }, []);

  const isFavorite = useCallback((kitId: string) => {
    return favorites.includes(kitId);
  }, [favorites]);

  const getFavoriteKits = useCallback((allKits: Kit[]) => {
    return allKits.filter(kit => favorites.includes(kit.id));
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteKits,
    clearFavorites
  };
}

// Export return type
export type UseFavoritesReturn = ReturnType<typeof useFavorites>;
