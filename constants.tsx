
import { ResearchPaper, ReviewTimelinePoint } from './types';

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'evacuation',
    year: '2021',
    title: 'פינוי תיירים אורבני',
    description: 'מסגרת עבודה מקיפה לשיפור תהליכי איסוף נתונים וניהול פינוי תיירים במרחב האורבני באמצעות חיישנים וניטור זרימה.',
    imageUrl: 'evacuation.jpg', 
    imagePrompt: 'A highly detailed 3D isometric technical illustration of a modern city center during an emergency evacuation. Glowing neon green arrows show optimal walking paths for tourists. Blue police icons at key intersections. Professional architectural rendering style, clean lines, high contrast.',
    icon: 'fa-map-marked-alt',
    buttonText: 'לסימולטור',
    keywords: ['תכנון פינוי', 'חיזוי זרימה', 'איסוף נתונים', 'חוסן עירוני']
  },
  {
    id: 'drivers',
    year: '2025',
    title: 'רווחת נהגי תחבורה ציבורית',
    description: 'הערכת רווחה ושביעות רצון של נהגים באמצעות שילוב נתונים פיזיולוגיים ובינה מלאכותית לחיזוי מדדי סטרס.',
    imageUrl: 'drivers.jpg', 
    imagePrompt: 'A futuristic bus driver cockpit viewed from over the shoulder. Transparent holographic HUD displays showing heart rate wave (ECG), stress level bars, and schedule delay timers. Professional industrial design aesthetic.',
    icon: 'fa-heartbeat',
    buttonText: 'לסימולטור',
    keywords: ['נתונים פיזיולוגיים', 'Machine Learning', 'תחבורה ציבורית', 'ניטור סטרס']
  },
  {
    id: 'review',
    year: '2022',
    title: 'ניהול תורים במיון: סקירה',
    description: 'סקירה מקיפה של 229 מאמרים לאורך 7 עשורים על גישות ניהוליות ומתודולוגיות מחקר.',
    imageUrl: 'review.jpg', 
    imagePrompt: 'A realistic, professional photo of a modern hospital emergency room triage station. A focused triage doctor in blue scrubs and a stethoscope is evaluating a patient. High-quality clinical photography.',
    icon: 'fa-book-medical',
    buttonText: 'לסקירה המלאה',
    keywords: ['תורת התורים', 'סימולציה', 'מיון', 'אופטימיזציה']
  },
  {
    id: 'factory',
    year: '2020',
    title: 'אופטימיזציית הקצאה רב-מפעלית',
    description: 'פיתוח אלגוריתם קירוב (FPTAS) להקצאת משימות אופטימלית בין מפעל מרכזי לקבלני משנה תחת אילוצי זמן ורווח.',
    imageUrl: 'factory.jpg', 
    imagePrompt: 'A network diagram of interconnected smart factories. Miniature 3D factories linked by glowing golden data threads. Robotic arms and assembly lines visible through windows. Industry 4.0 high-tech visualization.',
    icon: 'fa-industry',
    buttonText: 'לסימולטור',
    keywords: ['FPTAS', 'ניהול משימות', 'מיקור חוץ', 'אלגוריתמי קירוב']
  },
  {
    id: 'floating',
    year: '2015-2017',
    title: 'שיטת "המטופל הצף" (FP)',
    description: 'סדרת מחקרים המציגה מודל מתמטי ואלגוריתמי לאיזון עומסים בין המיון למחלקות האשפוז באמצעות אופטימיזציה וקירוב.',
    imageUrl: 'floating.jpg', 
    imagePrompt: 'A clean medical UI dashboard in a hospital control room. On one side ED crowding metrics, on the other Inpatient Ward occupancy. A digital "Float Decision" indicator glowing green. High-tech healthcare monitoring.',
    icon: 'fa-procedures',
    buttonText: 'לסימולטור',
    keywords: ['Decision Support', 'FPTAS', 'Optimal Stopping', 'Crowding Balance']
  }
];

export const REVIEW_TIMELINE: ReviewTimelinePoint[] = [
  { 
    year: 1980, 
    title: "1980s: מודלים אנליטיים", 
    desc: "שימוש נרחב בתורת התורים ונוסחאות מתמטיות סגורות.", 
    chartData: [
      { name: 'Analytical', value: 12 },
      { name: 'Simulation', value: 3 },
      { name: 'AI/ML', value: 0 }
    ] 
  },
  { 
    year: 1990, 
    title: "1990s: צמיחת הסימולציה", 
    desc: "מעבר לשימוש בסימולציות אירועים בדידים (DES).", 
    chartData: [
      { name: 'Analytical', value: 12 },
      { name: 'Simulation', value: 18 },
      { name: 'AI/ML', value: 0 }
    ] 
  },
  { 
    year: 2000, 
    title: "2000s: גישה מערכתית", 
    desc: "הבנת הקשר בין המיון למחלקות האשפוז וניהול מיטות.", 
    chartData: [
      { name: 'Analytical', value: 10 },
      { name: 'Simulation', value: 35 },
      { name: 'AI/ML', value: 5 }
    ] 
  },
  { 
    year: 2010, 
    title: "2010s: עידן הנתונים", 
    desc: "שימוש בביג דאטה וכריית נתונים לשיפור הדיוק.", 
    chartData: [
      { name: 'Analytical', value: 8 },
      { name: 'Simulation', value: 40 },
      { name: 'AI/ML', value: 32 }
    ] 
  },
  { 
    year: 2025, 
    title: "2020s+: למידת מכונה", 
    desc: "שילוב אלגוריתמי AI לחיזוי עומסים בזמן אמת.", 
    chartData: [
      { name: 'Analytical', value: 3 },
      { name: 'Simulation', value: 11 },
      { name: 'AI/ML', value: 40 }
    ] 
  }
];
