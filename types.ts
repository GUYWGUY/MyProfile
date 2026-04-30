
export type ViewType = 'home' | 'evacuation' | 'drivers' | 'review' | 'factory' | 'floating';

export interface ResearchPaper {
  id: ViewType;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePrompt: string;
  icon: string;
  buttonText: string;
  keywords?: string[]; // רשימת מילות מפתח שיוצגו כריבועים
}

export interface Factory {
  id: string;
  name: string;
  type: 'high' | 'med' | 'low';
  icon: string;
  capacity: number;
  currentLoad: number;
}

export interface Job {
  id: number;
  comp: 'low' | 'med' | 'high';
  urg: 'low' | 'med' | 'high';
}

export interface ReviewTimelinePoint {
  year: number;
  title: string;
  desc: string;
  chartData: { name: string; value: number }[];
}
