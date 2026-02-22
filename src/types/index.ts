// DLS KITS - Type Definitions

export type KitType = 'Home' | 'Away' | 'Third' | 'GK' | 'Logo';

export interface Kit {
  id: string;
  name: string;
  type: KitType;
  image: string;
  link: string;
  clubId: string;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  logo: string;
  leagueId: string;
  createdAt: string;
}

export interface League {
  id: string;
  name: string;
  logo: string;
  order: number;
  createdAt: string;
}

export interface AppSettings {
  appName: string;
  appLogo: string;
  welcomeText: string;
  version: string;
}

export interface DataStore {
  leagues: League[];
  clubs: Club[];
  kits: Kit[];
  settings: AppSettings;
}

export type View = 'home' | 'clubs' | 'kits' | 'search' | 'favorites' | 'profile' | 'admin';

export interface NavItem {
  id: View;
  label: string;
  icon: string;
}
