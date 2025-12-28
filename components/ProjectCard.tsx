
import React, { useState, useEffect } from 'react';
import { ResearchPaper } from '../types';
import { generateAIImage } from '../services/aiService';

interface ProjectCardProps {
  paper: ResearchPaper;
  onClick: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ paper, onClick }) => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [useLocal, setUseLocal] = useState<boolean>(true);

  useEffect(() => {
    if (imgUrl) return;
    let mounted = true;

    const loadAI = async () => {
      try {
        const url = await generateAIImage(paper.imagePrompt, paper.id);
        if (mounted) {
          setImgUrl(url);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setImgUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(paper.id)}&background=1e293b&color=fff&size=512`);
          setLoading(false);
        }
      }
    };

    if (!useLocal) {
      loadAI();
    }

    return () => { mounted = false; };
  }, [useLocal, paper.imagePrompt, paper.id, imgUrl]);

  const handleImageError = () => {
    if (useLocal) {
      setUseLocal(false);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl card-hover border border-slate-200 group cursor-pointer w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] flex flex-col"
      onClick={onClick}
    >
      <div className="h-48 bg-slate-800 relative overflow-hidden shrink-0">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white gap-2 z-20">
            <div className="w-8 h-8 border-2 border-ariel-green border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-mono text-slate-400">מחפש תמונה...</span>
          </div>
        )}
        
        <img 
          src={useLocal ? paper.imageUrl : imgUrl} 
          alt={paper.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700 ${loading ? 'invisible' : 'visible'}`} 
        />

        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 to-transparent"></div>
        <div className="absolute bottom-4 right-4 bg-ariel-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          {paper.year}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <i className={`fas ${paper.icon} text-5xl text-white/90 drop-shadow-lg floating-icon`}></i>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-ariel-green transition-colors">
          {paper.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {paper.description}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {paper.keywords ? (
            // תצוגת מילות מפתח בריבועים אפורים מקצועיים (טקסט רגיל)
            paper.keywords.map((kw, i) => (
              <span 
                key={i} 
                className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold"
              >
                {kw}
              </span>
            ))
          ) : (
            // תצוגת הכפתור הסטנדרטית ליתר המאמרים
            <button className="text-ariel-green font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all self-start">
              {paper.buttonText} <i className="fas fa-arrow-left"></i>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
