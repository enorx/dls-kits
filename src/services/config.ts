/**
 * Application Configuration
 * Centralized configuration management for DLS KITS
 */

// Admin security configuration
export const ADMIN_CONFIG = {
  // Secret URL key - must match ?key= parameter
  SECRET_KEY: 'dlsadmin2024',
  
  // Admin password
  PASSWORD: 'ATEF&DLS-2004-KORA-ox-GG',
  
  // Session storage key
  SESSION_KEY: 'dls_admin_session',
} as const;

// Data configuration
export const DATA_CONFIG = {
  // Path to data.json in repository
  DATA_PATH: 'data/data.json',
  
  // Path to images folder in repository
  IMAGES_PATH: 'assets/images',
  
  // Cache duration in milliseconds (5 minutes)
  CACHE_DURATION: 5 * 60 * 1000,
  
  // Maximum image size in bytes (5MB)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  
  // Allowed image types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
} as const;

// UI Configuration
export const UI_CONFIG = {
  // Toast display duration in milliseconds
  TOAST_DURATION: 2500,
  
  // Debounce delay for search
  SEARCH_DEBOUNCE: 300,
  
  // Items per page for pagination (if implemented)
  ITEMS_PER_PAGE: 20,
} as const;

// GitHub Configuration (from environment)
export const GITHUB_CONFIG = {
  TOKEN: import.meta.env.VITE_GITHUB_TOKEN || '',
  OWNER: import.meta.env.VITE_GITHUB_OWNER || '',
  REPO: import.meta.env.VITE_GITHUB_REPO || '',
  BRANCH: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  
  get isConfigured(): boolean {
    return !!(this.TOKEN && this.OWNER && this.REPO);
  },
  
  get rawUrl(): string {
    return `https://raw.githubusercontent.com/${this.OWNER}/${this.REPO}/${this.BRANCH}`;
  },
  
  get apiUrl(): string {
    return `https://api.github.com/repos/${this.OWNER}/${this.REPO}`;
  },
  
  get pagesUrl(): string {
    return `https://${this.OWNER}.github.io/${this.REPO}`;
  },
} as const;

// Feature flags
export const FEATURES = {
  // Enable GitHub sync (disabled uses localStorage fallback)
  ENABLE_GITHUB_SYNC: true,
  
  // Enable image optimization before upload
  ENABLE_IMAGE_OPTIMIZATION: false,
  
  // Enable analytics
  ENABLE_ANALYTICS: false,
} as const;

// Validate configuration
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!GITHUB_CONFIG.isConfigured) {
    errors.push('GitHub configuration incomplete. Check VITE_GITHUB_TOKEN, VITE_GITHUB_OWNER, and VITE_GITHUB_REPO.');
  }
  
  if (GITHUB_CONFIG.TOKEN && !GITHUB_CONFIG.TOKEN.startsWith('ghp_')) {
    errors.push('GitHub token format appears invalid. Should start with "ghp_".');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export all configs
export default {
  ADMIN: ADMIN_CONFIG,
  DATA: DATA_CONFIG,
  UI: UI_CONFIG,
  GITHUB: GITHUB_CONFIG,
  FEATURES,
  validateConfig,
};
