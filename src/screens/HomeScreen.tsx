import type { League } from '@/types';
import { Header } from '@/components/Header';

interface HomeScreenProps {
  leagues: League[];
  onLeagueClick: (leagueId: string) => void;
}

export function HomeScreen({ leagues, onLeagueClick }: HomeScreenProps) {
  // Sort leagues by order
  const sortedLeagues = [...leagues].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen">
      <Header 
        title="DLS KITS" 
        subtitle="Select a league to browse kits"
      />
      
      <div className="px-4 py-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-gradient">Football Kits</span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Browse and download Dream League Soccer kits from top leagues
          </p>
        </div>
        
        {/* Leagues Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sortedLeagues.map((league) => (
            <button
              key={league.id}
              onClick={() => onLeagueClick(league.id)}
              className="league-card group"
            >
              {/* League Logo */}
              <div className="relative w-16 h-16 mb-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={league.logo}
                  alt={league.name}
                  className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚽</text></svg>';
                  }}
                />
              </div>
              
              {/* League Name */}
              <span className="text-sm font-medium text-center line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {league.name}
              </span>
              
              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 pointer-events-none" />
            </button>
          ))}
        </div>
        
        {/* Empty state */}
        {sortedLeagues.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No leagues available
            </h3>
            <p className="text-sm text-muted-foreground">
              Check back later for updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
