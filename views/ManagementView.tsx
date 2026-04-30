
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import profileImg from '../profile.jpg';

const skillsData = [
  { subject: 'חקר ביצועים', A: 98 },
  { subject: 'סימולציה', A: 92 },
  { subject: 'Machine Learning', A: 95 },
  { subject: 'מערכות בריאות', A: 96 },
  { subject: 'תחבורה', A: 88 },
  { subject: 'אלגוריתמים', A: 94 },
];

export const ManagementView: React.FC = () => {
  return (
    <div className="fade-in-up min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link to="/" className="mb-8 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit">
          <i className="fas fa-arrow-right ml-2"></i> חזרה לדף המעבדה
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar with Profile */}
            <div className="w-full md:w-1/3 p-8 bg-slate-50 border-l border-slate-100">
              <div className="rounded-2xl overflow-hidden shadow-lg mb-6 aspect-[3/4]">
                <img 
                  src={profileImg} 
                  alt="ד״ר גיא וכטל" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Guy+Wachtel&background=002D56&color=fff&size=512";
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl font-black text-ariel-blue">ד"ר גיא וכטל</h1>
                <p className="text-ariel-turquoise font-bold text-lg">ראש המעבדה</p>
                
                <div className="pt-4 space-y-3">
                  <div className="flex items-center text-slate-600">
                    <i className="fas fa-envelope ml-3 text-ariel-turquoise w-5"></i>
                    <span className="text-sm font-medium">GuyW@ariel.ac.il</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <i className="fas fa-university ml-3 text-ariel-turquoise w-5"></i>
                    <span className="text-sm font-medium">המחלקה להנדסת תעשייה וניהול</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-200">
                  <a href="https://www.linkedin.com/in/guy-wachtel-9a8192a0/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-ariel-turquoise transition-all">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://scholar.google.com/citations?user=Y3hTWIMAAAAJ&hl=en&oi=ao" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-ariel-turquoise transition-all">
                    <i className="fas fa-graduation-cap"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full md:w-2/3 p-10">
              <section className="mb-12">
                <h2 className="text-2xl font-black text-ariel-blue mb-6 border-r-4 border-ariel-turquoise pr-4">אודות וניסיון אקדמי</h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed text-justify">
                  <p>
                    ד"ר גיא וכטל הוא מרצה וחוקר במחלקה להנדסת תעשייה וניהול באוניברסיטת אריאל. את הכשרתו האקדמית רכש באוניברסיטת בר-אילן, שם השלים דוקטורט בניהול (2018) עם התמחות בחקר ביצועים ופיתוח אלגוריתמי קירוב ליישומים במערכות לוגיסטיקה ושירותים.
                  </p>
                  <p>
                    לאחר מכן, המשיך למחקר פוסט-דוקטורט במעבדת LCOMS באוניברסיטת לוריין (צרפת), שם התמקד בתכנון אלגוריתמים מתקדמים לפתרון בעיות תזמון ואמינות מורכבות (NP-hard).
                  </p>
                  <p>
                    מחקרו של ד"ר וכטל מתמקד בשימוש בכלים מתמטיים לפתרון בעיות תפעוליות מגוונות. הוא מתמחה בפיתוח אלגוריתמי קירוב לייעול מערכות בתעשייה ובשירותים, כגון ניהול עומסים בבתי חולים באמצעות שיטת "המטופל הצף", תכנון מסלולי פינוי תיירים במצבי חירום, ואופטימיזציה של תזמון משימות ברשתות ייצור מבוזרות.
                  </p>
                  <p>
                    עבודותיו פורסמו בכתבי עת מדעיים מובילים בתחומו והוא מציג את מחקריו באופן קבוע בכנסים בינלאומיים מרכזיים. כיום הוא מוביל את המעבדה לקבלת החלטות ותהליכי למידה מבוססי ידע, תוך דגש על שילוב בינה מלאכותית (AI) ככלי עזר תומך החלטה.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-black text-ariel-blue mb-6 border-r-4 border-ariel-turquoise pr-4">מומחיות מקצועית</h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <Radar
                          name="Expertise"
                          dataKey="A"
                          stroke="#008C95"
                          fill="#008C95"
                          fillOpacity={0.6}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
