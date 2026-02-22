import { Search, Heart, Package } from 'lucide-react';

interface EmptyStateProps {
  type: 'search' | 'favorites' | 'kits' | 'clubs';
  message?: string;
}

const icons = {
  search: Search,
  favorites: Heart,
  kits: Package,
  clubs: Package,
};

const defaultMessages = {
  search: 'No results found',
  favorites: 'No favorites yet',
  kits: 'No kits available',
  clubs: 'No clubs available',
};

export function EmptyState({ type, message }: EmptyStateProps) {
  const Icon = icons[type];
  const displayMessage = message || defaultMessages[type];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={64} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">
        {displayMessage}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {type === 'search' && 'Try adjusting your search terms'}
        {type === 'favorites' && 'Save kits you love to see them here'}
        {type === 'kits' && 'Check back later for new kits'}
        {type === 'clubs' && 'No clubs available in this league'}
      </p>
    </div>
  );
}
