import type { AppSettings } from '@/types';
import { Header } from '@/components/Header';
import { Shield, Info, Mail, ExternalLink, Github, CheckCircle, AlertCircle, XCircle, MessageSquare } from 'lucide-react';

interface ProfileScreenProps {
  settings: AppSettings;
  isGitHubConfigured: boolean;
  hasWriteAccess: boolean;
}

export function ProfileScreen({ settings, isGitHubConfigured, hasWriteAccess }: ProfileScreenProps) {
  const openTelegramChannel = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen">
      <Header title="Profile" />
      
      <div className="px-4 py-6">
        {/* App Logo & Name */}
        <div className="glass-card p-8 mb-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">DLS</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            DLS ATEF KITS
          </h2>
          <p className="text-sm text-muted-foreground">
            Version {settings.version}
          </p>
        </div>
        
        {/* GitHub Status */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Github size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">GitHub Integration</h3>
              <p className="text-xs text-muted-foreground">Data source status</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-muted-foreground">Configuration</span>
              <div className="flex items-center gap-2">
                {isGitHubConfigured ? (                  <>                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-sm text-green-500">Connected</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} className="text-destructive" />
                    <span className="text-sm text-destructive">Not Configured</span>
                  </>
                )}
              </div>
            </div>
            
            {isGitHubConfigured && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Write Access</span>
                <div className="flex items-center gap-2">
                  {hasWriteAccess ? (
                    <>
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-sm text-green-500">Enabled</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-yellow-500" />
                      <span className="text-sm text-yellow-500">Read-Only</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {settings.welcomeText}
          </p>
        </div>
        
        {/* Info Cards */}
        <div className="space-y-3">
          {/* About Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Info size={20} className="text-primary" />
              </div>
              <div>                <h3 className="font-medium text-foreground">About</h3>
                <p className="text-xs text-muted-foreground">App information</p>              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              DLS KITS is your ultimate destination for Dream League Soccer kits. 
              Browse and download kits from top football clubs around the world.
            </p>
          </div>
          
          {/* Features Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Features</h3>
                <p className="text-xs text-muted-foreground">What we offer</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Browse kits by league and club
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                One-click link copying
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Save favorites for quick access
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Fast search functionality
              </li>
            </ul>
          </div>
          
          {/* Telegram Channels Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MessageSquare size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Telegram Channels</h3>
                <p className="text-xs text-muted-foreground">Follow for updates</p>              </div>
            </div>
            <div className="space-y-3">              <button 
                onClick={() => openTelegramChannel('https://t.me/+26PeGbvB1OJjZmVk')}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">ATEF X DLS</div>
                    <div className="text-xs text-muted-foreground">Presenter Channel</div>
                  </div>
                </div>
                <ExternalLink size={16} />
              </button>
              
              <button 
                onClick={() => openTelegramChannel('https://t.me/tele_t')}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-primary" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">OWL</div>
                    <div className="text-xs text-muted-foreground">Developer Channel</div>
                  </div>
                </div>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
          
          {/* Support Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3 justify-center">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Support</h3>
                <p className="text-xs text-muted-foreground">Get in touch</p>
              </div>
            </div>
            <button 
              onClick={() => openTelegramChannel('https://t.me/+qlBbfv8-9go3NWZk')}
              className="flex items-center gap-2 text-sm text-primary hover:underline justify-center"
            >
              Contact Support
              <ExternalLink size={14} />            </button>
          </div>
        </div>
                {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for DLS players
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            © 2026 DLS KITS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
          }
