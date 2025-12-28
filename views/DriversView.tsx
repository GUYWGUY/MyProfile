
import React, { useState, useEffect, useRef } from 'react';

export const DriversView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [scheduleDelay, setScheduleDelay] = useState(20);
  const [routeComplexity, setRouteComplexity] = useState(30);
  const [passengerLoad, setPassengerLoad] = useState(40);
  
  const [chartData, setChartData] = useState<{hr: number[], eda: number[], temp: number[]}>( {
    hr: Array(40).fill(75),
    eda: Array(40).fill(0.8),
    temp: Array(40).fill(32)
  });

  const timerRef = useRef<number | null>(null);

  // Core logic based on paper findings (Section 3.2)
  const calculateCurrentMetrics = () => {
    const stressFactor = (scheduleDelay * 0.5) + (routeComplexity * 0.3) + (passengerLoad * 0.2);
    
    // Heart Rate: increases with stress (Normal 60-100, Stress 100-210)
    const currentHR = 72 + (stressFactor * 0.8) + (Math.random() * 4);
    
    // EDA (Sweat): increases significantly with stress (Normal 0.8, Stress up to 34.7 µS)
    const currentEDA = 0.5 + (Math.pow(stressFactor, 1.5) / 150) + (Math.random() * (stressFactor/50));
    
    // Temperature: drops with stress due to vasoconstriction
    const currentTemp = 33 - (stressFactor * 0.05) + (Math.random() * 0.3);
    
    return { currentHR, currentEDA, currentTemp, stressFactor };
  };

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      const { currentHR, currentEDA, currentTemp } = calculateCurrentMetrics();
      
      setChartData(prev => ({
        hr: [...prev.hr.slice(1), currentHR],
        eda: [...prev.eda.slice(1), currentEDA],
        temp: [...prev.temp.slice(1), currentTemp]
      }));
    }, 400);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [scheduleDelay, routeComplexity, passengerLoad]);

  const { currentHR, currentEDA, currentTemp, stressFactor } = calculateCurrentMetrics();

  // Helper for dynamic bar colors
  const getHRColor = (val: number) => {
    if (val > 130) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    if (val > 100) return 'bg-orange-400';
    return 'bg-ariel-green';
  };

  const getEDAColor = (val: number) => {
    if (val > 5) return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
    if (val > 2) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  // Management Insights based on paper's practical guidance
  const getInsight = () => {
    if (stressFactor > 75) return { 
      text: "עומס קריטי: נדרשת התערבות מוקדנית מיידית והחלפת נהג", 
      color: "text-red-400", 
      icon: "fa-exclamation-triangle",
      pulse: "animate-pulse"
    };
    if (stressFactor > 45) return { 
      text: "התראה: רמת סטרס גבוהה. מומלץ להאריך זמן Layover בסוף הקו", 
      color: "text-yellow-400", 
      icon: "fa-clock",
      pulse: ""
    };
    return { 
      text: "סטטוס תקין: מדדים פיזיולוגיים בטווח הנורמה האישי", 
      color: "text-ariel-green", 
      icon: "fa-check-circle",
      pulse: ""
    };
  };

  const insight = getInsight();

  return (
    <div className={`max-w-5xl mx-auto px-4 py-8 transition-colors duration-1000 ${stressFactor > 80 ? 'bg-red-950/20' : ''}`}>
      <button onClick={onBack} className="mb-6 flex items-center text-slate-500 hover:text-ariel-green font-bold transition-colors">
        <i className="fas fa-arrow-right ml-2"></i> חזרה לראשי
      </button>

      <header className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ariel-green mb-8 border border-slate-100 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-gray-800 mb-2">רווחת נהגי תחבורה ציבורית (2025)</h1>
            <p className="text-slate-500 font-medium mb-4">Journal of Public Transportation, Elsevier</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://doi.org/10.1016/j.jpubtr.2025.100129" target="_blank" rel="noreferrer" className="bg-ariel-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md">
                <i className="fas fa-external-link-alt"></i> ScienceDirect
              </a>
              <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ" target="_blank" rel="noreferrer" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">
                <i className="fas fa-graduation-cap"></i> Google Scholar
              </a>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">טכנולוגיית ניטור</div>
            <div className="text-xl font-black text-slate-800 tracking-tight">Empatica E4</div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left Column: Operational Inputs (Exogenous Data) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8">
          <div>
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <i className="fas fa-bus-alt"></i> נתונים תפעוליים (AVL/AFC)
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">איחור בלוז (דקות)</label>
                  <span className={`text-xs font-mono font-bold ${scheduleDelay > 50 ? 'text-red-500' : 'text-slate-400'}`}>{Math.floor(scheduleDelay/2)}m</span>
                </div>
                <input type="range" value={scheduleDelay} onChange={(e) => setScheduleDelay(Number(e.target.value))} className="w-full accent-ariel-green h-1.5 bg-slate-100 rounded-lg" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">עומס נוסעים (נפח כרטוס)</label>
                  <span className="text-xs font-mono font-bold text-blue-500">{passengerLoad}%</span>
                </div>
                <input type="range" value={passengerLoad} onChange={(e) => setPassengerLoad(Number(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">מורכבות המסלול (GIS)</label>
                  <span className="text-xs font-mono font-bold text-orange-500">{routeComplexity}%</span>
                </div>
                <input type="range" value={routeComplexity} onChange={(e) => setRouteComplexity(Number(e.target.value))} className="w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg" />
              </div>
            </div>
          </div>

          <div className={`mt-auto p-5 rounded-2xl border transition-colors duration-500 ${stressFactor > 45 ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'}`}>
             <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">ציון שביעות רצון משוער (DCM)</div>
             <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-slate-800">{Math.max(15, 100 - Math.floor(stressFactor)).toFixed(0)}%</div>
                <div className="text-[10px] font-bold text-slate-500">Satisfaction Score</div>
             </div>
          </div>
        </div>

        {/* Right Column: Physiological Dashboard (Endogenous Data) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
               <i className={`fas fa-circle text-[8px] ${insight.color} animate-pulse`}></i> ניטור פיזיולוגי (BIOMETRIC)
             </h3>
             <div className="flex gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Heart Rate</div>
                  <div className={`text-2xl font-mono font-bold transition-colors ${currentHR > 120 ? 'text-red-500' : 'text-ariel-green'}`}>
                    {currentHR.toFixed(0)} <span className="text-[10px] font-sans">BPM</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Skin Conductance</div>
                  <div className={`text-2xl font-mono font-bold transition-colors ${currentEDA > 4 ? 'text-purple-400' : 'text-yellow-400'}`}>
                    {currentEDA.toFixed(2)} <span className="text-[10px] font-sans">µS</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Visual Graphs mimicking Fig 3 in Paper with Dynamic Colors */}
          <div className="space-y-6 relative z-10">
            {/* HR Graph */}
            <div className="h-24 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 relative">
               <div className="absolute top-1 right-2 text-[8px] text-slate-600 font-bold uppercase tracking-tighter">HR Real-time Waveform</div>
               <div className="flex items-end gap-[1px] h-full w-full">
                 {chartData.hr.map((val, i) => (
                   <div key={i} className={`w-full rounded-t-[1px] transition-all duration-300 ${getHRColor(val)}`} style={{ height: `${Math.max(5, (val-40)*0.7)}%` }}></div>
                 ))}
               </div>
            </div>

            {/* EDA Graph */}
            <div className="h-24 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 relative">
               <div className="absolute top-1 right-2 text-[8px] text-slate-600 font-bold uppercase tracking-tighter">EDA (Electrodermal Arousal)</div>
               <div className="flex items-end gap-[1px] h-full w-full">
                 {chartData.eda.map((val, i) => (
                   <div key={i} className={`w-full rounded-t-[1px] transition-all duration-300 ${getEDAColor(val)}`} style={{ height: `${Math.min(100, Math.max(5, val * 15))}%` }}></div>
                 ))}
               </div>
            </div>

            {/* Recommendation Alert Box */}
            <div className={`mt-8 p-5 rounded-2xl border bg-slate-950/40 backdrop-blur-xl flex items-center gap-5 transition-all duration-500 ${insight.color.replace('text', 'border')} ${insight.pulse}`}>
               <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg bg-slate-900 ${insight.color}`}>
                  <i className={`fas ${insight.icon}`}></i>
               </div>
               <div className="flex-grow">
                  <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">מערכת תומכת החלטה (Decision Support Insight)</div>
                  <div className={`font-black text-base md:text-lg leading-tight ${insight.color}`}>{insight.text}</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Research Paper Text Summary */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-black text-ariel-green mb-8 flex items-center">
          <i className="fas fa-file-alt ml-3 text-ariel-green"></i> תקציר המאמר וניתוח ממצאים
        </h3>
        
        <div className="space-y-8 text-lg text-slate-700 leading-relaxed text-justify">
          <p>
            רווחתם של נהגי תחבורה ציבורית היא גורם קריטי לתפעול בטוח ויעיל של מערכות תחבורה עירוניות. נהגים מתמודדים מדי יום עם תנאי עבודה תובעניים הכוללים משמרות ארוכות, תנועה כבדה ועמידה בלוחות זמנים קשיחים, אשר תורמים לרמות גבוהות של דחק תעסוקתי. מחקר זה מציע מסגרת עבודה (Framework) חדשנית לאיסוף והיתוך נתונים, המאפשרת הערכה אובייקטיבית של מצב הנהג באמצעות שילוב של מדדים פיזיולוגיים ונתונים תפעוליים ממערכות ניהול הצי.
          </p>

          <p>
            המתודולוגיה המוצעת מתבססת על שימוש בצמידים חכמים ברמה רפואית (Empatica E4) המנטרים בזמן אמת מדדים כגון דופק (HR), מוליכות עור (EDA) וטמפרטורת עור. הנתונים הפיזיולוגיים מוצמדים לנתוני מיקום רכב אוטומטי (AVL) ומערכות כרטוס (AFC). היתרון המרכזי בגישה זו הוא המעבר מהערכות סובייקטיביות (שאלונים) לניטור רציף ואובייקטיבי המאפשר לזהות "אירועי דחק" ודפוסי שחיקה תוך כדי נהיגה בפועל, ללא הפרעה לעבודת הנהג.
          </p>

          <p>
            באמצעות שימוש במודלים של למידת מכונה (Machine Learning) כגון Random Forests ורשתות עצביות, המחקר הצליח לחזות את המצב הפיזיולוגי של הנהג על סמך נתוני הדרך בלבד. הממצאים מצביעים על מתאם מובהק בין מדדי שירות, כגון משך זמן ההפסקה (Layover duration) ומורכבות המסלול, לבין רמת הסטרס של הנהג. לדוגמה, סטיות משמעותיות בין זמן הנסיעה המתוכנן לביצוע בפועל נמצאו כמנבאות חזקות לעלייה חדה במדדי העוררות והלחץ של הנהגים.
          </p>

          <p>
            לסיכום, המחקר מספק כלים מעשיים למקבלי החלטות בתחום התחבורה לשיפור התכנון המבצעי. הבנת ההשפעה של עיצוב הקווים ולוחות הזמנים על בריאות הנהג מאפשרת לבצע אופטימיזציה לא רק של היעילות הכלכלית, אלא גם של בטיחות הנסיעה. הטמעת מערכות ניטור אלו יכולה לשמש כ"מערכת התראה מוקדמת" המזהה נהגים במצבי עייפות קיצונית וממליצה על הפסקות יזומות או שינוי שיבוצים, ובכך תורמת באופן ישיר להפחתת תאונות דרכים ולשיפור איכות השירות.
          </p>
        </div>
      </div>
    </div>
  );
};
