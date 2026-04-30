
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './views/Home';
import { EvacuationView } from './views/EvacuationView';
import { DriversView } from './views/DriversView';
import { ReviewView } from './views/ReviewView';
import { FactoryView } from './views/FactoryView';
import { FloatingView } from './views/FloatingView';

const App: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <nav className="bg-white shadow-md sticky top-0 z-50 border-t-4 border-ariel-turquoise">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex flex-col items-start leading-tight group cursor-pointer" 
              >
                <span className="text-2xl font-black text-ariel-blue tracking-tighter group-hover:opacity-80 transition-opacity">
                  אוניברסיטת <span className="text-ariel-turquoise">אריאל</span>
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">בשומרון</span>
              </Link>
              <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
              <div className="hidden md:block text-sm text-ariel-blue/80 font-medium">המחלקה להנדסת תעשייה וניהול</div>
            </div>
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`font-bold transition-colors px-3 py-2 flex items-center gap-2 ${currentPath === '/' ? 'text-ariel-turquoise' : 'text-ariel-blue hover:text-ariel-turquoise'}`}
              >
                <i className="fas fa-home"></i> ראשי
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
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
            <span className="text-2xl font-black text-white tracking-tighter">ד"ר גיא <span className="text-ariel-turquoise">וכטל</span></span>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/guy-wachtel-9a8192a0/" target="_blank" rel="noreferrer" className="hover:text-ariel-turquoise transition-colors">LinkedIn</a>
              <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ&hl=en&oi=ao" target="_blank" rel="noreferrer" className="hover:text-ariel-turquoise transition-colors">Google Scholar</a>
            </div>
          </div>
          <p className="text-xs opacity-50">© 2025 ד"ר גיא וכטל. כל הזכויות שמורות. המחלקה להנדסת תעשייה וניהול, אוניברסיטת אריאל.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

