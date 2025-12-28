
import React, { useState } from 'react';
import { ViewType } from './types';
import { Home } from './views/Home';
import { EvacuationView } from './views/EvacuationView';
import { DriversView } from './views/DriversView';
import { ReviewView } from './views/ReviewView';
import { FactoryView } from './views/FactoryView';
import { FloatingView } from './views/FloatingView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');

  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home onNavigate={handleNavigate} />;
      case 'evacuation': return <EvacuationView onBack={() => handleNavigate('home')} />;
      case 'drivers': return <DriversView onBack={() => handleNavigate('home')} />;
      case 'review': return <ReviewView onBack={() => handleNavigate('home')} />;
      case 'factory': return <FactoryView onBack={() => handleNavigate('home')} />;
      case 'floating': return <FloatingView onBack={() => handleNavigate('home')} />;
      default: return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      <nav className="bg-white shadow-md sticky top-0 z-50 border-t-4 border-ariel-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-4">
              <div 
                className="flex flex-col items-start leading-tight group cursor-pointer" 
                onClick={() => handleNavigate('home')}
              >
                <span className="text-2xl font-black text-gray-800 tracking-tighter group-hover:opacity-80 transition-opacity">
                  אוניברסיטת <span className="text-ariel-green">אריאל</span>
                </span>
                <span className="text-xs text-slate-500 font-medium tracking-wide">בשומרון</span>
              </div>
              <div className="hidden md:block h-8 w-px bg-slate-200 mx-2"></div>
              <div className="hidden md:block text-sm text-slate-600 font-medium">המחלקה להנדסת תעשייה וניהול</div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => handleNavigate('home')} 
                className={`font-bold transition-colors px-3 py-2 flex items-center gap-2 ${currentView === 'home' ? 'text-ariel-green' : 'text-slate-600 hover:text-ariel-green'}`}
              >
                <i className="fas fa-home"></i> ראשי
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {renderView()}
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 border-t-4 border-ariel-green">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4 mb-8">
            <span className="text-2xl font-black text-white tracking-tighter">ד"ר גיא <span className="text-ariel-green">וכטל</span></span>
            <div className="flex gap-6">
              <a href="https://www.linkedin.com/in/guy-wachtel-9a8192a0/" target="_blank" rel="noreferrer" className="hover:text-ariel-green transition-colors">LinkedIn</a>
              <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ&hl=en&oi=ao" target="_blank" rel="noreferrer" className="hover:text-ariel-green transition-colors">Google Scholar</a>
            </div>
          </div>
          <p className="text-xs opacity-50">© 2025 ד"ר גיא וכטל. כל הזכויות שמורות. המחלקה להנדסת תעשייה וניהול, אוניברסיטת אריאל.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
