import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

export const DriversView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [scheduleDelay, setScheduleDelay] = useState(20);
  const [routeComplexity, setRouteComplexity] = useState(30);
  const [passengerLoad, setPassengerLoad] = useState(40);
  const [chartData, setChartData] = useState<{hr: number[], eda: number[], temp: number[]}>( {
    hr: Array(40).fill(75),
    eda: Array(40).fill(0.8),
    temp: Array(40).fill(32)
  });
  const timerRef = useRef<number | null>(null);

  const calculateCurrentMetrics = () => {
    const stressFactor = (scheduleDelay * 0.5) + (routeComplexity * 0.3) + (passengerLoad * 0.2);
    const currentHR = 72 + (stressFactor * 0.8) + (Math.random() * 4);
    const currentEDA = 0.5 + (Math.pow(stressFactor, 1.5) / 150) + (Math.random() * (stressFactor/50));
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

  const getHRColor = (val: number) => {
    if (val > 130) return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
    if (val > 100) return 'bg-orange-400';
    return 'bg-ariel-turquoise';
  };

  const getEDAColor = (val: number) => {
    if (val > 5) return 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]';
    if (val > 2) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  const getInsight = () => {
    if (stressFactor > 75) return { 
      text: lang === 'he' ? "עומס קריטי: נדרשת התערבות מוקדנית מיידית והחלפת נהג" : "Critical Load: Immediate dispatcher intervention and driver replacement required", 
      color: "text-red-400", icon: "fa-exclamation-triangle", pulse: "animate-pulse"
    };
    if (stressFactor > 45) return { 
      text: lang === 'he' ? "התראה: רמת סטרס גבוהה. מומלץ להאריך זמן Layover בסוף הקו" : "Alert: High stress level. Recommend extending layover time at route end", 
      color: "text-yellow-400", icon: "fa-clock", pulse: ""
    };
    return { 
      text: lang === 'he' ? "סטטוס תקין: מדדים פיזיולוגיים בטווח הנורמה האישי" : "Normal Status: Physiological metrics within individual normal range", 
      color: "text-ariel-turquoise", icon: "fa-check-circle", pulse: ""
    };
  };

  const insight = getInsight();

  return (
    <div className={`min-h-screen bg-slate-50 p-4 md:p-8 transition-colors duration-1000 ${stressFactor > 80 ? 'bg-red-950/10' : ''}`}>
      <div className="max-w-5xl mx-auto">
        <Link to="/" className={`mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit ${lang === 'he' ? 'ml-auto' : 'mr-auto'}`}>
          <i className={`fas ${lang === 'he' ? 'fa-arrow-right ml-2' : 'fa-arrow-left mr-2'}`}></i> {t.backToLab}
        </Link>

        <header className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-black text-ariel-blue mb-2">{t.simTitleDrivers} (2025)</h1>
              <p className="text-slate-500 font-medium mb-4">Journal of Public Transportation, Elsevier</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://doi.org/10.1016/j.jpubtr.2025.100129" target="_blank" rel="noreferrer" className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md">
                  <i className="fas fa-external-link-alt"></i> ScienceDirect
                </a>
                <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ" target="_blank" rel="noreferrer" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200">
                  <i className="fas fa-graduation-cap"></i> Scholar
                </a>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{lang === 'he' ? 'טכנולוגיית ניטור' : 'Monitoring Tech'}</div>
              <div className="text-xl font-black text-ariel-blue tracking-tight">Empatica E4</div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                <i className="fas fa-bus-alt"></i> {lang === 'he' ? 'נתונים תפעוליים' : 'Operational Data'} (AVL/AFC)
              </h3>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600">{lang === 'he' ? 'איחור בלוז (דקות)' : 'Schedule Delay (min)'}</label>
                    <span className={`text-xs font-mono font-bold ${scheduleDelay > 50 ? 'text-red-500' : 'text-slate-400'}`}>{Math.floor(scheduleDelay/2)}m</span>
                  </div>
                  <input type="range" value={scheduleDelay} onChange={(e) => setScheduleDelay(Number(e.target.value))} className="w-full accent-ariel-turquoise h-1.5 bg-slate-100 rounded-lg" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600">{lang === 'he' ? 'עומס נוסעים' : 'Passenger Load'}</label>
                    <span className="text-xs font-mono font-bold text-blue-500">{passengerLoad}%</span>
                  </div>
                  <input type="range" value={passengerLoad} onChange={(e) => setPassengerLoad(Number(e.target.value))} className="w-full accent-blue-500 h-1.5 bg-slate-100 rounded-lg" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600">{lang === 'he' ? 'מורכבות המסלול' : 'Route Complexity'}</label>
                    <span className="text-xs font-mono font-bold text-orange-500">{routeComplexity}%</span>
                  </div>
                  <input type="range" value={routeComplexity} onChange={(e) => setRouteComplexity(Number(e.target.value))} className="w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
            <div className={`mt-auto p-5 rounded-2xl border transition-colors duration-500 ${stressFactor > 45 ? 'bg-orange-50 border-orange-200' : 'bg-ariel-turquoise/10 border-ariel-turquoise/20'}`}>
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{lang === 'he' ? 'ציון שביעות רצון משוער' : 'Estimated Satisfaction (DCM)'}</div>
              <div className="flex items-baseline gap-1">
                <div className="text-3xl font-black text-ariel-blue">{Math.max(15, 100 - Math.floor(stressFactor)).toFixed(0)}%</div>
                <div className="text-[10px] font-bold text-slate-500">Score</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-ariel-blue rounded-3xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10 gap-4">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <i className={`fas fa-circle text-[8px] ${insight.color} animate-pulse`}></i> {lang === 'he' ? 'ניטור פיזיולוגי' : 'Biometric Monitoring'}
               </h3>
               <div className="flex gap-6">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">HR</div>
                    <div className={`text-xl md:text-2xl font-mono font-bold transition-colors ${currentHR > 120 ? 'text-red-500' : 'text-ariel-turquoise'}`}>
                      {currentHR.toFixed(0)} <span className="text-[10px] font-sans">BPM</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">EDA</div>
                    <div className={`text-xl md:text-2xl font-mono font-bold transition-colors ${currentEDA > 4 ? 'text-purple-400' : 'text-yellow-400'}`}>
                      {currentEDA.toFixed(2)} <span className="text-[10px] font-sans">µS</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="h-24 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 relative">
                 <div className="absolute top-1 right-2 text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Real-time HR</div>
                 <div className="flex items-end gap-[1px] h-full w-full">
                   {chartData.hr.map((val, i) => (
                     <div key={i} className={`w-full rounded-t-[1px] transition-all duration-300 ${getHRColor(val)}`} style={{ height: `${Math.max(5, (val-40)*0.7)}%` }}></div>
                   ))}
                 </div>
              </div>
              <div className="h-24 w-full bg-slate-950/50 rounded-xl border border-slate-800 p-2 relative">
                 <div className="absolute top-1 right-2 text-[8px] text-slate-600 font-bold uppercase tracking-tighter">Real-time EDA</div>
                 <div className="flex items-end gap-[1px] h-full w-full">
                   {chartData.eda.map((val, i) => (
                     <div key={i} className={`w-full rounded-t-[1px] transition-all duration-300 ${getEDAColor(val)}`} style={{ height: `${Math.min(100, Math.max(5, val * 15))}%` }}></div>
                   ))}
                 </div>
              </div>

              <div className={`mt-8 p-4 md:p-5 rounded-2xl border bg-slate-950/40 backdrop-blur-xl flex items-center gap-4 md:gap-5 transition-all duration-500 ${insight.color.replace('text', 'border')} ${insight.pulse}`}>
                 <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full flex items-center justify-center text-xl md:text-2xl shadow-lg bg-slate-900 ${insight.color}`}>
                    <i className={`fas ${insight.icon}`}></i>
                 </div>
                 <div className="flex-grow">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-widest">Decision Support Insight</div>
                    <div className={`font-black text-sm md:text-lg leading-tight ${insight.color}`}>{insight.text}</div>
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
                <p>רווחתם של נהגי תחבורה ציבורית היא גורם קריטי לתפעול בטוח ויעיל של מערכות תחבורה עירוניות. מחקר זה מציע מסגרת עבודה חדשנית להערכה אובייקטיבית של מצב הנהג באמצעות שילוב של מדדים פיזיולוגיים ונתונים תפעוליים.</p>
                <p>המתודולוגיה המוצעת מתבססת על שימוש בצמידים חכמים ברמה רפואית המנטרים בזמן אמת מדדים כגון דופק ומוליכות עור. הנתונים הפיזיולוגיים מוצמדים לנתוני מיקום רכב אוטומטי (AVL). הממצאים מצביעים על מתאם מובהק בין מדדי שירות לבין רמת הסטרס של הנהג.</p>
              </>
            ) : (
              <>
                <p>The well-being of public transport drivers is critical for the safe and efficient operation of urban transportation systems. This research proposes an innovative framework for the objective assessment of driver status by combining physiological metrics and operational data.</p>
                <p>The proposed methodology relies on medical-grade smart bracelets monitoring real-time metrics such as heart rate and skin conductance. These physiological data are paired with Automatic Vehicle Location (AVL) data. Findings indicate a significant correlation between service metrics and driver stress levels.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
