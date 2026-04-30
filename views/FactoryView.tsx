
import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Factory } from '../types';

interface PaperJob {
  id: number;
  complexity: number; // c_j (0-1 internally, shown as %)
  profit: number;     // p_j (shown as $K)
  dueTime: number;    // d_j (hours)
  status: 'pending' | 'main' | 'sub' | 'late';
}

export const FactoryView: React.FC = () => {
  const [epsilon, setEpsilon] = useState(0.05); // 5% distance from optimal
  const [factories, setFactories] = useState<Factory[]>([
    { id: 'f1', name: 'מפעל ראשי (Anchor)', type: 'high', icon: 'fa-industry', capacity: 120, currentLoad: 0 },
    { id: 'f2', name: 'קבלן משנה א\'', type: 'med', icon: 'fa-warehouse', capacity: 80, currentLoad: 0 },
    { id: 'f3', name: 'קבלן משנה ב\'', type: 'med', icon: 'fa-warehouse', capacity: 60, currentLoad: 0 },
    { id: 'f4', name: 'קבלן משנה ג\'', type: 'low', icon: 'fa-tools', capacity: 40, currentLoad: 0 },
  ]);

  // Generates 10 jobs as requested
  const generateJobs = () => Array(10).fill(0).map((_, i) => ({
    id: i + 1,
    complexity: Number((Math.random() * 0.8 + 0.1).toFixed(2)), // 10% to 90%
    profit: Math.floor(Math.random() * 50) + 10, // $10K to $60K
    dueTime: Math.floor(Math.random() * 50) + 20, // 20h to 70h (slightly adjusted due to more jobs)
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

    // Sort by Earliest Due Date (EDD) - a common heuristic in the paper
    const sortedJobs = [...runningJobs].sort((a, b) => a.dueTime - b.dueTime);

    for (const job of sortedJobs) {
      await new Promise(r => setTimeout(r, Math.min(300, computationDelay / 10)));
      
      const mainFactory = currentFactories[0];
      const processingTime = 6 + (job.complexity * 22); // Base + weight-based time
      
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

  // Metric coloring helper
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors">
        <i className="fas fa-arrow-right ml-2"></i> חזרה לראשי
      </Link>

      <header className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100 relative text-right">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-ariel-blue mb-2 font-display">אופטימיזציית הקצאה רב-מפעלית (2020)</h1>
            <p className="text-slate-500 font-medium mb-4 italic">Journal of Industrial and Production Engineering</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://doi.org/10.1080/21681015.2020.1801867" target="_blank" rel="noreferrer" className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md">
                <i className="fas fa-external-link-alt"></i> צפייה במאמר המקור
              </a>
              <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                <i className="fas fa-tags"></i> NP-Hard, FPTAS, Scheduling
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[160px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-widest text-center">מורכבות חישובית</div>
            <div className="text-2xl font-black text-ariel-turquoise tracking-tight">O(n³/ε)</div>
            <div className="text-[9px] text-slate-400 mt-1 italic text-center">Polynomial Approximation</div>
          </div>
        </div>
      </header>

      {/* Interactive Widget Dashboard */}
      <div className="bg-ariel-blue text-white rounded-[2.5rem] p-8 mb-12 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ariel-turquoise/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex flex-col xl:flex-row justify-between items-center mb-10 gap-8 relative z-10">
          <div className="flex items-center gap-4 text-right">
             <div className="w-14 h-14 bg-ariel-turquoise/20 rounded-2xl flex items-center justify-center text-ariel-turquoise text-3xl shadow-inner">
                <i className="fas fa-network-wired"></i>
             </div>
             <div>
                <h3 className="text-xl font-black tracking-tight font-display">סימולטור FPTAS להקצאה מבוזרת</h3>
                <p className="text-xs text-slate-400">איזון עומס מול רווח (Profit vs Workload Balance)</p>
             </div>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/10">
             <div className="text-center px-4">
                <div className="text-[10px] text-slate-300 uppercase font-black mb-2">דיוק (ε) - מרחק מאופטימום</div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="0.01" max="0.2" step="0.01" value={epsilon} 
                    onChange={(e) => setEpsilon(Number(e.target.value))}
                    className="w-32 accent-ariel-turquoise h-1.5 bg-slate-700 rounded-full" 
                  />
                  <span className="text-sm font-mono font-bold text-ariel-turquoise bg-slate-900 px-2 py-1 rounded">{(epsilon * 100).toFixed(0)}%</span>
                </div>
             </div>
             <div className="hidden md:block w-px h-10 bg-white/20"></div>
             <div className="text-center px-4">
                <div className="text-[10px] text-slate-300 uppercase font-black mb-1">רווח שנצבר (S)</div>
                <div className="text-3xl font-black text-white tracking-tighter">
                   <span className="text-ariel-turquoise">$</span>{totalProfit.toFixed(1)}<span className="text-lg ml-1">K</span>
                </div>
             </div>
             <button 
               onClick={runScheduling} disabled={isSimulating}
               className="bg-ariel-turquoise hover:bg-ariel-turquoise-dark disabled:opacity-50 text-white font-black py-4 px-10 rounded-2xl transition-all shadow-[0_0_20px_rgba(144,192,48,0.3)] flex items-center gap-3 text-sm uppercase tracking-widest"
             >
               {isSimulating ? <i className="fas fa-sync-alt animate-spin"></i> : <i className="fas fa-play-circle"></i>}
               {isSimulating ? 'מחשב...' : 'בצע אופטימיזציה'}
             </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Jobs List - Left Column */}
          <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
             <div className="flex justify-between items-center px-2 mb-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">משימות ממתינות (n=10)</h4>
                <button 
                  onClick={randomizeData} 
                  disabled={isSimulating}
                  className="text-[9px] font-bold text-ariel-turquoise hover:text-white transition-colors flex items-center gap-1"
                >
                  <i className="fas fa-sync"></i> טען דאטא חדש לניסוי
                </button>
             </div>
             {/* Height adjusted to show 10 jobs comfortably */}
             <div className="space-y-1.5 custom-scrollbar overflow-y-auto pr-2 flex-grow max-h-[580px]">
                {jobs.map(job => (
                  <div key={job.id} className={`py-1.5 px-3 rounded-xl border transition-all duration-500 flex flex-col justify-center ${job.status === 'main' ? 'bg-ariel-turquoise/10 border-ariel-turquoise/40' : (job.status === 'sub' ? 'bg-blue-500/10 border-blue-500/40' : (job.status === 'late' ? 'bg-red-500/10 border-red-500/40 opacity-50' : 'bg-white/5 border-white/10'))}`}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[9px] font-black text-slate-100 uppercase">פרויקט #{job.id}</span>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${job.status === 'main' ? 'bg-ariel-turquoise text-slate-900' : (job.status === 'sub' ? 'bg-blue-500 text-white' : (job.status === 'late' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'))}`}>
                        {job.status === 'pending' ? 'בהמתנה' : (job.status === 'main' ? 'מפעל הבית' : (job.status === 'sub' ? 'מיקור חוץ' : 'איחור'))}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold leading-none">
                       <span className={getMetricColor(job.profit, 10, 60, 'profit')}>${job.profit}K</span>
                       <span className="text-white/20">|</span>
                       <span className={getMetricColor(job.complexity, 0.1, 0.9, 'stress')}>{(job.complexity * 100).toFixed(0)}% מורכבות</span>
                       <span className="text-white/20">|</span>
                       <span className={getMetricColor(job.dueTime, 20, 70, 'stress')}>{job.dueTime}h יעד</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Factories Status - Right Column (2x2 Grid) */}
          <div className="lg:col-span-8 flex flex-col h-full">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-right">מפת קיבולת רשת (Multi-Factory Map)</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                {factories.map(f => (
                  <div key={f.id} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col group hover:border-ariel-turquoise/30 transition-all text-right">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${f.type === 'high' ? 'bg-ariel-turquoise/20 text-ariel-turquoise' : 'bg-white/10 text-slate-400'}`}>
                             <i className={`fas ${f.icon}`}></i>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black text-white">{f.name}</div>
                             <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{f.type === 'high' ? 'High Efficiency' : 'Sub-Contractor'}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[14px] font-mono font-bold text-slate-100">
                             {f.currentLoad.toFixed(1)}<span className="text-[10px] text-slate-400 ml-1">/ {f.capacity}h</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-auto">
                       <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-[2px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${f.currentLoad > f.capacity ? 'bg-red-500' : (f.currentLoad > f.capacity * 0.8 ? 'bg-orange-500' : 'bg-ariel-turquoise')}`}
                            style={{ width: `${Math.min(100, (f.currentLoad / f.capacity) * 100)}%` }}
                          />
                       </div>
                       <div className="flex justify-between mt-2 px-1">
                          <span className="text-[9px] text-slate-400 font-bold">עומס: {Math.floor((f.currentLoad / f.capacity) * 100)}%</span>
                          {f.currentLoad > f.capacity && <span className="text-[9px] text-red-400 font-black animate-pulse uppercase">Overload!</span>}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Theoretical Principles */}
             <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-right">
                   <div className="text-[10px] text-ariel-turquoise uppercase font-black mb-2 flex items-center gap-2 justify-end">
                      עיקרון אופטימיזציה <i className="fas fa-check-double"></i>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      "האלגוריתם שואף למקסם את הרווח המצטבר בתוך המפעל הראשי (Main Factory) תוך עמידה בדד-ליין של כל משימה."
                   </p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-right">
                   <div className="text-[10px] text-blue-400 uppercase font-black mb-2 flex items-center gap-2 justify-end">
                      מדיניות מיקור חוץ <i className="fas fa-exchange-alt"></i>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      "כאשר נוצר עומס, משימות מופנות לקבלני משנה. הרווח קטן בשל עלויות שינוע וניהול, אך נמנע קנס איחור."
                   </p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-right">
                   <div className="text-[10px] text-purple-400 uppercase font-black mb-2 flex items-center gap-2 justify-end">
                      פרמטר האפסילון <i className="fas fa-calculator"></i>
                   </div>
                   <p className="text-[10px] text-slate-400 leading-relaxed italic">
                      "ככל ש-ε קטן יותר, האלגוריתם בוחן יותר תתי-מרווחים דינמיים כדי למצוא פתרון הקרוב יותר לאופטימלי."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Abstract and Summary Section */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 text-right">
        <h3 className="text-2xl font-black text-ariel-blue mb-8 flex items-center justify-end font-display">
          תקציר המאמר וניתוח ממצאים <i className="fas fa-file-alt mr-3 text-ariel-turquoise"></i>
        </h3>
        
        <div className="space-y-8 text-lg text-slate-700 leading-relaxed text-justify">
          <p>
            בעידן התעשייתי המודרני, תהליכי הייצור הופכים למבוזרים (Decentralized) יותר ויותר. חברות נדרשות לנהל משימות מורכבות הפרוסות על פני רשת של מפעלים, מחלקות וקבלני משנה, כאשר לכל יחידת ייצור רמת יעילות וקיבולת שונה. אתגר מרכזי העומד בפני מנהלים הוא הקצאה חכמה של משימות שתאזן בין ניצול המשאבים הפנימיים (מפעל הבית) לבין הצורך במיקור חוץ בעת עומסי יתר. בעיה זו מוגדרת כבעיית אופטימיזציה מורכבת (NP-hard), שבה מספר האפשרויות גדל בצורה מעריכית עם מספר המשימות.
          </p>

          <p>
            המאמר מציע פתרון מבוסס על אלגוריתם קירוב פולינומי מלא – <strong>FPTAS</strong> (Fully Polynomial Time Approximation Scheme). הייחוד של אלגוריתם זה הוא היכולת לספק פתרון הקרוב מאוד לאופטימלי (במרחק של ε מהפתרון המושלם) בתוך זמן ריצה סביר. המודל המתמטי לוקח בחשבון עבור כל משימה (Job) את המורכבות שלה ($c_j$), את הרווח הצפוי מהשלמתה ($p_j$), את זמן הייצור הנדרש ($t_j$) ואת תאריך היעד (Due date, $d_j$). המטרה היא למקסם פונקציית תועלת המשלבת רווח כספי ואיזון עומסים (Workload balance) בין המפעלים.
          </p>

          <p>
            אחד החידושים במחקר הוא הכנסת פונקציית העומס $f(w)$, המשפיעה על זמן הביצוע של כל משימה. ככל שהמפעל עמוס יותר, זמן הייצור של משימות חדשות עלול להתארך בשל תחרות על משאבים. האלגוריתם שפותח פועל בשלושה שלבים: מציאת חסמים ראשוניים (Stage A), צמצום החסמים עד ליחס של 2 (Stage B), ולבסוף חלוקה של הטווח לתתי-מרווחים ומציאת הפתרון האופטימלי תוך שימוש בתכנון דינמי (Stage C). המתודולוגיה מאפשרת לקבל החלטות מבוססות נתונים בשאלה "מתי כדאי להוציא עבודה למיקור חוץ" כדי למנוע איחורים ופגיעה במוניטין.
          </p>

          <p>
            לסיכום, המחקר מוליד כלי תומך החלטה מעשי עבור מנהלי ייצור ולוגיסטיקה. השימוש בנתונים אמיתיים מחברה העוסקת בפרויקטי תשתיות רחבי היקף אישש את יעילות האלגוריתם. הממצאים הראו כי האלגוריתם מסוגל להפחית את עלויות הייצור הכוללות ולשפר את העמידה בלוחות זמנים בשיעור ניכר בהשוואה לשיטות היוריסטיות נפוצות. הכלי מאפשר למנהלים לקבוע את רמת הדיוק הרצויה ולמצוא את האיזון המושלם בין מהירות החישוב לאיכות הפתרון בסביבת ייצור דינמית ותחרותית.
          </p>
        </div>
      </div>
    </div>
  );
};



