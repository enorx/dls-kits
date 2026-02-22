import type { Kit, Club } from '@/types';
import { Copy, Heart } from 'lucide-react';
import { useState } from 'react';

interface KitCardProps {
  kit: Kit;
  club?: Club;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCopy: () => void;
}

export function KitCard({ kit, club, isFavorite, onToggleFavorite, onCopy }: KitCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(kit.link);
    onCopy();
  };

  return (
    <div className="kit-card p-4">
      {/* Kit Image */}
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary mb-4">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 skeleton" />
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">👕</span>
              </div>
              <p className="text-xs text-muted-foreground">Kit Preview</p>
            </div>
          </div>
        ) : (
          <img
            src={kit.image}
            alt={kit.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Kit type badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/60 backdrop-blur-sm text-white/90 border border-white/10">
          {kit.type}
        </span>
        
        {/* Favorite button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 favorite-btn ${isFavorite ? 'active' : ''}`}
        >
          <Heart 
            size={18} 
            fill={isFavorite ? 'currentColor' : 'none'}
            className="transition-transform duration-200 active:scale-75"
          />
        </button>
      </div>
      
      {/* Kit Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-medium text-sm text-foreground line-clamp-2">
            {kit.name}
          </h3>
          {club && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {club.name}
            </p>
          )}
        </div>
        
        {/* Copy Link Section */}
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-secondary/50 border border-white/5">
            <p className="text-xs text-muted-foreground truncate">
              {kit.link}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="copy-btn ripple"
          >
            <Copy size={14} />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
