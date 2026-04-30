import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

interface Patient {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  uncertainty: number;
  status: 'triage' | 'ed' | 'ward';
  remainingTime: number;
  totalTreatmentTime: number;
}

const FIRST_NAMES_HE = [
  'אברהם', 'יצחק', 'יעקב', 'שרה', 'רבקה', 'לאה', 'רחל', 'משה', 'אהרן', 'דוד',
  'שלמה', 'יוסף', 'בנימין', 'מרים', 'חנה', 'חיה', 'אסתר', 'רות', 'אילה', 'דבורה'
];

const FIRST_NAMES_EN = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
  'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'
];

const MAX_ED_BEDS = 10;

export const FloatingView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wardOccupancy, setWardOccupancy] = useState(40);
  const [arrivalRate, setArrivalRate] = useState(3000);
  const [treatmentSpeed, setTreatmentSpeed] = useState(1);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([lang === 'he' ? 'מערכת מוכנה' : 'System Ready']);
  const [stats, setStats] = useState({ total: 0, ed: 0, floated: 0 });

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const generatePatient = useCallback((): Patient => {
    const severity = (Math.floor(Math.random() * 5) + 1) as Patient['severity'];
    const baseTime = (6 - severity) * 15 + Math.floor(Math.random() * 20);
    const names = lang === 'he' ? FIRST_NAMES_HE : FIRST_NAMES_EN;
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: names[Math.floor(Math.random() * names.length)],
      severity,
      uncertainty: Number((Math.random() * 0.7 + 0.1).toFixed(2)),
      status: 'triage',
      remainingTime: baseTime,
      totalTreatmentTime: baseTime
    };
  }, [lang]);

  const processTriage = useCallback(() => {
    setPatients(prev => {
      const triageQueue = prev.filter(p => p.status === 'triage');
      if (triageQueue.length === 0) return prev;

      const nextPatient = triageQueue[0];
      const edCount = prev.filter(p => p.status === 'ed').length;
      const riskScore = nextPatient.severity * nextPatient.uncertainty;
      const edStress = edCount / MAX_ED_BEDS;
      const wardStress = wardOccupancy / 100;
      
      let newStatus: Patient['status'] = 'ed';
      let actionMsg = '';

      if (edCount >= MAX_ED_BEDS) {
        if (wardOccupancy < 100) {
          newStatus = 'ward';
          actionMsg = lang === 'he' ? `מלר"ד מלא: ${nextPatient.name} הועבר/ה ישירות למחלקה.` : `ER Full: ${nextPatient.name} floated to ward.`;
        } else {
          return prev;
        }
      } else if (edStress > 0.6 && riskScore < 1.8 && (edStress - wardStress) > 0.15) {
        newStatus = 'ward';
        actionMsg = lang === 'he' ? `אופטימיזציה: ${nextPatient.name} הועבר/ה למחלקה למניעת עומס.` : `Optimization: ${nextPatient.name} floated to prevent ER congestion.`;
      } else {
        newStatus = 'ed';
        actionMsg = lang === 'he' ? `${nextPatient.name} נקלט/ה במיון.` : `${nextPatient.name} admitted to ER.`;
      }

      if (actionMsg) addLog(actionMsg);
      if (newStatus === 'ward') setStats(s => ({ ...s, floated: s.floated + 1 }));
      if (newStatus === 'ed') setStats(s => ({ ...s, ed: s.ed + 1 }));

      return prev.map(p => p.id === nextPatient.id ? { ...p, status: newStatus } : p);
    });
  }, [wardOccupancy, lang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPatients(prev => prev.map(p => {
        if (p.status === 'ed' || p.status === 'ward') {
          return { ...p, remainingTime: Math.max(0, p.remainingTime - (1 * treatmentSpeed)) };
        }
        return p;
      }).filter(p => p.remainingTime > 0 || p.status === 'triage'));
    }, 1000);
    return () => clearInterval(interval);
  }, [treatmentSpeed]);

  useEffect(() => {
    if (!isAutoRunning) return;
    const interval = setInterval(() => {
      setPatients(prev => [...prev, generatePatient()]);
      setStats(s => ({ ...s, total: s.total + 1 }));
    }, arrivalRate);
    return () => clearInterval(interval);
  }, [isAutoRunning, arrivalRate, generatePatient]);

  useEffect(() => {
    const interval = setInterval(processTriage, 1000);
    return () => clearInterval(interval);
  }, [processTriage]);

  const getSeverityColor = (s: number) => {
    if (s >= 4) return 'bg-rose-500';
    if (s >= 3) return 'bg-orange-400';
    return 'bg-emerald-500';
  };

  const edPatients = patients.filter(p => p.status === 'ed');
  const wardPatients = patients.filter(p => p.status === 'ward');
  const triagePatients = patients.filter(p => p.status === 'triage');

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className={`mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit ${lang === 'he' ? 'ml-auto' : 'mr-auto'}`}>
          <i className={`fas ${lang === 'he' ? 'fa-arrow-right ml-2' : 'fa-arrow-left mr-2'}`}></i> {t.backToLab}
        </Link>

        <header className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-black text-ariel-blue mb-2">{t.simTitleFloating}</h1>
              <p className="text-slate-500 font-medium mb-4 italic">Computers & Industrial Engineering | Int. J. Prod. Econ. | OR for Health Care</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ" target="_blank" rel="noreferrer" className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md">
                  <i className="fas fa-graduation-cap"></i> Scholar
                </a>
                <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <i className="fas fa-tags"></i> Triage, Bed Management, Optimal Stopping
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[140px] w-full md:w-auto">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{lang === 'he' ? 'טווח שנים' : 'Year Span'}</div>
              <div className="text-2xl font-black text-ariel-blue tracking-tight">2015-2017</div>
            </div>
          </div>
        </header>

        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex gap-4">
              <div className="bg-slate-100 px-4 py-1 rounded-full text-[11px] font-bold text-slate-500">
                 {lang === 'he' ? 'סה"כ טופלו:' : 'Total Treated:'} {stats.ed + stats.floated}
              </div>
              <div className="bg-emerald-50 px-4 py-1 rounded-full text-[11px] font-bold text-emerald-600">
                 {lang === 'he' ? 'יחס ציפה:' : 'Float Ratio:'} {(((stats.floated / (stats.ed + stats.floated || 1))) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-ariel-blue mb-3">{lang === 'he' ? 'הגדרות סימולציה' : 'Sim Settings'}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span>{lang === 'he' ? 'קצב הגעה' : 'Arrival Rate'}</span>
                      <span className="text-ariel-turquoise">{(arrivalRate/1000).toFixed(1)}s</span>
                    </div>
                    <input type="range" min="1000" max="8000" step="500" value={arrivalRate} onChange={(e) => setArrivalRate(Number(e.target.value))} className="w-full accent-ariel-turquoise h-1 bg-slate-100 rounded-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span>{lang === 'he' ? 'מהירות טיפול' : 'Speed'}</span>
                      <span className="text-blue-500">x{treatmentSpeed}</span>
                    </div>
                    <input type="range" min="0.5" max="5" step="0.5" value={treatmentSpeed} onChange={(e) => setTreatmentSpeed(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-100 rounded-full" />
                  </div>
                </div>
              </div>
              <button onClick={() => setIsAutoRunning(!isAutoRunning)} className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${isAutoRunning ? 'bg-red-50 text-red-500' : 'bg-ariel-turquoise text-white shadow-md'}`}>
                {isAutoRunning ? (lang === 'he' ? 'עצור הזרמה' : 'Stop Arrivals') : (lang === 'he' ? 'הפעל הזרמת חולים' : 'Start Arrivals')}
              </button>
            </div>

            <div className="bg-ariel-blue p-4 rounded-2xl shadow-xl text-white lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">{lang === 'he' ? 'עומס מערכתי' : 'System Stress'}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                   <div className="text-[10px] text-slate-300 font-bold mb-1">{lang === 'he' ? 'תפוסת מחלקות רקע' : 'Ward Occupancy'}</div>
                   <input type="range" value={wardOccupancy} onChange={(e) => setWardOccupancy(Number(e.target.value))} className="w-full accent-ariel-turquoise h-1 bg-slate-900 mb-2" />
                   <div className="text-xl font-black">{wardOccupancy}%</div>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                   <div className="text-[10px] text-slate-300 font-bold mb-1">{lang === 'he' ? 'יומן אירועים' : 'Event Log'}</div>
                   <div className="space-y-1 mt-1 h-12 overflow-hidden">
                     {logs.map((log, i) => (
                       <div key={i} className={`text-[9px] truncate ${i===0 ? 'text-white font-bold' : 'text-slate-400'}`}>{log}</div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-200 overflow-x-auto">
              <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">{lang === 'he' ? 'תור קבלה' : 'Queue'} ({triagePatients.length})</h4>
              <div className="flex gap-2 pb-2">
                {triagePatients.length === 0 && <div className="text-[10px] text-slate-300 py-4 italic">Empty...</div>}
                {triagePatients.map(p => (
                  <div key={p.id} className="min-w-[40px] h-[40px] bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
                    <div className={`w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5 ${getSeverityColor(p.severity)}`}></div>
                    <i className="fas fa-user text-slate-300 text-[10px]"></i>
                    <div className="text-[7px] font-bold text-slate-600 mt-0.5 truncate w-full text-center">{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-ariel-blue mb-6 flex items-center gap-2">
                <i className="fas fa-hospital-symbol text-blue-500"></i> {lang === 'he' ? 'חדר מיון' : 'Emergency Dept'} <span className="text-xs text-slate-400">({edPatients.length}/{MAX_ED_BEDS})</span>
              </h3>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {Array.from({ length: MAX_ED_BEDS }).map((_, i) => {
                  const p = edPatients[i];
                  return (
                    <div key={i} className={`aspect-square rounded-xl md:rounded-2xl border flex flex-col items-center justify-center p-1 md:p-2 relative transition-all ${p ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                      {p ? (
                        <>
                          <div className="w-full h-1 absolute top-0 left-0 rounded-t-2xl overflow-hidden">
                             <div className="h-full bg-blue-500 transition-all" style={{ width: `${(p.remainingTime/p.totalTreatmentTime)*100}%` }}></div>
                          </div>
                          <i className={`fas fa-procedures text-xs md:text-sm mb-1 ${p.severity >= 4 ? 'text-rose-500' : 'text-blue-400'}`}></i>
                          <div className="text-[8px] md:text-[9px] font-black text-slate-700 mb-0.5 truncate w-full text-center">{p.name}</div>
                          <div className="text-[7px] md:text-[8px] font-bold text-slate-400">⏳{Math.ceil(p.remainingTime)}m</div>
                        </>
                      ) : <span className="text-[8px] font-bold text-slate-200">#{i+1}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-emerald-50/20 p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-emerald-100">
              <h3 className="text-lg font-black text-ariel-blue mb-6 flex items-center gap-2">
                <i className="fas fa-bed text-emerald-500"></i> {lang === 'he' ? 'מטופלים ב"ציפה"' : 'Floated Patients'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] md:max-h-[200px] overflow-y-auto pr-2">
                {wardPatients.length === 0 && (
                  <div className="col-span-2 text-center py-6 md:py-10 opacity-30">
                    <i className="fas fa-check-circle text-3xl md:text-4xl mb-2 text-emerald-200"></i>
                    <p className="text-[10px] md:text-[11px] font-bold text-slate-400">No floated patients</p>
                  </div>
                )}
                {wardPatients.map(p => (
                  <div key={p.id} className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 text-[10px]">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] md:text-[10px] font-black text-slate-800 leading-none mb-1 truncate">{p.name}</div>
                        <div className="text-[7px] md:text-[8px] text-slate-400">Exit: <span className="font-bold text-emerald-600">{Math.ceil(p.remainingTime)}m</span></div>
                      </div>
                    </div>
                    <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${getSeverityColor(p.severity)}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
          <h3 className={`text-xl md:text-2xl font-black text-ariel-blue mb-8 flex items-center ${lang === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
            <i className={`fas fa-file-medical ${lang === 'he' ? 'ml-3' : 'mr-3'} text-ariel-turquoise`}></i> {lang === 'he' ? 'תקציר המאמר וניתוח ממצאים' : 'Article Summary & Analysis'}
          </h3>
          <div className="space-y-6 text-base md:text-lg text-slate-700 leading-relaxed text-justify">
            {lang === 'he' ? (
              <>
                <p>בעיית הצפיפות בחדרי המיון היא אחד האתגרים המרכזיים במערכות בריאות מודרניות. סדרת מחקרים זו מציעה גישה לניהול עומסים באמצעות מודל "המטופל הצף". חולים יציבים מועברים למחלקות היעד עוד בטרם התפנתה מיטה רשמית.</p>
                <p>המודל המתמטי מתבסס על אופטימיזציה תחת אי-וודאות. המחקר מראה כי שילוב של רופא במיון (PIT) עם חוקי עצירה אופטימליים מאפשר למקסם את הדיוק באבחון הראשוני ולהקטין את זמן ההמתנה.</p>
              </>
            ) : (
              <>
                <p>ER overcrowding is a major challenge in modern healthcare. This series of studies proposes a workload management approach via the "Floating Patients" model. Stable patients are transferred to target wards before a formal bed is available.</p>
                <p>The mathematical model is based on optimization under uncertainty. Research shows that combining a Physician In Triage (PIT) with optimal stopping rules maximizes initial diagnosis accuracy and reduces wait times.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
