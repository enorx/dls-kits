import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  error?: string | null;
  onRetry?: () => void;
}

export function LoadingScreen({ error, onRetry }: LoadingScreenProps) {
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle size={32} className="text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Failed to Load Data</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                <RefreshCw size={18} />
                Retry
              </button>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <Loader2 size={32} className="absolute inset-0 m-auto text-primary animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">Loading DLS KITS...</h2>
        <p className="text-sm text-muted-foreground">Fetching data from GitHub</p>
      </div>
    </div>
  );
}
