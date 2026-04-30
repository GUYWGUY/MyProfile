
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { RESEARCH_PAPERS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import profileImg from '../profile.jpg';

const skillsData = [
  { subject: 'חקר ביצועים', A: 98 },
  { subject: 'סימולציה', A: 92 },
  { subject: 'Machine Learning', A: 95 },
  { subject: 'מערכות בריאות', A: 96 },
  { subject: 'תחבורה', A: 88 },
  { subject: 'אלגוריתמים', A: 94 },
];

export const Home: React.FC = () => {
  return (
    <div className="fade-in-up">
      <header className="bg-white relative overflow-hidden pb-20">
        <div className="absolute top-0 left-0 w-full h-64 ariel-dark-gradient z-0"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 pt-24 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 font-display leading-[1.1] drop-shadow-lg">
            המעבדה לקבלת החלטות <br/>
            <span className="text-ariel-turquoise">ותהליכי למידה מבוססי ידע</span>
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              פיתוח מודלים מתמטיים ואלגוריתמיים לשיפור תהליכי קבלת החלטות במערכות מורכבות, תוך דגש על חדשנות טכנולוגית ולמידה חכמה.
            </p>
            <Link 
              to="/management" 
              className="mt-6 inline-flex items-center gap-2 bg-ariel-turquoise text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-ariel-turquoise-dark transition-all transform hover:-translate-y-1"
            >
              <i className="fas fa-user-tie"></i> בניהולו של ד"ר גיא וכטל
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-16 -mt-10 relative z-10">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h2 className="text-3xl font-black text-ariel-blue mb-8 border-r-4 border-ariel-turquoise pr-4">חזון ופעילות המעבדה</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-justify">
              <p>
                המעבדה לקבלת החלטות ותהליכי למידה מבוססי ידע באוניברסיטת אריאל מהווה מוקד למחקר רב-תחומי המשלב חקר ביצועים, אופטימיזציה ובינה מלאכותית. אנו מתמקדים בפיתוח כלים תומכי החלטה המסייעים לארגונים ולמערכות ציבוריות להתמודד עם אתגרי המאה ה-21.
              </p>
              <p>
                הכיוון המחקרי הנוכחי של המעבדה מתמקד בשימוש ב<strong>בינה מלאכותית (AI)</strong> ככלי עזר מרכזי ותומך בתהליכי ניהול, עבודה ולמידה. אנו חוקרים כיצד מודלים של למידת מכונה ועיבוד שפה טבעית יכולים להשתלב בסימולציות מורכבות כדי לספק תובנות מדויקות ופרסונליזציה של תהליכי הכשרה וביצוע.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-microchip text-ariel-turquoise text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue">AI & ML</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-chart-line text-ariel-turquoise text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue">Optimization</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-project-diagram text-ariel-turquoise text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue">OR Models</span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-graduation-cap text-ariel-turquoise text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue">Smart Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ariel-blue text-white py-20 relative z-0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-12 border-r-4 border-ariel-turquoise pr-4 flex items-center gap-3">
            <i className="fas fa-spinner text-ariel-turquoise animate-spin-slow"></i> מחקרים פעילים ופרויקטים נוכחיים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group">
              <div className="text-ariel-turquoise text-4xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-route"></i></div>
              <h3 className="text-xl font-bold mb-3">ניתוב חכם ודינמי (Dynamic Routing)</h3>
              <p className="text-gray-300 leading-relaxed text-justify">פיתוח אלגוריתמים המשלבים נתוני זמן אמת וחיזוי עתידי כדי לנתב משאבים בצורה אופטימלית במערכות לוגיסטיקה עירוניות.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group">
              <div className="text-ariel-turquoise text-4xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-brain"></i></div>
              <h3 className="text-xl font-bold mb-3">בינה מלאכותית בחינוך טכנולוגי</h3>
              <p className="text-gray-300 leading-relaxed text-justify">שימוש במודלים מתקדמים של NLP ובינה מלאכותית יוצרת (Generative AI) לצורך התאמה אישית של תהליכי למידה והכשרה מקצועית.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 bg-slate-50 rounded-t-[4rem] -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 px-6">
          <h2 className="text-3xl font-black text-ariel-blue flex items-center">
            <i className="fas fa-flask text-ariel-turquoise ml-3"></i> פרסומי המעבדה וסימולציות
          </h2>
          <p className="text-slate-500 font-medium max-w-md text-left">סקירה של פרסומים נבחרים המשלבים תיאוריה מתמטית עם יישום מעשי בסימולטורים אינטראקטיביים.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {RESEARCH_PAPERS.map(paper => (
            <ProjectCard 
              key={paper.id} 
              paper={paper} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};

