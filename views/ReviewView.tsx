
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { REVIEW_TIMELINE } from '../constants';

const COLORS = ['#002D56', '#009639', '#3b82f6'];

export const ReviewView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'trend'>('grid');

  // Preparing data for the trend chart using absolute numbers
  const trendData = REVIEW_TIMELINE.map(t => ({
    year: t.year,
    Analytical: t.chartData.find(d => d.name === 'Analytical')?.value || 0,
    Simulation: t.chartData.find(d => d.name === 'Simulation')?.value || 0,
    AI_ML: t.chartData.find(d => d.name === 'AI/ML')?.value || 0,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/" className="mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors">
        <i className="fas fa-arrow-right ml-2"></i> חזרה לראשי
      </Link>

      <header className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-ariel-blue mb-2">ניהול תורים במיון: סקירה שיטתית</h1>
            <p className="text-slate-500 font-medium mb-4">Operations Research Forum (2022)</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://link.springer.com/article/10.1007/s43069-021-00114-8" 
                target="_blank" 
                rel="noreferrer"
                className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-external-link-alt"></i> צפייה במאמר ב-Springer
              </a>
              <a 
                href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=Y3hTWIMAAAAJ&citation_for_view=Y3hTWIMAAAAJ:W7OEmFMy1HYC" 
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-graduation-cap"></i> פרופיל Google Scholar
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">מאמרים שנסקרו</div>
              <div className="text-2xl font-black text-ariel-blue">229</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">טווח שנים</div>
              <div className="text-2xl font-black text-ariel-blue">70</div>
            </div>
          </div>
        </div>
      </header>

      {/* Research Dashboard Widget */}
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-12 border border-slate-100 overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h3 className="text-2xl font-black text-ariel-blue">דשבורד התפתחות מתודולוגית</h3>
            <p className="text-slate-500 text-sm">ניתוח המעבר ממתמטיקה קלאסית לסימולציה ובינה מלאכותית (כמות מאמרים אבסולוטית)</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-ariel-turquoise shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fas fa-th-large ml-2"></i> השוואת עשורים
            </button>
            <button 
              onClick={() => setViewMode('trend')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'trend' ? 'bg-white text-ariel-turquoise shadow-sm' : 'text-slate-500'}`}
            >
              <i className="fas fa-chart-line ml-2"></i> גרף מגמות
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {REVIEW_TIMELINE.map((item) => (
              <div key={item.year} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col items-center group hover:border-ariel-turquoise transition-all hover:shadow-md min-h-[440px]">
                <div className="text-lg font-black text-slate-400 group-hover:text-ariel-turquoise mb-4">{item.year}s</div>
                <div className="h-32 w-full mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={item.chartData}
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {item.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} מאמרים`]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center flex-grow flex flex-col justify-start w-full">
                  <div className="text-sm font-bold text-ariel-blue mb-3 leading-tight border-b border-slate-200 pb-2">
                    {item.title.includes(':') ? item.title.split(':')[1] : item.title}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed overflow-y-auto max-h-[140px] px-1 custom-scrollbar">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[400px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} מאמרים`]}
                />
                <Area type="monotone" dataKey="Analytical" name="אנליטי" stackId="1" stroke="#002D56" fill="#002D56" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Simulation" name="סימולציה" stackId="1" stroke="#009639" fill="#009639" fillOpacity={0.2} />
                <Area type="monotone" dataKey="AI_ML" name="AI/ML" stackId="1" stroke="#3b82f6" fill="url(#colorAI)" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><div className="w-3 h-3 bg-[#002D56] rounded-sm"></div> מודלים אנליטיים</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><div className="w-3 h-3 bg-[#009639] rounded-sm"></div> סימולציה</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div> AI / למידת מכונה</div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Summary */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-black text-ariel-blue mb-8 flex items-center">
          <i className="fas fa-file-alt ml-3 text-ariel-turquoise"></i> תקציר המאמר וניתוח ממצאים
        </h3>
        
        <div className="space-y-8 text-lg text-slate-700 leading-relaxed text-justify">
          <p>
            מאמר זה מהווה סקירה ספרותית נרחבת ומעמיקה המנתחת 229 עבודות מחקריות שהתפרסמו לאורך שבעה עשורים של מחקר בתחום ניהול תורים במחלקות לרפואה דחופה (מלר"ד). המחקר בוחן את ההתפתחות ההיסטורית של הידע, החל מהמודלים הפשטניים של שנות ה-50 המבוססים על נוסחאות מתמטיות סגורות, ועד למערכות מורכבות מבוססות בינה מלאכותית המאפיינות את המחקר העכשווי. המטרה המרכזית היא לארגן את המידע הקיים בצורה נגישה המאפשרת לחוקרים ומנהלים להבין אילו כלים מתמטיים מתאימים לפתרון בעיות ספציפיות בסביבת המיון המאתגרת.
          </p>

          <p>
            הסקירה מסווגת את הגישות הניהוליות לחמש קטגוריות ליבה: ניהול מיטות (Bed Management), יישום מסלולים מהירים (Fast-track) למקרים קלים, הקצאת משאבים דינמית בזמן אמת, שיטות תיעוד ומיון (Triage), וקיבוץ מטופלים לפי דחיפות. המחברים מראים כיצד הניהול המערכתי עבר מאופטימיזציה מקומית בתוך המיון לראייה הוליסטית המקשרת בין המיון לבין כלל מחלקות האשפוז בבית החולים. ניתוח הממצאים מדגיש כי גישת הניהול המערכתי היא המפתח לשחרור צווארי בקבוק תפעוליים ומניעת צפיפות יתר.
          </p>

          <p>
            מבחינה מתודולוגית, המאמר משרטט את המעבר משימוש בלעדי בתורת התורים המתמטית (Queuing Theory) למודלים של סימולציה של אירועים בדידים (DES) ושיטות סטטיסטיות מתקדמות. בעוד שהמודלים המוקדמים נטו לפשט יתר על המידה את מורכבות המערכת, מודלים של סימולציה מאפשרים כיום להתחשב במשתנים אקראיים רבים ובאינטראקציות מורכבות בין הצוות למטופלים. המאמר מצביע על כך שהעתיד טמון בשילוב של מודלים אלו עם אלגוריתמי למידת מכונה (Machine Learning) המסוגלים לחזות עומסים עוד בטרם התרחשותם.
          </p>

          <p>
            לסיכום, המחקר מדגיש כי בעיית הצפיפות בחדרי המיון היא אתגר קריטי במערכות בריאות מודרניות, אשר החמיר משמעותית בעשורים האחרונים עקב העלייה בביקוש ושינויים דמוגרפיים. הסקירה מספקת מסגרת עבודה (Framework) המאחדת בין התיאוריה המתמטית ליישום הניהולי, וקוראת לחוקרים לפתח מודלים היברידיים המשלבים נתוני אמת ממערכות המידע הרפואיות. הטמעת הכלים הללו היא תנאי הכרחי לשיפור היעילות התפעולית, קיצור זמני ההמתנה והבטחת בטיחות המטופלים.
          </p>
        </div>
      </div>
    </div>
  );
};



