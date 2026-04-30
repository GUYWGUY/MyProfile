
import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import profileImg from '../profile.jpg';
import { useLanguage } from '../App';

export const ManagementView: React.FC = () => {
  const { lang, t } = useLanguage();

  const skillsData = [
    { subject: t.skillOR, A: 98 },
    { subject: t.skillSim, A: 92 },
    { subject: t.skillML, A: 95 },
    { subject: t.skillHealth, A: 96 },
    { subject: t.skillTransport, A: 88 },
    { subject: t.skillAlgo, A: 94 },
  ];

  return (
    <div className="fade-in-up min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <Link to="/" className={`mb-6 md:mb-8 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit ${lang === 'he' ? 'ml-auto' : 'mr-auto'}`}>
          <i className={`fas ${lang === 'he' ? 'fa-arrow-right ml-2' : 'fa-arrow-left mr-2'}`}></i> {t.backToLab}
        </Link>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar with Profile */}
            <div className={`w-full md:w-1/3 p-6 md:p-8 bg-slate-50 ${lang === 'he' ? 'md:border-l' : 'md:border-r'} border-slate-100`}>
              <div className="rounded-2xl overflow-hidden shadow-lg mb-6 aspect-[3/4] max-w-[280px] mx-auto md:max-w-none">
                <img 
                  src={profileImg} 
                  alt={t.headOfLab} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Guy+Wachtel&background=002D56&color=fff&size=512";
                  }}
                />
              </div>
              
              <div className="space-y-4 text-center md:text-right">
                <h1 className="text-2xl md:text-3xl font-black text-ariel-blue">{t.headOfLab}</h1>
                <p className="text-ariel-turquoise font-bold text-lg">{lang === 'he' ? 'ראש המעבדה' : 'Head of Lab'}</p>
                
                <div className="pt-4 space-y-3">
                  <div className={`flex items-center justify-center md:justify-start text-slate-600 ${lang === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="text-sm font-medium">GuyW@ariel.ac.il</span>
                    <i className={`fas fa-envelope ${lang === 'he' ? 'mr-3' : 'ml-3'} text-ariel-turquoise w-5`}></i>
                  </div>
                  <div className={`flex items-center justify-center md:justify-start text-slate-600 ${lang === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="text-sm font-medium">{t.department}</span>
                    <i className={`fas fa-university ${lang === 'he' ? 'mr-3' : 'ml-3'} text-ariel-turquoise w-5`}></i>
                  </div>
                </div>

                <div className="flex justify-center md:justify-start gap-4 pt-6 border-t border-slate-200">
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
            <div className="w-full md:w-2/3 p-6 md:p-10">
              <section className="mb-12">
                <h2 className={`text-xl md:text-2xl font-black text-ariel-blue mb-6 ${lang === 'he' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-ariel-turquoise`}>
                  {t.academicExp}
                </h2>
                <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed text-justify">
                  <p>{t.bioP1}</p>
                  <p>{t.bioP2}</p>
                  <p>{t.bioP3}</p>
                  <p>{t.bioP4}</p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl md:text-2xl font-black text-ariel-blue mb-6 ${lang === 'he' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-ariel-turquoise`}>
                  {t.expertise}
                </h2>
                <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
                  <div className="h-64 md:h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700 }} />
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
