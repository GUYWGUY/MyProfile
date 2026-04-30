
import { ResearchPaper, ReviewTimelinePoint } from './types';

// ייבוא התמונות שהועלו לספרייה הראשית
import evacuationImg from './evacuation.jpg';
import driversImg from './drivers.jpg';
import reviewImg from './review.jpg';
import factoryImg from './factory.jpg';
import floatingImg from './floating.jpg';

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'evacuation',
    year: '2021',
    title: 'פינוי תיירים אורבני',
    titleEn: 'Urban Tourist Evacuation',
    description: 'מסגרת עבודה מקיפה לשיפור תהליכי איסוף נתונים וניהול פינוי תיירים במרחב האורבני באמצעות חיישנים וניטור זרימה.',
    descriptionEn: 'A comprehensive framework for improving data collection and tourist evacuation management in urban spaces using sensors and flow monitoring.',
    imageUrl: evacuationImg, 
    imagePrompt: 'A highly detailed 3D isometric technical illustration of a modern city center during an emergency evacuation. Glowing neon green arrows show optimal walking paths for tourists. Blue police icons at key intersections. Professional architectural rendering style, clean lines, high contrast.',
    icon: 'fa-map-marked-alt',
    buttonText: 'לסימולטור',
    buttonTextEn: 'To Simulator',
    keywords: ['תכנון פינוי', 'חיזוי זרימה', 'איסוף נתונים', 'חוסן עירוני'],
    keywordsEn: ['Evacuation Planning', 'Flow Prediction', 'Data Collection', 'Urban Resilience']
  },
  {
    id: 'drivers',
    year: '2025',
    title: 'רווחת נהגי תחבורה ציבורית',
    titleEn: 'Public Transport Driver Well-being',
    description: 'הערכת רווחה ושביעות רצון של נהגים באמצעות שילוב נתונים פיזיולוגיים ובינה מלאכותית לחיזוי מדדי סטרס.',
    descriptionEn: 'Evaluating driver well-being and satisfaction by integrating physiological data and AI for stress prediction.',
    imageUrl: driversImg, 
    imagePrompt: 'A futuristic bus driver cockpit viewed from over the shoulder. Transparent holographic HUD displays showing heart rate wave (ECG), stress level bars, and schedule delay timers. Professional industrial design aesthetic.',
    icon: 'fa-heartbeat',
    buttonText: 'לסימולטור',
    buttonTextEn: 'To Simulator',
    keywords: ['נתונים פיזיולוגיים', 'Machine Learning', 'תחבורה ציבורית', 'ניטור סטרס'],
    keywordsEn: ['Physiological Data', 'Machine Learning', 'Public Transport', 'Stress Monitoring']
  },
  {
    id: 'review',
    year: '2022',
    title: 'ניהול תורים במיון: סקירה',
    titleEn: 'ER Queue Management: A Review',
    description: 'סקירה מקיפה של 229 מאמרים לאורך 7 עשורים על גישות ניהוליות ומתודולוגיות מחקר.',
    descriptionEn: 'A comprehensive review of 229 papers over seven decades on management approaches and research methodologies.',
    imageUrl: reviewImg, 
    imagePrompt: 'A realistic, professional photo of a modern hospital emergency room triage station. A focused triage doctor in blue scrubs and a stethoscope is evaluating a patient. High-quality clinical photography.',
    icon: 'fa-book-medical',
    buttonText: 'לסקירה המלאה',
    buttonTextEn: 'View Full Review',
    keywords: ['תורת התורים', 'סימולציה', 'מיון', 'אופטימיזציה'],
    keywordsEn: ['Queuing Theory', 'Simulation', 'ER Management', 'Optimization']
  },
  {
    id: 'factory',
    year: '2020',
    title: 'אופטימיזציית הקצאה רב-מפעלית',
    titleEn: 'Multi-Factory Allocation Optimization',
    description: 'פיתוח אלגוריתם קירוב (FPTAS) להקצאת משימות אופטימלית בין מפעל מרכזי לקבלני משנה תחת אילוצי זמן ורווח.',
    descriptionEn: 'Development of an approximation algorithm (FPTAS) for optimal task allocation between a central factory and subcontractors under time and profit constraints.',
    imageUrl: factoryImg, 
    imagePrompt: 'A network diagram of interconnected smart factories. Miniature 3D factories linked by glowing golden data threads. Robotic arms and assembly lines visible through windows. Industry 4.0 high-tech visualization.',
    icon: 'fa-industry',
    buttonText: 'לסימולטור',
    buttonTextEn: 'To Simulator',
    keywords: ['FPTAS', 'ניהול משימות', 'מיקור חוץ', 'אלגוריתמי קירוב'],
    keywordsEn: ['FPTAS', 'Task Management', 'Outsourcing', 'Approximation Algorithms']
  },
  {
    id: 'floating',
    year: '2015-2017',
    title: 'שיטת "המטופל הצף" (FP)',
    titleEn: 'The "Floating Patient" (FP) Method',
    description: 'סדרת מחקרים המציגה מודל מתמטי ואלגוריתמי לאיזון עומסים בין המיון למחלקות האשפוז באמצעות אופטימיזציה וקירוב.',
    descriptionEn: 'A series of studies presenting a mathematical and algorithmic model for load balancing between the ED and inpatient wards using optimization and approximation.',
    imageUrl: floatingImg, 
    imagePrompt: 'A clean medical UI dashboard in a hospital control room. On one side ED crowding metrics, on the other Inpatient Ward occupancy. A digital "Float Decision" indicator glowing green. High-tech healthcare monitoring.',
    icon: 'fa-procedures',
    buttonText: 'לסימולטור',
    buttonTextEn: 'To Simulator',
    keywords: ['Decision Support', 'FPTAS', 'Optimal Stopping', 'Crowding Balance'],
    keywordsEn: ['Decision Support', 'FPTAS', 'Optimal Stopping', 'Crowding Balance']
  }
];

