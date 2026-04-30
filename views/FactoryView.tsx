import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Factory } from '../types';
import { useLanguage } from '../App';

interface PaperJob {
  id: number;
  complexity: number;
  profit: number;
  dueTime: number;
  status: 'pending' | 'main' | 'sub' | 'late';
}

export const FactoryView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [epsilon, setEpsilon] = useState(0.05);
  const [factories, setFactories] = useState<Factory[]>([
    { id: 'f1', name: lang === 'he' ? 'מפעל ראשי (Anchor)' : 'Anchor Factory', type: 'high', icon: 'fa-industry', capacity: 120, currentLoad: 0 },
    { id: 'f2', name: lang === 'he' ? "קבלן משנה א'" : 'Sub-Contractor A', type: 'med', icon: 'fa-warehouse', capacity: 80, currentLoad: 0 },
    { id: 'f3', name: lang === 'he' ? "קבלן משנה ב'" : 'Sub-Contractor B', type: 'med', icon: 'fa-warehouse', capacity: 60, currentLoad: 0 },
    { id: 'f4', name: lang === 'he' ? "קבלן משנה ג'" : 'Sub-Contractor C', type: 'low', icon: 'fa-tools', capacity: 40, currentLoad: 0 },
  ]);

  const generateJobs = () => Array(10).fill(0).map((_, i) => ({
    id: i + 1,
    complexity: Number((Math.random() * 0.8 + 0.1).toFixed(2)),
    profit: Math.floor(Math.random() * 50) + 10,
    dueTime: Math.floor(Math.random() * 50) + 20,
    status: 'pending' as const
  }));

  const [jobs, setJobs] = useState<PaperJob[]>(generateJobs());
  const [isSimulating, setIsSimulating] = useState(false);
  const [totalProfit, setTotalProfit] = useState(0);

  const randomizeData = () => {
    setJobs(generateJobs());
    setTotalProfit(0);
    setFactories(prev => prev.map(f => ({ ...f, currentLoad: 0 })));
  };

  const runScheduling = async () => {
    setIsSimulating(true);
    setTotalProfit(0);
    let currentFactories = factories.map(f => ({ ...f, currentLoad: 0 }));
    let runningJobs: PaperJob[] = jobs.map(j => ({ ...j, status: 'pending' }));
    const computationDelay = Math.floor(100 / epsilon); 
    const precisionBonus = 1 - epsilon; 
    const sortedJobs = [...runningJobs].sort((a, b) => a.dueTime - b.dueTime);

    for (const job of sortedJobs) {
      await new Promise(r => setTimeout(r, Math.min(300, computationDelay / 10)));
      const mainFactory = currentFactories[0];
      const processingTime = 6 + (job.complexity * 22);
      if (mainFactory.currentLoad + processingTime <= job.dueTime) {
        mainFactory.currentLoad += processingTime;
        job.status = 'main';
        setTotalProfit(p => p + (job.profit * precisionBonus));
      } else {
        const subs = currentFactories.slice(1).sort((a, b) => a.currentLoad - b.currentLoad);
        const chosenSub = subs[0];
        const subProcessingTime = processingTime * (chosenSub.type === 'med' ? 1.3 : 1.7);
        if (chosenSub.currentLoad + subProcessingTime <= job.dueTime) {
          chosenSub.currentLoad += subProcessingTime;
          job.status = 'sub';
          setTotalProfit(p => p + (job.profit * 0.65 * precisionBonus));
        } else {
          job.status = 'late';
        }
      }
      setJobs([...sortedJobs]);
      setFactories([...currentFactories]);
    }
    setIsSimulating(false);
  };

  const getMetricColor = (val: number, min: number, max: number, type: 'profit' | 'stress') => {
    const ratio = (val - min) / (max - min);
    if (type === 'profit') {
      if (ratio > 0.7) return 'text-emerald-400 font-bold';
      if (ratio > 0.3) return 'text-emerald-500/80';
      return 'text-emerald-600/60';
    } else {
      if (ratio > 0.7) return 'text-rose-500 font-bold';
      if (ratio > 0.3) return 'text-rose-400/80';
      return 'text-rose-300/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className={`mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit ${lang === 'he' ? 'ml-auto' : 'mr-auto'}`}>
          <i className={`fas ${lang === 'he' ? 'fa-arrow-right ml-2' : 'fa-arrow-left mr-2'}`}></i> {t.backToLab}
        </Link>

        <header className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100 relative">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-black text-ariel-blue mb-2">{t.simTitleFactory} (2020)</h1>
              <p className="text-slate-500 font-medium mb-4 italic">Journal of Industrial and Production Engineering</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://doi.org/10.1080/21681015.2020.1801867" target="_blank" rel="noreferrer" className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md">
                  <i className="fas fa-external-link-alt"></i> {lang === 'he' ? 'צפייה במאמר' : 'View Article'}
                </a>
                <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <i className="fas fa-tags"></i> NP-Hard, FPTAS, Scheduling
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[140px] w-full md:w-auto">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest">{lang === 'he' ? 'מורכבות חישובית' : 'Complexity'}</div>
              <div className="text-2xl font-black text-ariel-turquoise tracking-tight">O(n³/ε)</div>
            </div>
          </div>
        </header>

        <div className="bg-ariel-blue text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 mb-12 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-8 relative z-10">
            <div className={`flex items-center gap-4 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
               <div className="w-12 h-12 md:w-14 md:h-14 bg-ariel-turquoise/20 rounded-2xl flex items-center justify-center text-ariel-turquoise text-2xl md:text-3xl">
                  <i className="fas fa-network-wired"></i>
               </div>
               <div>
                  <h3 className="text-lg md:text-xl font-black tracking-tight">{lang === 'he' ? 'סימולטור FPTAS להקצאה' : 'FPTAS Allocation Simulator'}</h3>
                  <p className="text-[10px] text-slate-400">{lang === 'he' ? 'איזון עומס מול רווח' : 'Profit vs Workload Balance'}</p>
               </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-md p-4 md:p-5 rounded-2xl md:rounded-[2rem] border border-white/10 w-full lg:w-auto">
               <div className="text-center px-2">
                  <div className="text-[9px] text-slate-300 uppercase font-black mb-2">{lang === 'he' ? 'דיוק (ε)' : 'Precision (ε)'}</div>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0.01" max="0.2" step="0.01" value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} className="w-24 md:w-32 accent-ariel-turquoise h-1.5 bg-slate-700 rounded-full" />
                    <span className="text-xs font-mono font-bold text-ariel-turquoise">{(epsilon * 100).toFixed(0)}%</span>
                  </div>
               </div>
               <div className="hidden sm:block w-px h-10 bg-white/20"></div>
               <div className="text-center px-2">
                  <div className="text-[9px] text-slate-300 uppercase font-black mb-1">{lang === 'he' ? 'רווח מצטבר' : 'Total Profit'}</div>
                  <div className="text-2xl font-black text-white tracking-tighter">${totalProfit.toFixed(1)}K</div>
               </div>
               <button onClick={runScheduling} disabled={isSimulating} className="bg-ariel-turquoise hover:bg-ariel-turquoise-dark disabled:opacity-50 text-white font-black py-3 md:py-4 px-6 md:px-10 rounded-xl md:rounded-2xl transition-all flex items-center gap-2 text-xs md:text-sm">
                 {isSimulating ? <i className="fas fa-sync-alt animate-spin"></i> : <i className="fas fa-play-circle"></i>}
                 {isSimulating ? (lang === 'he' ? 'מחשב...' : 'Computing...') : (lang === 'he' ? 'בצע אופטימיזציה' : 'Optimize')}
               </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
               <div className="flex justify-between items-center px-2 mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'he' ? 'משימות ממתינות' : 'Pending Jobs'} (n=10)</h4>
                  <button onClick={randomizeData} disabled={isSimulating} className="text-[9px] font-bold text-ariel-turquoise hover:text-white flex items-center gap-1">
                    <i className="fas fa-sync"></i> {lang === 'he' ? 'דאטא חדש' : 'New Data'}
                  </button>
               </div>
               <div className="space-y-1.5 overflow-y-auto pr-2 flex-grow max-h-[400px] md:max-h-[500px]">
                  {jobs.map(job => (
                    <div key={job.id} className={`py-2 px-3 rounded-xl border transition-all duration-500 flex flex-col justify-center ${job.status === 'main' ? 'bg-ariel-turquoise/10 border-ariel-turquoise/40' : (job.status === 'sub' ? 'bg-blue-500/10 border-blue-500/40' : (job.status === 'late' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'))}`}>
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[9px] font-black text-slate-100">JOB #{job.id}</span>
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase ${job.status === 'main' ? 'bg-ariel-turquoise text-slate-900' : (job.status === 'sub' ? 'bg-blue-500 text-white' : (job.status === 'late' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'))}`}>
                          {job.status === 'pending' ? (lang === 'he' ? 'המתנה' : 'Pending') : (job.status === 'main' ? (lang === 'he' ? 'ראשי' : 'Main') : (job.status === 'sub' ? (lang === 'he' ? 'משנה' : 'Sub') : (lang === 'he' ? 'איחור' : 'Late')))}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[9px] md:text-[10px] font-bold">
                         <span className={getMetricColor(job.profit, 10, 60, 'profit')}>${job.profit}K</span>
                         <span className="text-white/20">|</span>
                         <span className={getMetricColor(job.complexity, 0.1, 0.9, 'stress')}>{(job.complexity * 100).toFixed(0)}% {lang === 'he' ? 'מורכבות' : 'Comp'}</span>
                         <span className="text-white/20">|</span>
                         <span className={getMetricColor(job.dueTime, 20, 70, 'stress')}>{job.dueTime}h {lang === 'he' ? 'יעד' : 'Due'}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-8 flex flex-col h-full">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{lang === 'he' ? 'מפת קיבולת רשת' : 'Network Capacity Map'}</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-grow">
                  {factories.map(f => (
                    <div key={f.id} className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/10 flex flex-col group hover:border-ariel-turquoise/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl ${f.type === 'high' ? 'bg-ariel-turquoise/20 text-ariel-turquoise' : 'bg-white/10 text-slate-400'}`}>
                               <i className={`fas ${f.icon}`}></i>
                            </div>
                            <div className={lang === 'he' ? 'text-right' : 'text-left'}>
                               <div className="text-xs md:text-sm font-black text-white leading-tight">{f.name}</div>
                               <div className="text-[8px] md:text-[9px] text-slate-400 uppercase font-bold tracking-widest">{f.type === 'high' ? 'Main' : 'Sub'}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs md:text-sm font-mono font-bold text-slate-100">
                               {f.currentLoad.toFixed(0)}<span className="text-[8px] text-slate-400 ml-1">/ {f.capacity}h</span>
                            </div>
                         </div>
                      </div>
                      <div className="mt-auto">
                         <div className="h-2 md:h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px]">
                            <div className={`h-full rounded-full transition-all duration-1000 ${f.currentLoad > f.capacity ? 'bg-red-500' : (f.currentLoad > f.capacity * 0.8 ? 'bg-orange-500' : 'bg-ariel-turquoise')}`} style={{ width: `${Math.min(100, (f.currentLoad / f.capacity) * 100)}%` }} />
                         </div>
                         <div className="flex justify-between mt-1 px-1">
                            <span className="text-[8px] text-slate-400 font-bold">{lang === 'he' ? 'עומס:' : 'Load:'} {Math.floor((f.currentLoad / f.capacity) * 100)}%</span>
                            {f.currentLoad > f.capacity && <span className="text-[8px] text-red-400 font-black animate-pulse">OVERLOAD!</span>}
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <div className={`text-[9px] text-ariel-turquoise uppercase font-black mb-2 flex items-center gap-2 ${lang === 'he' ? 'justify-end' : 'justify-start'}`}>
                        {lang === 'he' ? 'עיקרון אופטימיזציה' : 'Optimization Principle'} <i className="fas fa-check-double"></i>
                     </div>
                     <p className="text-[9px] text-slate-400 italic">{lang === 'he' ? 'מיקסום הרווח המצטבר בתוך המפעל הראשי תוך עמידה בדד-ליין.' : 'Maximize cumulative profit in main factory while meeting deadlines.'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <div className={`text-[9px] text-blue-400 uppercase font-black mb-2 flex items-center gap-2 ${lang === 'he' ? 'justify-end' : 'justify-start'}`}>
                        {lang === 'he' ? 'מדיניות מיקור חוץ' : 'Outsourcing Policy'} <i className="fas fa-exchange-alt"></i>
                     </div>
                     <p className="text-[9px] text-slate-400 italic">{lang === 'he' ? 'משימות מופנות לקבלני משנה בעת עומס למניעת קנסות איחור.' : 'Jobs are diverted to sub-contractors during overload to avoid late penalties.'}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                     <div className={`text-[9px] text-purple-400 uppercase font-black mb-2 flex items-center gap-2 ${lang === 'he' ? 'justify-end' : 'justify-start'}`}>
                        {lang === 'he' ? 'פרמטר האפסילון' : 'Epsilon Parameter'} <i className="fas fa-calculator"></i>
                     </div>
                     <p className="text-[9px] text-slate-400 italic">{lang === 'he' ? 'ככל ש-ε קטן יותר, הפתרון קרוב יותר לאופטימלי על חשבון זמן ריצה.' : 'Smaller ε means closer to optimal solution but more computation time.'}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
          <h3 className={`text-xl md:text-2xl font-black text-ariel-blue mb-8 flex items-center ${lang === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
            <i className={`fas fa-file-alt ${lang === 'he' ? 'ml-3' : 'mr-3'} text-ariel-turquoise`}></i> {lang === 'he' ? 'תקציר המאמר וניתוח ממצאים' : 'Article Summary & Analysis'}
          </h3>
          <div className="space-y-6 text-base md:text-lg text-slate-700 leading-relaxed text-justify">
            {lang === 'he' ? (
              <>
                <p>בעידן התעשייתי המודרני, תהליכי הייצור הופכים למבוזרים יותר ויותר. חברות נדרשות לנהל משימות מורכבות הפרוסות על פני רשת של מפעלים וקבלני משנה. הבעיה מוגדרת כ-NP-hard, שבה מספר האפשרויות גדל מעריכית.</p>
                <p>המאמר מציע פתרון מבוסס על אלגוריתם FPTAS המספק פתרון הקרוב מאוד לאופטימלי בזמן ריצה סביר. המודל לוקח בחשבון את המורכבות, הרווח, זמן הייצור ותאריך היעד של כל משימה.</p>
              </>
            ) : (
              <>
                <p>In the modern industrial era, production processes are increasingly decentralized. Companies must manage complex tasks across a network of factories and sub-contractors. The problem is NP-hard, with options growing exponentially.</p>
                <p>The research proposes an FPTAS algorithm providing a near-optimal solution in reasonable time. The model considers complexity, profit, production time, and due date for each job.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
