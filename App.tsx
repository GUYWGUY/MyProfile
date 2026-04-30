
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './views/Home';
import { EvacuationView } from './views/EvacuationView';
import { DriversView } from './views/DriversView';
import { ReviewView } from './views/ReviewView';
import { FactoryView } from './views/FactoryView';
import { FloatingView } from './views/FloatingView';
import { ManagementView } from './views/ManagementView';
import { translations, Language } from './translations';

interface LanguageContextType {
  lang: Language;
  t: any;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(
    (localStorage.getItem('lang') as Language) || 'he'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];

  const toggleLang = () => {
    setLang(lang === 'he' ? 'en' : 'he');
    setIsMenuOpen(false);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      <div className={`min-h-screen flex flex-col font-sans text-slate-800 ${lang === 'he' ? 'rtl' : 'ltr'}`}>
        <nav className="bg-white shadow-md sticky top-0 z-50 border-t-4 border-ariel-turquoise">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center gap-4">
                <Link 
                  to="/"
                  className="flex flex-col items-start leading-none group cursor-pointer" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-lg md:text-xl font-black text-ariel-blue tracking-tighter group-hover:opacity-80 transition-opacity whitespace-nowrap">
                    {lang === 'he' ? (
                      <>המעבדה <span className="text-ariel-turquoise">לקבלת החלטות</span></>
                    ) : (
                      <>Lab for <span className="text-ariel-turquoise">Decision Making</span></>
                    )}
                  </span>
                  <span className="text-[9px] md:text-[11px] text-slate-500 font-bold mt-1">
                    {t.labSubName === 'אוניברסיטת אריאל' ? 'ותהליכי למידה מבוססי ידע' : 'Knowledge-Based Learning'}
                  </span>
                </Link>
                <div className="hidden lg:block h-8 w-px bg-slate-200 mx-2"></div>
                <a 
                  href="https://www.ariel.ac.il/wp/iem/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden lg:block text-sm text-ariel-blue/80 font-medium hover:text-ariel-turquoise transition-colors"
                >
                  {t.labSubName}
                </a>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-2 lg:gap-4">
                <Link 
                  to="/management" 
                  className={`font-bold transition-colors px-3 py-2 flex items-center gap-2 text-sm lg:text-base ${currentPath === '/management' ? 'text-ariel-turquoise' : 'text-ariel-blue hover:text-ariel-turquoise'}`}
                >
                  <i className="fas fa-user-tie"></i> {t.headOfLab}
                </Link>
                <Link 
                  to="/" 
                  className={`font-bold transition-colors px-3 py-2 flex items-center gap-2 text-sm lg:text-base ${currentPath === '/' ? 'text-ariel-turquoise' : 'text-ariel-blue hover:text-ariel-turquoise'}`}
                >
                  <i className="fas fa-home"></i> {t.home}
                </Link>
                <button 
                  onClick={toggleLang}
                  className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg font-bold text-sm hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-globe"></i> {t.langName}
                </button>
              </div>

              {/* Mobile Toggle */}
              <div className="md:hidden flex items-center gap-3">
                <button 
                  onClick={toggleLang}
                  className="text-ariel-blue font-bold text-sm bg-slate-100 p-2 rounded-lg"
                >
                  {t.langName}
                </button>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-ariel-blue p-2"
                >
                  <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
              <div className="px-4 py-6 space-y-4">
                <Link 
                  to="/" 
                  className="block font-bold text-lg text-ariel-blue py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-home ml-2"></i> {t.home}
                </Link>
                <Link 
                  to="/management" 
                  className="block font-bold text-lg text-ariel-blue py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-user-tie ml-2"></i> {t.headOfLab}
                </Link>
                <a 
                  href="https://www.ariel.ac.il/wp/iem/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="block font-bold text-lg text-ariel-blue py-2"
                >
                  <i className="fas fa-university ml-2"></i> {t.labSubName}
                </a>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/management" element={<ManagementView />} />
            <Route path="/evacuation" element={<EvacuationView />} />
            <Route path="/drivers" element={<DriversView />} />
            <Route path="/review" element={<ReviewView />} />
            <Route path="/factory" element={<FactoryView />} />
            <Route path="/floating" element={<FloatingView />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <footer className="bg-ariel-blue text-gray-300 py-12 border-t-4 border-ariel-turquoise">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex flex-col items-center gap-4 mb-8">
              <span className="text-xl font-black text-white tracking-tighter">
                {t.labName}
              </span>
              <div className="flex gap-6">
                <Link to="/management" className="hover:text-ariel-turquoise transition-colors">{t.headOfLab}</Link>
                <a href="https://www.linkedin.com/in/guy-wachtel-9a8192a0/" target="_blank" rel="noreferrer" className="hover:text-ariel-turquoise transition-colors">LinkedIn</a>
              </div>
            </div>
            <p className="text-xs opacity-50">{t.footerText}</p>
          </div>
        </footer>
      </div>
    </LanguageContext.Provider>
  );
};

export default App;


