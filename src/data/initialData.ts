import type { DataStore } from '@/types';

export const initialData: DataStore = {
  leagues: [
    {
      id: 'premier-league',
      name: 'Premier League',
      logo: 'https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg',
      order: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'la-liga',
      name: 'La Liga',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/LaLiga_logo_2023.svg',
      order: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'serie-a',
      name: 'Serie A',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Serie_A_logo_2022.svg',
      order: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      logo: 'https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg',
      order: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ligue-1',
      name: 'Ligue 1',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Ligue_1_Uber_Eats_logo.svg',
      order: 5,
      createdAt: new Date().toISOString()
    }
  ],
  clubs: [
    // Premier League
    {
      id: 'man-city',
      name: 'Manchester City',
      logo: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
      leagueId: 'premier-league',
      createdAt: new Date().toISOString()
    },
    {
      id: 'liverpool',
      name: 'Liverpool',
      logo: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
      leagueId: 'premier-league',
      createdAt: new Date().toISOString()
    },
    {
      id: 'arsenal',
      name: 'Arsenal',
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
      leagueId: 'premier-league',
      createdAt: new Date().toISOString()
    },
    // La Liga
    {
      id: 'real-madrid',
      name: 'Real Madrid',
      logo: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
      leagueId: 'la-liga',
      createdAt: new Date().toISOString()
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      logo: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
      leagueId: 'la-liga',
      createdAt: new Date().toISOString()
    },
    {
      id: 'atletico',
      name: 'Atletico Madrid',
      logo: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
      leagueId: 'la-liga',
      createdAt: new Date().toISOString()
    },
    // Serie A
    {
      id: 'juventus',
      name: 'Juventus',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Juventus_FC_-_pictogram_black_%28Italy%2C_2017%29.svg',
      leagueId: 'serie-a',
      createdAt: new Date().toISOString()
    },
    {
      id: 'inter',
      name: 'Inter Milan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg',
      leagueId: 'serie-a',
      createdAt: new Date().toISOString()
    },
    {
      id: 'milan',
      name: 'AC Milan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg',
      leagueId: 'serie-a',
      createdAt: new Date().toISOString()
    },
    // Bundesliga
    {
      id: 'bayern',
      name: 'Bayern Munich',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
      leagueId: 'bundesliga',
      createdAt: new Date().toISOString()
    },
    {
      id: 'dortmund',
      name: 'Borussia Dortmund',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg',
      leagueId: 'bundesliga',
      createdAt: new Date().toISOString()
    },
    // Ligue 1
    {
      id: 'psg',
      name: 'Paris Saint-Germain',
      logo: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
      leagueId: 'ligue-1',
      createdAt: new Date().toISOString()
    }
  ],
  kits: [
    // Manchester City Kits
    {
      id: 'man-city-home-24',
      name: 'Manchester City Home 2024/25',
      type: 'Home',
      image: 'https://i.imgur.com/placeholder1.jpg',
      link: 'https://example.com/man-city-home',
      clubId: 'man-city',
      createdAt: new Date().toISOString()
    },
    {
      id: 'man-city-away-24',
      name: 'Manchester City Away 2024/25',
      type: 'Away',
      image: 'https://i.imgur.com/placeholder2.jpg',
      link: 'https://example.com/man-city-away',
      clubId: 'man-city',
      createdAt: new Date().toISOString()
    },
    // Real Madrid Kits
    {
      id: 'real-madrid-home-24',
      name: 'Real Madrid Home 2024/25',
      type: 'Home',
      image: 'https://i.imgur.com/placeholder3.jpg',
      link: 'https://example.com/real-madrid-home',
      clubId: 'real-madrid',
      createdAt: new Date().toISOString()
    },
    {
      id: 'real-madrid-away-24',
      name: 'Real Madrid Away 2024/25',
      type: 'Away',
      image: 'https://i.imgur.com/placeholder4.jpg',
      link: 'https://example.com/real-madrid-away',
      clubId: 'real-madrid',
      createdAt: new Date().toISOString()
    },
    // Barcelona Kits
    {
      id: 'barcelona-home-24',
      name: 'Barcelona Home 2024/25',
      type: 'Home',
      image: 'https://i.imgur.com/placeholder5.jpg',
      link: 'https://example.com/barcelona-home',
      clubId: 'barcelona',
      createdAt: new Date().toISOString()
    },
    // Bayern Munich Kits
    {
      id: 'bayern-home-24',
      name: 'Bayern Munich Home 2024/25',
      type: 'Home',
      image: 'https://i.imgur.com/placeholder6.jpg',
      link: 'https://example.com/bayern-home',
      clubId: 'bayern',
      createdAt: new Date().toISOString()
    },
    // PSG Kits
    {
      id: 'psg-home-24',
      name: 'PSG Home 2024/25',
      type: 'Home',
      image: 'https://i.imgur.com/placeholder7.jpg',
      link: 'https://example.com/psg-home',
      clubId: 'psg',
      createdAt: new Date().toISOString()
    }
  ],
  settings: {
    appName: 'DLS KITS',
    appLogo: '/logo.png',
    welcomeText: 'Welcome to DLS KITS - Your ultimate destination for Dream League Soccer kits!',
    version: '1.0.0'
  }
};
