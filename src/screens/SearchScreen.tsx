import { useState, useMemo } from 'react';
import type { League, Club, Kit } from '@/types';
import { Header } from '@/components/Header';
import { KitCard } from '@/components/KitCard';
import { Search, X } from 'lucide-react';
import type { UseFavoritesReturn } from '@/hooks/useFavorites';

interface SearchScreenProps {
  leagues: League[];
  clubs: Club[];
  kits: Kit[];
  favorites: UseFavoritesReturn;
  onLeagueClick: (leagueId: string) => void;
  onClubClick: (clubId: string) => void;
  showToast: (message: string) => void;
}

export function SearchScreen({ 
  leagues, 
  clubs, 
  kits, 
  favorites, 
  onLeagueClick, 
  onClubClick,
  showToast 
}: SearchScreenProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'kits' | 'clubs' | 'leagues'>('all');

  // Filter results based on query
  const results = useMemo(() => {
    if (!query.trim()) {
      return { kits: [], clubs: [], leagues: [] };
    }

    const lowerQuery = query.toLowerCase();

    const filteredKits = kits.filter(kit => 
      kit.name.toLowerCase().includes(lowerQuery) ||
      kit.type.toLowerCase().includes(lowerQuery)
    );

    const filteredClubs = clubs.filter(club =>
      club.name.toLowerCase().includes(lowerQuery)
    );

    const filteredLeagues = leagues.filter(league =>
      league.name.toLowerCase().includes(lowerQuery)
    );

    return {
      kits: filteredKits,
      clubs: filteredClubs,
      leagues: filteredLeagues
    };
  }, [query, kits, clubs, leagues]);

  const hasResults = results.kits.length > 0 || results.clubs.length > 0 || results.leagues.length > 0;

  const handleCopy = () => {
    showToast('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen">
      <Header title="Search" />
      
      <div className="px-4 py-4">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Search kits, clubs, or leagues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input pl-11 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} className="text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {query && (
          <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
            {(['all', 'kits', 'clubs', 'leagues'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && results[tab].length > 0 && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({results[tab].length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        {!query ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Search size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Start typing to search
            </p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              No results found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try different search terms
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Kits Results */}
            {(activeTab === 'all' || activeTab === 'kits') && results.kits.length > 0 && (
              <section>
                <h3 className="section-title mb-3">
                  Kits ({results.kits.length})
                </h3>
                <div className="space-y-4">
                  {results.kits.map((kit) => {
                    const club = clubs.find(c => c.id === kit.clubId);
                    return (
                      <KitCard
                        key={kit.id}
                        kit={kit}
                        club={club}
                        isFavorite={favorites.isFavorite(kit.id)}
                        onToggleFavorite={() => {
                          favorites.toggleFavorite(kit.id);
                          if (!favorites.isFavorite(kit.id)) {
                            showToast('Added to favorites!');
                          }
                        }}
                        onCopy={handleCopy}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Clubs Results */}
            {(activeTab === 'all' || activeTab === 'clubs') && results.clubs.length > 0 && (
              <section>
                <h3 className="section-title mb-3">
                  Clubs ({results.clubs.length})
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {results.clubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => onClubClick(club.id)}
                      className="club-card"
                    >
                      <div className="w-12 h-12 mb-2">
                        <img
                          src={club.logo}
                          alt={club.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">🏟️</text></svg>';
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-center line-clamp-2">
                        {club.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Leagues Results */}
            {(activeTab === 'all' || activeTab === 'leagues') && results.leagues.length > 0 && (
              <section>
                <h3 className="section-title mb-3">
                  Leagues ({results.leagues.length})
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {results.leagues.map((league) => (
                    <button
                      key={league.id}
                      onClick={() => onLeagueClick(league.id)}
                      className="league-card"
                    >
                      <div className="w-14 h-14 mb-2">
                        <img
                          src={league.logo}
                          alt={league.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="60">🏆</text></svg>';
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-center line-clamp-2">
                        {league.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
