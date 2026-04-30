
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5; // w_j
  uncertainty: number;        // u_j (0-1)
  status: 'triage' | 'ed' | 'ward';
  remainingTime: number;      // דקות שנותרו לטיפול
  totalTreatmentTime: number;
}

const FIRST_NAMES = [
  'אברהם', 'יצחק', 'יעקב', 'שרה', 'רבקה', 'לאה', 'רחל', 'משה', 'אהרן', 'דוד',
  'שלמה', 'יוסף', 'בנימין', 'מרים', 'חנה', 'חיה', 'אסתר', 'רות', 'אילה', 'דבורה',
  'נחמה', 'צפורה', 'יהודה', 'שמעון', 'לוי', 'ראובן', 'נפתלי', 'גד', 'אשר', 'דן',
  'זבולון', 'יוספה', 'שלומית', 'פנינה', 'יקירה', 'ברכה', 'מזל', 'שמואל', 'אליעזר', 'מנחם',
  'פנחס', 'מאיר', 'חיים', 'ישראל', 'אריה', 'זאב', 'דב', 'עופר', 'ירון', 'יובל'
];

const MAX_ED_BEDS = 10;

export const FloatingView: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [wardOccupancy, setWardOccupancy] = useState(40);
  const [arrivalRate, setArrivalRate] = useState(3000);
  const [treatmentSpeed, setTreatmentSpeed] = useState(1);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>(['מערכת מוכנה']);
  const [stats, setStats] = useState({ total: 0, ed: 0, floated: 0 });

  const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 3));

  const generatePatient = useCallback((): Patient => {
    const severity = (Math.floor(Math.random() * 5) + 1) as Patient['severity'];
    const baseTime = (6 - severity) * 15 + Math.floor(Math.random() * 20);
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)],
      severity,
      uncertainty: Number((Math.random() * 0.7 + 0.1).toFixed(2)),
      status: 'triage',
      remainingTime: baseTime,
      totalTreatmentTime: baseTime
    };
  }, []);

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
          actionMsg = `מלר"ד מלא: ${nextPatient.name} הועבר/ה ישירות למחלקה.`;
        } else {
          return prev;
        }
      } else if (edStress > 0.6 && riskScore < 1.8 && (edStress - wardStress) > 0.15) {
        newStatus = 'ward';
        actionMsg = `אופטימיזציה: ${nextPatient.name} הועבר/ה למחלקה למניעת עומס במיון.`;
      } else {
        newStatus = 'ed';
        actionMsg = `${nextPatient.name} נקלט/ה במיון.`;
      }

      if (actionMsg) addLog(actionMsg);
      if (newStatus === 'ward') setStats(s => ({ ...s, floated: s.floated + 1 }));
      if (newStatus === 'ed') setStats(s => ({ ...s, ed: s.ed + 1 }));

      return prev.map(p => p.id === nextPatient.id ? { ...p, status: newStatus } : p);
    });
  }, [wardOccupancy]);

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
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-right" dir="rtl">
      <Link to="/" className="mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors">
        <i className="fas fa-arrow-right ml-2"></i> חזרה לראשי
      </Link>

      <header className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100 relative text-right">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-ariel-blue mb-2 font-display">שיטת "המטופל הצף" (Floating Patients)</h1>
            <p className="text-slate-500 font-medium mb-4 italic">Computers & Industrial Engineering | Int. J. Prod. Econ. | OR for Health Care</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ" 
                target="_blank" 
                rel="noreferrer"
                className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-graduation-cap"></i> פרופיל Google Scholar
              </a>
              <div className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <i className="fas fa-tags"></i> Triage Optimization, Bed Management, Optimal Stopping
              </div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">טווח שנים</div>
            <div className="text-2xl font-black text-ariel-blue tracking-tight">2015-2017</div>
            <div className="text-[9px] text-slate-400 mt-1 italic">3 Core Papers</div>
          </div>
        </div>
      </header>

      {/* THE WIDGET (UNTOUCHED LOGIC & STYLE) */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="bg-slate-100 px-4 py-1 rounded-full text-[11px] font-bold text-slate-500 border border-slate-200">
               סה"כ טופלו: {stats.ed + stats.floated}
            </div>
            <div className="bg-emerald-50 px-4 py-1 rounded-full text-[11px] font-bold text-emerald-600 border border-emerald-100">
               יחס ציפה: {(((stats.floated / (stats.ed + stats.floated || 1))) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-ariel-blue mb-3 tracking-tight">הגדרות סימולציה</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>קצב הגעה</span>
                    <span className="text-ariel-turquoise">{(arrivalRate/1000).toFixed(1)} ש'</span>
                  </div>
                  <input type="range" min="1000" max="8000" step="500" value={arrivalRate} onChange={(e) => setArrivalRate(Number(e.target.value))} className="w-full accent-ariel-turquoise h-1 bg-slate-100 rounded-full" />
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span>מהירות טיפול</span>
                    <span className="text-blue-500">x{treatmentSpeed}</span>
                  </div>
                  <input type="range" min="0.5" max="5" step="0.5" value={treatmentSpeed} onChange={(e) => setTreatmentSpeed(Number(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsAutoRunning(!isAutoRunning)}
              className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition-all ${isAutoRunning ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-ariel-turquoise text-white shadow-md'}`}
            >
              {isAutoRunning ? 'עצור הזרמה' : 'הפעל הזרמת חולים'}
            </button>
          </div>

          <div className="bg-ariel-blue p-4 rounded-2xl shadow-xl text-white lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">מדדי עומס מערכתיים</h3>
               <div className="text-[10px] text-ariel-turquoise font-mono">ΔC: {Math.abs((edPatients.length/MAX_ED_BEDS) - (wardOccupancy/100)).toFixed(2)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                 <div className="text-[10px] text-slate-300 font-bold mb-1">עומס מחלקות רקע</div>
                 <input type="range" value={wardOccupancy} onChange={(e) => setWardOccupancy(Number(e.target.value))} className="w-full accent-ariel-turquoise h-1 bg-slate-900 mb-2" />
                 <div className="text-xl font-black">{wardOccupancy}%</div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                 <div className="text-[10px] text-slate-300 font-bold mb-1">יומן אירועים</div>
                 <div className="space-y-1 mt-1">
                   {logs.map((log, i) => (
                     <div key={i} className={`text-[9px] truncate ${i===0 ? 'text-white font-bold' : 'text-slate-400'}`}>{log}</div>
                   ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border-2 border-dashed border-slate-200">
            <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">תור קבלה ({triagePatients.length})</h4>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
              {triagePatients.length === 0 && <div className="text-[10px] text-slate-300 py-4 italic">אין ממתינים...</div>}
              {triagePatients.map(p => (
                <div key={p.id} className="min-w-[50px] h-[50px] bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col items-center justify-center relative group">
                  <div className={`w-2 h-2 rounded-full absolute -top-1 -right-1 ${getSeverityColor(p.severity)}`}></div>
                  <i className="fas fa-user text-slate-300 text-xs"></i>
                  <div className="text-[8px] font-bold text-slate-600 mt-1">{p.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-ariel-blue flex items-center gap-2 text-right">
                <i className="fas fa-hospital-symbol text-blue-500"></i> חדר מיון <span className="text-xs text-slate-400 font-normal">({edPatients.length}/{MAX_ED_BEDS})</span>
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: MAX_ED_BEDS }).map((_, i) => {
                const p = edPatients[i];
                return (
                  <div key={i} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 relative transition-all duration-500 ${p ? 'bg-blue-50/30 border-blue-100' : 'bg-slate-50 border-slate-100 border-dashed'}`}>
                    {p ? (
                      <>
                        <div className={`w-full h-1 absolute top-0 left-0 rounded-t-2xl overflow-hidden`}>
                           <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(p.remainingTime/p.totalTreatmentTime)*100}%` }}></div>
                        </div>
                        <i className={`fas fa-procedures text-sm mb-1 ${p.severity >= 4 ? 'text-rose-500' : 'text-blue-400'}`}></i>
                        <div className="text-[9px] font-black text-slate-700 mb-0.5">{p.name}</div>
                        <div className="text-[8px] font-bold text-slate-400">⏳{Math.ceil(p.remainingTime)}m</div>
                      </>
                    ) : <span className="text-[8px] font-bold text-slate-200 uppercase tracking-tighter italic">{i+1}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-50/20 p-6 rounded-[2.5rem] border border-emerald-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-ariel-blue flex items-center gap-2 text-right">
                <i className="fas fa-bed text-emerald-500"></i> מטופלים ב"ציפה"
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto custom-scrollbar pl-2">
              {wardPatients.length === 0 && (
                <div className="col-span-2 text-center py-10 opacity-30">
                  <i className="fas fa-check-circle text-4xl mb-2 text-emerald-200"></i>
                  <p className="text-[11px] font-bold text-slate-400">אין חולים במצב ציפה</p>
                </div>
              )}
              {wardPatients.map(p => (
                <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500 text-xs">
                      <i className="fas fa-user-md"></i>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-800 leading-none mb-1">{p.name}</div>
                      <div className="text-[8px] text-slate-400">שחרור בעוד: <span className="font-bold text-emerald-600">{Math.ceil(p.remainingTime)}m</span></div>
                    </div>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${getSeverityColor(p.severity)}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FULL ACADEMIC SUMMARY (REPLACES OLD TEXT) */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-black text-ariel-blue mb-8 flex items-center font-display">
          <i className="fas fa-file-medical ml-3 text-ariel-turquoise"></i> גוף המחקר וניתוח אלגוריתמי
        </h3>
        
        <div className="space-y-8 text-lg text-slate-700 leading-relaxed text-justify">
          <p>
            בעיית הצפיפות בחדרי המיון (ED Overcrowding) היא אחד האתגרים המרכזיים במערכות בריאות מודרניות. תפוסה גבוהה במיון מקושרת סטטיסטית לעלייה בשיעורי התמותה, הארכת זמני השהייה הכלליים ופגיעה בחוויית המטופל. סדרת מחקרים זו (2015-2017) מציעה גישה פורצת דרך לניהול עומסים באמצעות מודל <strong>"המטופל הצף" (Floating Patients)</strong>. לפי גישה זו, חולים יציבים המיועדים לאשפוז מועברים למחלקות היעד עוד בטרם התפנתה עבורם מיטה רשמית, ובכך "משחררים" משאבים קריטיים במלר"ד לטובת מקרים דחופים יותר.
          </p>

          <p>
            המודל המתמטי שפותח מתבסס על אופטימיזציה של תהליך קבלת ההחלטות תחת תנאי אי-וודאות. המאמרים בוחנים את תפקיד ה-<strong>PIT (Physician In Triage)</strong> – הצבת רופא בכיר כבר בשלב המיון הראשוני. מחקר משנת 2015 הראה כי שימוש ב-PIT בשילוב עם חוקי עצירה אופטימליים (Optimal Stopping) מאפשר למקסם את הדיוק באבחון הראשוני ולהקטין את זמן ההמתנה לרופא בשיעור ניכר. האלגוריתם המוטמע בסימולציה לעיל מדמה את הליך קבלת ההחלטות הזה, המאזן בין חומרת המצב הקליני של החולה ($w_j$) לבין רמת אי-הוודאות לגבי האבחנה שלו ($u_j$).
          </p>

          <p>
            אחד החידושים המרכזיים במחקר משנת 2017 הוא הגדרת מדד ה-<strong>Crowding Balance</strong> ($\Delta C$). המודל מחשב את יחס העומס בין המיון למחלקות האשפוז וקובע סף אופטימלי להעברת חולים. השימוש באלגוריתמי קירוב (FPTAS) מאפשר לספק פתרונות כמעט אופטימליים בזמן אמת, גם כאשר מספר המשתנים והחולים גדול. הממצאים האמפיריים, שהתבססו על נתוני אמת מבתי חולים מרכזיים, הצביעו על כך ששימוש בשיטה זו יכול להוביל לשיפור של כ-21% במדדי ה-LOS (Length of Stay) המצטברים.
          </p>

          <p>
            לסיכום, המחקר מוכיח כי ניהול עומסים אינו בעיה "מקומית" של חדר המיון אלא אתגר רשתי הדורש סנכרון אלגוריתמי בין כלל מחלקות בית החולים. יישום של מערכות תומכות החלטה מבוססות חקר ביצועים, כפי שמוצג בפורטל זה, מהווה תשתית הכרחי לבניית בתי חולים חכמים ויעילים יותר בעתיד.
          </p>
        </div>
      </div>
    </div>
  );
};



