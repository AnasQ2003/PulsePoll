import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { apiRequest, setAuthToken, getAuthToken } from "./api";

export type Profile = {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
};

export type User = {
  id: string;
  email: string;
  username: string;
  display_name: string;
};

type Ctx = {
  user: User | null;
  profile: Profile | null;
  ready: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuthSession: (token: string, user: User) => void;
};

const AuthCtx = createContext<Ctx>({} as Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastUid = useRef<string | null>(null);

  async function loadProfile() {
    try {
      const p = await apiRequest<Profile>("/profiles/me");
      setProfile(p);
    } catch (err) {
      console.error("Failed to load profile", err);
      setProfile(null);
    }
  }

  const setAuthSession = (token: string, newUser: User) => {
    setAuthToken(token);
    setUser(newUser);
    lastUid.current = newUser.id;
    loadProfile().finally(() => {
      setLoading(false);
    });
  };

  const signOut = async () => {
    setAuthToken(null);
    setUser(null);
    setProfile(null);
    lastUid.current = null;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setReady(true);
      setLoading(false);
      return;
    }

    // Validate token / fetch user info
    apiRequest<User>("/auth/me")
      .then((u) => {
        setUser(u);
        lastUid.current = u.id;
        loadProfile().finally(() => {
          setReady(true);
          setLoading(false);
        });
      })
      .catch((err) => {
        console.error("Session restoration failed:", err);
        signOut();
        setReady(true);
        setLoading(false);
      });
  }, []);

  return (
    <AuthCtx.Provider
      value={{
        user,
        profile,
        ready,
        loading,
        refreshProfile: loadProfile,
        signOut,
        setAuthSession,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
