import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reader from './pages/Reader';
import Vocab from './pages/Vocab';

function App() {
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // 開発用 LIFF ID as per LIFF_ID.md
    const liffId = import.meta.env.VITE_LIFF_ID || "2010149887-XfijU5UN";
    const liff = (window as any).liff;
    
    if (liff) {
      liff.init({ liffId })
        .then(() => {
          if (liff.isLoggedIn()) {
            liff.getProfile().then((p: any) => {
              setProfile(p);
            }).catch((err: any) => setLiffError(err.toString()));
          }
        })
        .catch((err: Error) => {
          setLiffError(err.toString());
        });
    } else {
      setLiffError("LIFF SDK not loaded from script tag");
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-bg)] pb-20">
        {/* Simple Top Navigation / Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">KanjiKana</h1>
          {profile && (
            <img 
              src={profile.pictureUrl} 
              alt="Profile" 
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          )}
        </header>

        {liffError && (
          <div className="p-4 bg-red-100 text-red-700 m-4 rounded-lg text-sm">
            LIFF Init Error: {liffError}
          </div>
        )}

        <main className="w-full max-w-md mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reader" element={<Reader />} />
            <Route path="/vocab" element={<Vocab />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
