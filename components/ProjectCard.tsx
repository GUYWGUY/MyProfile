
import React from 'react';
import { Link } from 'react-router-dom';
import { ResearchPaper } from '../types';

interface ProjectCardProps {
  paper: ResearchPaper;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ paper }) => {
  return (
    <Link 
      to={`/${paper.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl card-hover border border-slate-200 group cursor-pointer w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.33%-2rem)] flex flex-col"
    >
      <div className="h-48 bg-ariel-blue relative overflow-hidden shrink-0">
        <img 
          src={paper.imageUrl} 
          alt={paper.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(paper.title)}&background=002D56&color=fff&size=512`;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-ariel-blue/60 to-transparent"></div>
        <div className="absolute bottom-4 right-4 bg-ariel-turquoise text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
          {paper.year}
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <i className={`fas ${paper.icon} text-5xl text-white/90 drop-shadow-lg floating-icon`}></i>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow text-right" dir="rtl">
        <h3 className="text-xl font-bold text-ariel-blue mb-2 group-hover:text-ariel-turquoise transition-colors">
          {paper.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {paper.description}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-2 pt-2 justify-start">
          {paper.keywords && paper.keywords.map((kw, i) => (
            <span 
              key={i} 
              className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-semibold"
            >
              {kw}
            </span>
          ))}
        </div>
        <div className="text-ariel-turquoise font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-4 self-start">
          {paper.buttonText} <i className="fas fa-arrow-left"></i>
        </div>
      </div>
    </Link>
  );
};