export const REVIEW_TIMELINE: ReviewTimelinePoint[] = [
  { 
    year: 1980, 
    title: "1980s: מודלים אנליטיים", 
    titleEn: "1980s: Analytical Models",
    desc: "שימוש נרחב בתורת התורים ונוסחאות מתמטיות סגורות.", 
    descEn: "Widespread use of queuing theory and closed-form mathematical formulas.",
    chartData: [
      { name: 'Analytical', value: 12 },
      { name: 'Simulation', value: 3 },
      { name: 'AI/ML', value: 0 }
    ] 
  },
  { 
    year: 1990, 
    title: "1990s: צמיחת הסימולציה", 
    titleEn: "1990s: Growth of Simulation",
    desc: "מעבר לשימוש בסימולציות אירועים בדידים (DES).", 
    descEn: "Shift towards Discrete Event Simulation (DES).",
    chartData: [
      { name: 'Analytical', value: 12 },
      { name: 'Simulation', value: 18 },
      { name: 'AI/ML', value: 0 }
    ] 
  },
  { 
    year: 2000, 
    title: "2000s: גישה מערכתית", 
    titleEn: "2000s: Systemic Approach",
    desc: "הבנת הקשר בין המיון למחלקות האשפוז וניהול מיטות.", 
    descEn: "Understanding the link between the ED and inpatient wards and bed management.",
    chartData: [
      { name: 'Analytical', value: 10 },
      { name: 'Simulation', value: 35 },
      { name: 'AI/ML', value: 5 }
    ] 
  },
  { 
    year: 2010, 
    title: "2010s: עידן הנתונים", 
    titleEn: "2010s: Data Era",
    desc: "שימוש בביג דאטה וכריית נתונים לשיפור הדיוק.", 
    descEn: "Use of Big Data and data mining to improve accuracy.",
    chartData: [
      { name: 'Analytical', value: 8 },
      { name: 'Simulation', value: 40 },
      { name: 'AI/ML', value: 32 }
    ] 
  },
  { 
    year: 2025, 
    title: "2020s+: למידת מכונה", 
    titleEn: "2020s+: Machine Learning",
    desc: "שילוב אלגוריתמי AI לחיזוי עומסים בזמן אמת.", 
    descEn: "Integrating AI algorithms for real-time load prediction.",
    chartData: [
      { name: 'Analytical', value: 3 },
      { name: 'Simulation', value: 11 },
      { name: 'AI/ML', value: 40 }
    ] 
  }
];
