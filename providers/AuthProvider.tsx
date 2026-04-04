'use client';

import { createContext, useContext, useCallback, useSyncExternalStore, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

let cachedUser: User | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function subscribeAuth(callback: () => void) {
  listeners.add(callback);

  const supabase = createClient();
  if (supabase && !initialized) {
    initialized = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      cachedUser = user;
      listeners.forEach((l) => l());
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      cachedUser = session?.user ?? null;
      listeners.forEach((l) => l());
    });
  }

  return () => { listeners.delete(callback); };
}

function getUser() { return cachedUser; }
function getServerUser() { return null; }

export default function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeAuth, getUser, getServerUser);
  const loading = !initialized;

  const signOut = useCallback(async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
