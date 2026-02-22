import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function Header({ title, subtitle, onBack, showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div className="absolute inset-0 bg-[rgba(10,10,15,0.9)] backdrop-blur-xl border-b border-white/[0.06]" />
      
      <div className="relative flex items-center gap-3 px-4 py-4">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
