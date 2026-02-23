import type { AppSettings } from '@/types';
import { Header } from '@/components/Header';
import { Shield, Info, Mail, ExternalLink } from 'lucide-react';
import { Send } from 'lucide-react'; // شعار تليجرام

interface ProfileScreenProps {
  settings: AppSettings;
}

export function ProfileScreen({ settings }: ProfileScreenProps) {
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
            {settings.appName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Version {settings.version}
          </p>
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
              <div>
                <h3 className="font-medium text-foreground">About</h3>
                <p className="text-xs text-muted-foreground">App information</p>
              </div>
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
          
          {/* Support Card */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Support</h3>
                <p className="text-xs text-muted-foreground">Get in touch</p>
              </div>
            </div>
            <button 
              onClick={() => window.open('https://t.me/+qlBbfv8-9go3NWZk', '_blank')}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Contact Support
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Telegram Channels */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Send size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Telegram Channels</h3>
                <p className="text-xs text-muted-foreground">Stay connected</p>
              </div>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => window.open('https://t.me/+26PeGbvB1OJjZmVk', '_blank')}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                ATEF X DLS <span className="text-xs text-muted-foreground">(Presenter)</span>
              </button>
              <button 
                onClick={() => window.open('https://t.me/tele_t', '_blank')}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                OWL <span className="text-xs text-muted-foreground">(App Developer)</span>
              </button>
            </div>
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
