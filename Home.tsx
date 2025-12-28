
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { RESEARCH_PAPERS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { ViewType } from '../types';
import profileImg from '../profile.jpg';

const skillsData = [
  { subject: 'חקר ביצועים', A: 98 },
  { subject: 'סימולציה', A: 92 },
  { subject: 'Machine Learning', A: 95 },
  { subject: 'מערכות בריאות', A: 96 },
  { subject: 'תחבורה', A: 88 },
  { subject: 'אלגוריתמים', A: 94 },
];

interface HomeProps {
  onNavigate: (view: ViewType) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="fade-in-up">
      <header className="bg-white relative overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-32 ariel-dark-gradient z-0"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 pt-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 -mt-4">
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                <div className="aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden relative group flex items-center justify-center">
                  <img 
                    src={profileImg} 
                    alt="ד״ר גיא וכטל" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Guy+Wachtel&background=1a1a1a&color=fff&size=512";
                    }}
                  />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-5 pt-12">
                    <h2 className="text-white text-2xl font-bold">ד"ר גיא וכטל</h2>
                    <p className="text-ariel-green font-medium text-sm">חוקר ומרצה</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center text-slate-600 text-sm hover:text-ariel-green transition-colors">
                    <div className="w-8 h-8 rounded-full bg-ariel-green flex items-center justify-center text-white ml-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <span className="font-medium">GuyW@ariel.ac.il</span>
                  </div>
                  <div className="flex justify-center gap-4 pt-2 border-t border-slate-100 mt-2">
                    <a href="https://www.linkedin.com/in/guy-wachtel-9a8192a0/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-ariel-green text-xl">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ&hl=en&oi=ao" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-ariel-green text-xl">
                      <i className="fas fa-graduation-cap"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-20">
              <h1 className="text-4xl font-black text-gray-800 mb-6 font-display leading-tight">
                חקר ביצועים, אלגוריתמים <br/><span className="text-ariel-green">ומה שביניהם</span>
              </h1>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-8 text-justify">
                <p>
                  ד"ר גיא וכטל הוא מרצה וחוקר במחלקה להנדסת תעשייה וניהול באוניברסיטת אריאל. את הכשרתו האקדמית רכש באוניברסיטת בר-אילן, שם השלים דוקטורט בניהול (2018) עם התמחות בחקר ביצועים ופיתוח אלגוריתמי קירוב ליישומים במערכות לוגיסטיקה ושירותים. לאחר מכן, המשיך למחקר פוסט-דוקטורט במעבדת LCOMS באוניברסיטת לוריין (צרפת), שם התמקד בתכנון אלגוריתמים מתקדמים לפתרון בעיות תזמון ואמינות מורכבות (NP-hard).
                </p>
                <p>
                  מחקרו של ד"ר וכטל מתמקד בשימוש בכלים מתמטיים לפתרון בעיות תפעוליות מגוונות. הוא מתמחה בפיתוח אלגוריתמי קירוב לייעול מערכות בתעשייה ובשירותים, כגון ניהול עומסים בבתי חולים באמצעות שיטת "המטופל הצף", תכנון מסלולי פינוי תיירים במצבי חירום, ואופטימיזציה של תזמון משימות ברשתות ייצור מבוזרות. עבודותיו פורסמו בכתבי עת מדעיים מובילים בתחומו והוא מציג את מחקריו באופן קבוע בכנסים בינלאומיים מרכזיים.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-r-4 border-ariel-green pr-3">תחומי עניין ומחקר</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar
                        name="Expertise"
                        dataKey="A"
                        stroke="#90C030"
                        fill="#90C030"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gray-900 text-white py-16 -mt-8 relative z-0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-10 border-r-4 border-ariel-green pr-4 flex items-center gap-3">
            <i className="fas fa-binoculars text-ariel-green"></i> מבט לעתיד: מחקרים בהתהוות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <div className="text-ariel-green text-4xl mb-4"><i className="fas fa-route"></i></div>
              <h3 className="text-xl font-bold mb-3">ניתוב חכם (Smart Routing)</h3>
              <p className="text-slate-400 leading-relaxed text-justify">פיתוח אלגוריתמים המשלבים נתוני זמן אמת וחיזוי עתידי כדי לנתב משאבים בצורה אופטימלית.</p>
            </div>
            <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
              <div className="text-ariel-green text-4xl mb-4"><i className="fas fa-brain"></i></div>
              <h3 className="text-xl font-bold mb-3">בינה מלאכותית בלמידה</h3>
              <p className="text-slate-400 leading-relaxed text-justify">שימוש במודלים מתקדמים של NLP ו-Generative AI לפרסונליזציה של תהליכי למידה.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 bg-slate-50 rounded-t-[3rem] -mt-8 relative z-10">
        <h2 className="text-3xl font-black text-gray-800 mb-10 flex items-center">
          <i className="fas fa-flask text-ariel-green ml-3"></i> פרסומים נבחרים וסימולציות
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          {RESEARCH_PAPERS.map(paper => (
            <ProjectCard 
              key={paper.id} 
              paper={paper} 
              onClick={() => onNavigate(paper.id)} 
            />
          ))}
        </div>
      </section>
    </div>
  );
};
