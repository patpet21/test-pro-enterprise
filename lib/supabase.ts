
import { createClient } from '@supabase/supabase-js';
import { UserProfile, UserRole, Investment, Order, Transaction } from '../types';

// --- CONFIGURATION ---
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    return (import.meta.env && import.meta.env[key]) ? import.meta.env[key] : fallback;
  } catch (e) {
    return fallback;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://eksjajpcbiuvxcqnxxlx.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrc2phanBjYml1dnhjcW54eGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDU1MDAsImV4cCI6MjA3OTUyMTUwMH0.tL08QW3dWc03CRISX52F9c_wpRJinbLkDA-YgyMJSrU');

// Check if we have valid keys to run in "Real Mode"
const isRealMode = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined';

// --- REAL SUPABASE CLIENT ---
const realSupabase = isRealMode 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// --- MOCK STORAGE KEYS ---
const SESSION_KEY = 'propertydex-session';
const DB_PROFILES_KEY = 'propertydex-db-profiles';
const DB_ROLES_KEY = 'propertydex-db-roles';
const DB_INVESTMENTS_KEY = 'propertydex-db-investments';
const DB_ORDERS_KEY = 'propertydex-db-orders';
const DB_TRANSACTIONS_KEY = 'propertydex-db-transactions';

// Safe Storage Wrapper with Quota Handling
const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn(`LocalStorage Quota Exceeded for "${key}". Data not saved to prevent crash.`);
        // Optional: Attempt to clear old logs or non-essential data here
        try {
            // Emergency clear of potentially large non-critical keys if needed
            // localStorage.removeItem('some-cache-key');
        } catch (innerE) {
            console.error("Failed to clear space", innerE);
        }
    } else {
        console.error(`Error saving to localStorage: ${key}`, e);
    }
  }
};

const getDb = () => {
  try {
    const profilesStr = localStorage.getItem(DB_PROFILES_KEY);
    const rolesStr = localStorage.getItem(DB_ROLES_KEY);
    const investmentsStr = localStorage.getItem(DB_INVESTMENTS_KEY);
    const ordersStr = localStorage.getItem(DB_ORDERS_KEY);
    const transactionsStr = localStorage.getItem(DB_TRANSACTIONS_KEY);

    return {
      profiles: profilesStr ? JSON.parse(profilesStr) as UserProfile[] : [],
      roles: rolesStr ? JSON.parse(rolesStr) as UserRole[] : [],
      investments: investmentsStr ? JSON.parse(investmentsStr) as Investment[] : [],
      orders: ordersStr ? JSON.parse(ordersStr) as Order[] : [],
      transactions: transactionsStr ? JSON.parse(transactionsStr) as Transaction[] : [],
    };
  } catch (e) {
    console.error("Error reading from localStorage", e);
    return { profiles: [], roles: [], investments: [], orders: [], transactions: [] };
  }
};

const saveDb = (
    profiles: UserProfile[], 
    roles: UserRole[], 
    investments: Investment[] = [],
    orders: Order[] = [],
    transactions: Transaction[] = []
) => {
    safeSetItem(DB_PROFILES_KEY, JSON.stringify(profiles));
    safeSetItem(DB_ROLES_KEY, JSON.stringify(roles));
    if (investments.length > 0) safeSetItem(DB_INVESTMENTS_KEY, JSON.stringify(investments));
    if (orders.length > 0) safeSetItem(DB_ORDERS_KEY, JSON.stringify(orders));
    if (transactions.length > 0) safeSetItem(DB_TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const supabase: any = isRealMode && realSupabase ? realSupabase : {
  auth: {
    getSession: async () => {
      try {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        const session = sessionStr ? JSON.parse(sessionStr) : null;
        return { data: { session }, error: null };
      } catch (e) {
        return { data: { session: null }, error: null };
      }
    },
    
    signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
      const db = getDb();
      const userProfile = db.profiles.find(p => p.email === email);

      if (!userProfile) {
         const session = {
            user: { email, id: 'demo-user-' + Math.random().toString(36).substr(2,9), aud: 'authenticated' },
            access_token: 'mock-token-' + Math.random().toString(36),
            expires_at: Math.floor(Date.now() / 1000) + 3600
         };
         safeSetItem(SESSION_KEY, JSON.stringify(session));
         window.dispatchEvent(new Event('storage'));
         return { data: { session }, error: null };
      }

      const session = {
        user: { 
            email: userProfile.email, 
            id: userProfile.id, 
            user_metadata: { full_name: userProfile.full_name },
            aud: 'authenticated' 
        },
        access_token: 'mock-token-' + Math.random().toString(36),
        expires_at: Math.floor(Date.now() / 1000) + 3600
      };
      
      safeSetItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { session }, error: null };
    },

    signUp: async ({ email, password, options }: { email: string; password?: string, options?: { data: any } }) => {
      const db = getDb();
      if (db.profiles.find(p => p.email === email)) {
          return { data: { session: null }, error: { message: "User already exists" } };
      }

      const newUserId = 'user-' + Math.random().toString(36).substr(2, 9);
      const now = new Date().toISOString();

      const newProfile: UserProfile = {
          id: newUserId,
          email: email,
          full_name: options?.data?.full_name || '',
          country: options?.data?.country || '',
          kyc_verified: false,
          avatar_url: options?.data?.avatar_url || '',
          created_at: now,
          updated_at: now
      };

      const newRole: UserRole = {
          user_id: newUserId,
          role: 'user',
          kyc_status: 'pending',
          accreditation_status: 'none',
          updated_at: now
      };

      db.profiles.push(newProfile);
      db.roles.push(newRole);
      saveDb(db.profiles, db.roles, db.investments, db.orders, db.transactions);

      const session = {
        user: { email, id: newUserId, user_metadata: options?.data, aud: 'authenticated' },
        access_token: 'mock-token-' + Math.random().toString(36),
      };
      
      safeSetItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event('storage'));
      return { data: { session }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new Event('storage'));
      return { error: null };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (sessionStr) {
        try { callback('SIGNED_IN', JSON.parse(sessionStr)); } catch(e) {}
      }
      const storageHandler = () => {
         const s = localStorage.getItem(SESSION_KEY);
         if (s) { try { callback('SIGNED_IN', JSON.parse(s)); } catch(e) {} } else callback('SIGNED_OUT', null);
      };
      window.addEventListener('storage', storageHandler);
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', storageHandler) } } };
    }
  },
  from: (table: string) => {
      return {
          select: async (query?: string) => {
              const db = getDb();
              if (table === 'profiles') return { data: db.profiles, error: null };
              if (table === 'investments') return { data: db.investments, error: null };
              if (table === 'orders') return { data: db.orders, error: null };
              // Fallback
              return { data: [], error: null };
          },
          insert: async (data: any) => {
              const db = getDb();
              // Simplified mock insert
              return { data: [data], error: null };
          }
      }
  }
};
