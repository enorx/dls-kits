import { useState, useEffect, useCallback } from 'react';

// Admin configuration - in production, this should be more secure
const ADMIN_KEY = 'ATEF&DLS-2004-KORA-ox-GG';
const SECRET_URL_KEY = 'dlsadmin2024';
const SESSION_KEY = 'dls_admin_session';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session === 'authenticated') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
    }
    setIsLoading(false);
  }, []);

  // Validate the secret URL key
  const validateSecretKey = useCallback((key: string | null): boolean => {
    return key === SECRET_URL_KEY;
  }, []);

  // Login with password
  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_KEY) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(SESSION_KEY, 'authenticated');
      } catch (error) {
        console.error('Error saving admin session:', error);
      }
      return true;
    }
    return false;
  }, []);

  // Logout
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Error clearing admin session:', error);
    }
  }, []);

  // Check if user is admin (for UI purposes)
  const checkIsAdmin = useCallback((): boolean => {
    return isAuthenticated;
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    validateSecretKey,
    login,
    logout,
    checkIsAdmin
  };
}
