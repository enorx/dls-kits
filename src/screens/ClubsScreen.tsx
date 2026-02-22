import type { League, Club } from '@/types';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';

interface ClubsScreenProps {
  league: League;
  clubs: Club[];
  onClubClick: (clubId: string) => void;
  onBack: () => void;
}

export function ClubsScreen({ league, clubs, onClubClick, onBack }: ClubsScreenProps) {
  // Sort clubs alphabetically
  const sortedClubs = [...clubs].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen">
      <Header
        title={league.name}
        subtitle={`${clubs.length} club${clubs.length !== 1 ? 's' : ''}`}
        onBack={onBack}
        showBack
      />
      
      <div className="px-4 py-6">
        {/* League header card */}
        <div className="glass-card p-6 mb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img
              src={league.logo}
              alt={league.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚽</text></svg>';
              }}
            />
          </div>
          <h2 className="text-xl font-bold text-foreground">{league.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a club to view kits
          </p>
        </div>
        
        {/* Clubs Grid */}
        {sortedClubs.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {sortedClubs.map((club) => (
              <button
                key={club.id}
                onClick={() => onClubClick(club.id)}
                className="club-card group"
              >
                {/* Club Badge */}
                <div className="relative w-14 h-14 mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="70">🏟️</text></svg>';
                    }}
                  />
                </div>
                
                {/* Club Name */}
                <span className="text-xs font-medium text-center line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {club.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState type="clubs" />
        )}
      </div>
    </div>
  );
}
