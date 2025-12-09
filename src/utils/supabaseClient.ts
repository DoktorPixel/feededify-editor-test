// src/utils/supabaseClient.ts
import {
  createClient,
  type Session,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { getCookie, setCookie, deleteCookie } from "./cookieUtils";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env");
}

const cookieStorage = {
  getItem: (key: string): string | null => getCookie(key),
  setItem: (key: string, value: string) => {
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";
    setCookie(key, value, {
      path: "/",
      expires: 7,
      secure: isHttps,
      sameSite: isHttps ? "None" : "Lax",
    });
  },
  removeItem: (key: string) => {
    deleteCookie(key, { path: "/" });
  },
};

const forceLocal = import.meta.env.VITE_FORCE_LOCAL_STORAGE === "true";

const storage =
  typeof window !== "undefined" &&
  (forceLocal || window.location.hostname === "localhost")
    ? window.localStorage
    : cookieStorage;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage,
    },
  }
);

export async function restoreSessionFromTokens(
  accessToken: string | null,
  refreshToken: string | null
): Promise<Session | null> {
  if (!accessToken || !refreshToken) {
    console.warn("[Auth] Missing tokens, skip restore");
    return null;
  }

  try {
    const resp = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (resp.error) {
      console.error("[Auth] setSession error:", resp.error);
      return null;
    }
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        return data.session;
      }
      await new Promise((r) => setTimeout(r, 50));
    }

    return resp.data?.session ?? null;
  } catch (err: unknown) {
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
  const session = data.session;
  if (!session) return null;
  return session.access_token ?? null;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    throw error;
  }
  return data;
};

export default supabase;
