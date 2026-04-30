
import React from 'react';
import { Link } from 'react-router-dom';
import { RESEARCH_PAPERS } from '../constants';
import { ProjectCard } from '../components/ProjectCard';
import { useLanguage } from '../App';
import labBanner from '../lab_banner.png';

export const Home: React.FC = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="fade-in-up">
      <header className="bg-slate-900 relative overflow-hidden pb-16 md:pb-24">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <img src={labBanner} alt="Lab Concept" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 ariel-dark-gradient opacity-90"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 pt-16 md:pt-24 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 md:mb-8 font-display leading-[1.2] md:leading-[1.1] drop-shadow-lg px-2">
            {lang === 'he' ? (
              <>המעבדה לקבלת החלטות <br/>
              <span className="text-ariel-turquoise">ותהליכי למידה מבוססי ידע</span></>
            ) : (
              <>Lab for Decision Making <br/>
              <span className="text-ariel-turquoise">& Knowledge-Based Learning</span></>
            )}
          </h1>
          <div className="flex flex-col items-center gap-4">
            <Link 
              to="/management" 
              className="mt-4 md:mt-6 inline-flex items-center gap-2 bg-ariel-turquoise text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold shadow-lg hover:bg-ariel-turquoise-dark transition-all transform hover:-translate-y-1 text-sm md:text-base"
            >
              <i className="fas fa-user-tie"></i> {t.langName === 'English' ? `בניהולו של ${t.headOfLab}` : `Led by ${t.headOfLab}`}
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16 -mt-8 md:-mt-10 relative z-10">
        <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-slate-100">
          <h2 className={`text-2xl md:text-3xl font-black text-ariel-blue mb-8 ${lang === 'he' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-ariel-turquoise`}>
            {t.labVision}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed text-justify">
              <p dangerouslySetInnerHTML={{ __html: t.visionText1 }}></p>
              <p dangerouslySetInnerHTML={{ __html: t.visionText2 }}></p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-microchip text-ariel-turquoise text-2xl md:text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue text-sm md:text-base">AI & ML</span>
              </div>
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-chart-line text-ariel-turquoise text-2xl md:text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue text-sm md:text-base">Optimization</span>
              </div>
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-project-diagram text-ariel-turquoise text-2xl md:text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue text-sm md:text-base">OR Models</span>
              </div>
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center group hover:bg-ariel-turquoise/5 transition-colors">
                <i className="fas fa-graduation-cap text-ariel-turquoise text-2xl md:text-3xl mb-3"></i>
                <span className="font-bold text-ariel-blue text-sm md:text-base">Smart Learning</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ariel-blue text-white py-16 md:py-20 relative z-0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className={`text-2xl md:text-3xl font-black mb-10 md:12 ${lang === 'he' ? 'border-r-4 pr-4' : 'border-l-4 pl-4'} border-ariel-turquoise flex items-center gap-3`}>
            <i className="fas fa-spinner text-ariel-turquoise animate-spin-slow"></i> {t.activeResearch}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group">
              <div className="text-ariel-turquoise text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-route"></i></div>
              <h3 className="text-lg md:text-xl font-bold mb-3">{t.dynamicRouting}</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify">{t.dynamicRoutingDesc}</p>
            </div>
            <div className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm group">
              <div className="text-ariel-turquoise text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform"><i className="fas fa-brain"></i></div>
              <h3 className="text-lg md:text-xl font-bold mb-3">{t.aiEducation}</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify">{t.aiEducationDesc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20 bg-slate-50 rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 px-2 md:px-6 gap-6">
          <div className="text-center md:text-right">
            <h2 className="text-2xl md:text-3xl font-black text-ariel-blue flex items-center justify-center md:justify-start">
              <i className={`fas fa-flask text-ariel-turquoise ${lang === 'he' ? 'ml-3' : 'mr-3'}`}></i> {t.labPublications}
            </h2>
          </div>
          <p className={`text-slate-500 font-medium max-w-md ${lang === 'he' ? 'text-right' : 'text-left'} text-sm md:text-base`}>
            {lang === 'he' ? 'סקירה של פרסומים נבחרים המשלבים תיאוריה מתמטית עם יישום מעשי בסימולטורים אינטראקטיביים.' : 'A review of selected publications combining mathematical theory with practical application in interactive simulators.'}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
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

