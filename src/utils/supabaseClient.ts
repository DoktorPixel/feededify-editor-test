// src/utils/supabaseClient.ts
import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env");
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage, // localStorage only
    },
  }
);

/**
 * Restore session from tokens (from query params).
 */
export async function restoreSessionFromTokens(
  accessToken: string | null,
  refreshToken: string | null
): Promise<Session | null> {
  if (!accessToken || !refreshToken) {
    console.warn("[Auth] Missing tokens, skip restore");
    return null;
  }

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("[Auth] setSession error:", error);
      return null;
    }

    return data.session;
  } catch (err) {
    console.error("[Auth] restoreSessionFromTokens exception:", err);
    return null;
  }
}

export const getToken = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  return data.session?.access_token ?? null;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export default supabase;
