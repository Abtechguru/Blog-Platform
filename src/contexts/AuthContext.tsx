import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase-client';
import type { User, Session } from '@supabase/supabase-js';

// Types for our auth context
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'author' | 'contributor' | 'reader';
  bio?: string;
  display_name?: string;
  is_active: boolean;
  is_subscribed?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSubscribed: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  subscribeToPage: () => Promise<{ error: Error | null }>;
  unsubscribeFromPage: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from our users table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If user doesn't exist in our table, create them
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // Create user profile in our users table
  const createProfile = async (authUser: User, fullName: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          email: authUser.email,
          full_name: fullName,
          role: 'reader',
          is_active: true,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Error creating profile:', err);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
      }
      
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      // Create profile in our users table
      if (data.user) {
        await createProfile(data.user, fullName);
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign in with magic link (OTP)
  const signInWithMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Verify OTP token
  const verifyOtp = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) {
        return { error };
      }

      // Create profile if new user
      if (data.user) {
        const existingProfile = await fetchProfile(data.user.id);
        if (!existingProfile) {
          await createProfile(data.user, email.split('@')[0]);
        }
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Subscribe to page updates
  const subscribeToPage = async () => {
    if (!user || !profile) {
      return { error: new Error('User not logged in') };
    }

    try {
      // Add to newsletter subscribers
      const { error: newsletterError } = await supabase
        .from('newsletter_subscribers')
        .upsert([{
          email: user.email,
          is_active: true,
          preferences: {
            weekly_digest: true,
            article_updates: true,
            exclusive_content: true,
          },
        }], { onConflict: 'email' });

      if (newsletterError) {
        return { error: newsletterError };
      }

      // Update profile
      setProfile({ ...profile, is_subscribed: true });

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  // Unsubscribe from page updates
  const unsubscribeFromPage = async () => {
    if (!user || !profile) {
      return { error: new Error('User not logged in') };
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false })
        .eq('email', user.email);

      if (error) {
        return { error };
      }

      // Update profile
      setProfile({ ...profile, is_subscribed: false });

      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    isAdmin: profile?.role === 'admin',
    isSubscribed: profile?.is_subscribed ?? false,
    signUp,
    signIn,
    signInWithMagicLink,
    verifyOtp,
    signOut,
    resetPassword,
    subscribeToPage,
    unsubscribeFromPage,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
