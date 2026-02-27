import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface SessionUser {
  email: string;
  username: string;
}

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  initializing: boolean;
  login: (email: string, password: string) => Promise<'ok' | 'invalid'>;
  register: (email: string, username: string, password: string) => Promise<'ok' | 'email_exists' | 'error'>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const sessionToUser = (supabaseUser: { email?: string; user_metadata?: { username?: string } }): SessionUser => ({
  email: supabaseUser.email ?? '',
  username: supabaseUser.user_metadata?.username ?? supabaseUser.email?.split('@')[0] ?? '',
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? sessionToUser(session.user) : null);
      setInitializing(false);
    });

    // Keep in sync with Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? sessionToUser(session.user) : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<'ok' | 'invalid'> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { console.error('[login]', error.message); return 'invalid'; }
    return 'ok';
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ): Promise<'ok' | 'email_exists' | 'error'> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (!error) return 'ok';
    console.error('[register]', error.message);
    if (error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already exists') ||
        error.status === 422) return 'email_exists';
    return 'error';
  };

  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, initializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
