import type { Kit, Club } from '@/types';
import { Header } from '@/components/Header';
import { KitCard } from '@/components/KitCard';
import { EmptyState } from '@/components/EmptyState';
import type { UseFavoritesReturn } from '@/hooks/useFavorites';
import { Trash2 } from 'lucide-react';

interface FavoritesScreenProps {
  kits: Kit[];
  clubs: Club[];
  favorites: UseFavoritesReturn;
  showToast: (message: string) => void;
}

export function FavoritesScreen({ kits, clubs, favorites, showToast }: FavoritesScreenProps) {
  const favoriteKits = favorites.getFavoriteKits(kits);

  const handleCopy = () => {
    showToast('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen">
      <Header 
        title="Favorites" 
        subtitle={`${favoriteKits.length} saved kit${favoriteKits.length !== 1 ? 's' : ''}`}
      />
      
      <div className="px-4 py-6">
        {/* Clear all button */}
        {favoriteKits.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                if (confirm('Clear all favorites?')) {
                  favorites.clearFavorites();
                  showToast('All favorites cleared');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}
        
        {/* Favorites List */}
        {favoriteKits.length > 0 ? (
          <div className="space-y-4">
            {favoriteKits.map((kit) => {
              const club = clubs.find(c => c.id === kit.clubId);
              return (
                <KitCard
                  key={kit.id}
                  kit={kit}
                  club={club}
                  isFavorite={true}
                  onToggleFavorite={() => {
                    favorites.removeFavorite(kit.id);
                    showToast('Removed from favorites');
                  }}
                  onCopy={handleCopy}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState type="favorites" />
        )}
      </div>
    </div>
  );
}
