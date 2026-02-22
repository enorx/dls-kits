import type { Club, Kit } from '@/types';
import { Header } from '@/components/Header';
import { KitCard } from '@/components/KitCard';
import { EmptyState } from '@/components/EmptyState';
import type { UseFavoritesReturn } from '@/hooks/useFavorites';

interface KitsScreenProps {
  club: Club;
  kits: Kit[];
  favorites: UseFavoritesReturn;
  onBack: () => void;
  showToast: (message: string) => void;
}

export function KitsScreen({ club, kits, favorites, onBack, showToast }: KitsScreenProps) {
  // Sort kits by type order: Home, Away, Third, GK, Logo
  const typeOrder = ['Home', 'Away', 'Third', 'GK', 'Logo'];
  const sortedKits = [...kits].sort((a, b) => {
    const aIndex = typeOrder.indexOf(a.type);
    const bIndex = typeOrder.indexOf(b.type);
    return aIndex - bIndex;
  });

  const handleCopy = () => {
    showToast('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen">
      <Header
        title={club.name}
        subtitle={`${kits.length} kit${kits.length !== 1 ? 's' : ''}`}
        onBack={onBack}
        showBack
      />
      
      <div className="px-4 py-6">
        {/* Club header card */}
        <div className="glass-card p-5 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-secondary rounded-xl">
            <img
              src={club.logo}
              alt={club.name}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="70">🏟️</text></svg>';
              }}
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{club.name}</h2>
            <p className="text-sm text-muted-foreground">
              {kits.length} kit{kits.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
        
        {/* Kits List */}
        {sortedKits.length > 0 ? (
          <div className="space-y-4">
            {sortedKits.map((kit) => (
              <KitCard
                key={kit.id}
                kit={kit}
                isFavorite={favorites.isFavorite(kit.id)}
                onToggleFavorite={() => {
                  favorites.toggleFavorite(kit.id);
                  if (!favorites.isFavorite(kit.id)) {
                    showToast('Added to favorites!');
                  }
                }}
                onCopy={handleCopy}
              />
            ))}
          </div>
        ) : (
          <EmptyState type="kits" />
        )}
      </div>
    </div>
  );
}
