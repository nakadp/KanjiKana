import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  profile: any | null;
  liffError: string | null;
}

const UserContext = createContext<UserContextType>({ userId: null, profile: null, liffError: null });

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    // 開発用 LIFF ID as per LIFF_ID.md
    const liffId = import.meta.env.VITE_LIFF_ID || "2010149887-XfijU5UN";
    const liff = (window as any).liff;
    
    // Mock user for local development
    const applyMockUser = () => {
      setUserId('mock_user_123');
      setProfile({ displayName: 'Dev User (Mock)', pictureUrl: '' });
    };

    if (liff) {
      liff.init({ liffId })
        .then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile().then((p: any) => {
              setProfile(p);
              setUserId(p.userId);
            }).catch((err: any) => setLiffError(err.toString()));
          } else {
            // In a real LIFF environment, we would call liff.login() here.
            // But since this might be opened on desktop, we apply a mock.
            applyMockUser();
          }
        })
        .catch((err: Error) => {
          setLiffError(err.toString());
          applyMockUser();
        });
    } else {
      setLiffError("LIFF SDK not loaded from script tag");
      applyMockUser();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, profile, liffError }}>
      {children}
    </UserContext.Provider>
  );
}
