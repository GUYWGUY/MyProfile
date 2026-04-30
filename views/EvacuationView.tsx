import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const SIZE = 20;
const AGENT_COUNT = 30;

interface Agent {
  id: number;
  x: number;
  y: number;
  isSmart: boolean;
  isEscaped: boolean;
}

export const EvacuationView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [grid, setGrid] = useState<string[][]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [policePositions, setPolicePositions] = useState<[number, number][]>([]);
  const [isPlacingPolice, setIsPlacingPolice] = useState(false);
  const [steps, setSteps] = useState(0);

  const safeZone = { x: SIZE - 1, y: 0 };
  const intervalRef = useRef<number | null>(null);

  const distanceMap = useMemo(() => {
    if (grid.length === 0) return null;
    const dists = Array(SIZE).fill(0).map(() => Array(SIZE).fill(Infinity));
    const queue: [number, number, number][] = [[safeZone.x, safeZone.y, 0]];
    dists[safeZone.y][safeZone.x] = 0;
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    while (queue.length > 0) {
      const [cx, cy, d] = queue.shift()!;
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE && grid[ny][nx] !== 'wall' && dists[ny][nx] === Infinity) {
          dists[ny][nx] = d + 1;
          queue.push([nx, ny, d + 1]);
        }
      }
    }
    return dists;
  }, [grid]);

  const initGrid = useCallback(() => {
    const newGrid = Array(SIZE).fill(0).map(() => Array(SIZE).fill('empty'));
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        let isWall = false;
        if (x === 2 && y > 2 && y < 18) isWall = true;
        if (x === 17 && y > 2 && y < 18) isWall = true;
        if (y === 2 && x > 2 && x < 17) isWall = true;
        if (y === 17 && x > 2 && x < 17) isWall = true;
        if (x === 6 && y > 6 && y < 14) isWall = true;
        if (x === 13 && y > 6 && y < 14) isWall = true;
        if (y === 6 && x > 6 && x < 13) isWall = true;
        if (y === 13 && x > 6 && x < 13) isWall = true;
        if ((x === 10 && (y === 2 || y === 17)) || (y === 10 && (x === 2 || x === 17)) || (x === 10 && (y === 6 || y === 13))) {
          isWall = false;
        }
        if (isWall) newGrid[y][x] = 'wall';
      }
    }
    newGrid[safeZone.y][safeZone.x] = 'safe';
    setGrid(newGrid);
    const initialAgents: Agent[] = [];
    let placed = 0;
    while (placed < AGENT_COUNT) {
      const rx = Math.floor(Math.random() * SIZE);
      const ry = Math.floor(Math.random() * SIZE);
      if (newGrid[ry][rx] === 'empty' && !initialAgents.find(a => a.x === rx && a.y === ry)) {
        initialAgents.push({ id: placed, x: rx, y: ry, isSmart: false, isEscaped: false });
        placed++;
      }
    }
    setAgents(initialAgents);
    setSteps(0);
    setIsAlarmActive(false);
    setPolicePositions([]);
  }, []);

  useEffect(() => {
    initGrid();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initGrid]);

  const handleSimStep = useCallback(() => {
    setAgents(prevAgents => {
      const escapedCount = prevAgents.filter(a => a.isEscaped).length;
      if (escapedCount === AGENT_COUNT) return prevAgents;
      const newAgents = prevAgents.map(a => ({ ...a }));
      if (isAlarmActive) {
        newAgents.forEach(agent => {
          if (agent.isEscaped) return;
          const metPolice = policePositions.some(([px, py]) => Math.abs(px - agent.x) <= 1 && Math.abs(py - agent.y) <= 1);
          if (metPolice) agent.isSmart = true;
          if (!agent.isSmart) {
            const nearSmartPeer = newAgents.find(other => other.id !== agent.id && !other.isEscaped && other.isSmart && Math.abs(other.x - agent.x) <= 1 && Math.abs(other.y - agent.y) <= 1);
            if (nearSmartPeer) agent.isSmart = true;
          }
        });
      }
      newAgents.forEach(agent => {
        if (agent.isEscaped) return;
        let nx = agent.x; let ny = agent.y;
        if (!isAlarmActive) {
          if (Math.random() > 0.6) {
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
            const tx = agent.x + dx; const ty = agent.y + dy;
            if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall' && grid[ty][tx] !== 'safe') { nx = tx; ny = ty; }
          }
        } else {
          if (agent.isSmart && distanceMap) {
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [0, 0]];
            let minVal = distanceMap[agent.y][agent.x];
            let bestMoves: [number, number][] = [[agent.x, agent.y]];
            for (const [dx, dy] of dirs) {
              const tx = agent.x + dx; const ty = agent.y + dy;
              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE) {
                const val = distanceMap[ty][tx];
                if (val < minVal) { minVal = val; bestMoves = [[tx, ty]]; }
                else if (val === minVal && val !== Infinity) { bestMoves.push([tx, ty]); }
              }
            }
            const [tx, ty] = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            nx = tx; ny = ty;
          } else {
            if (Math.random() > 0.3) {
              let dx = agent.x < safeZone.x ? 1 : (agent.x > safeZone.x ? -1 : 0);
              let dy = agent.y < safeZone.y ? 1 : (agent.y > safeZone.y ? -1 : 0);
              let tx = agent.x, ty = agent.y;
              if (Math.random() > 0.5 && dx !== 0) tx += dx; else if (dy !== 0) ty += dy; else tx += dx;
              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall') { nx = tx; ny = ty; }
            } else {
              const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
              const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
              const tx = agent.x + dx; const ty = agent.y + dy;
              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall') { nx = tx; ny = ty; }
            }
          }
        }
        const isOccupied = newAgents.some(other => other.id !== agent.id && !other.isEscaped && other.x === nx && other.y === ny);
        if (!isOccupied || grid[ny][nx] === 'safe') {
          agent.x = nx; agent.y = ny;
          if (grid[ny][nx] === 'safe') { agent.isEscaped = true; }
        }
      });
      return newAgents;
    });
  }, [grid, isAlarmActive, policePositions, distanceMap, safeZone]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const escaped = agents.filter(a => a.isEscaped).length;
      if (escaped < AGENT_COUNT) {
        handleSimStep();
        if (isAlarmActive) { setSteps(s => s + 1); }
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 250);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [handleSimStep, isAlarmActive, agents]);

  const togglePolice = (x: number, y: number) => {
    if (!isPlacingPolice) return;
    if (grid[y][x] === 'wall' || grid[y][x] === 'safe') return;
    const existsIdx = policePositions.findIndex(([px, py]) => px === x && py === y);
    if (existsIdx > -1) { setPolicePositions(prev => prev.filter((_, i) => i !== existsIdx)); }
    else if (policePositions.length < 2) { setPolicePositions(prev => [...prev, [x, y]]); }
  };

  const escapedCount = agents.filter(a => a.isEscaped).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className={`mb-6 flex items-center text-slate-500 hover:text-ariel-turquoise font-bold transition-colors w-fit ${lang === 'he' ? 'ml-auto' : 'mr-auto'}`}>
        <i className={`fas ${lang === 'he' ? 'fa-arrow-right ml-2' : 'fa-arrow-left mr-2'}`}></i> {t.backToLab}
      </Link>

      <header className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-ariel-turquoise mb-8 border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-black text-ariel-blue mb-2">
              {lang === 'he' ? 'תכנון מסלולי פינוי תיירים (2021)' : 'Tourist Evacuation Routing Planning (2021)'}
            </h1>
            <p className="text-slate-500 font-medium mb-4">Urban Analytics and City Science, SAGE</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://journals.sagepub.com/doi/full/10.1177/2399808321994575" target="_blank" rel="noreferrer" className="bg-ariel-turquoise text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-ariel-turquoise-dark transition-colors flex items-center gap-2 shadow-md">
                <i className="fas fa-external-link-alt"></i> {lang === 'he' ? 'צפייה במאמר' : 'View Article'}
              </a>
              <a href="https://scholar.google.com/citations?view_op=view_citation&user=Y3hTWIMAAAAJ&citation_for_view=Y3hTWIMAAAAJ:L8W6d9pNpYUC" target="_blank" rel="noreferrer" className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
                <i className="fas fa-graduation-cap"></i> Google Scholar
              </a>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{lang === 'he' ? 'שנת פרסום' : 'Year'}</div>
            <div className="text-2xl font-black text-ariel-blue">2021</div>
          </div>
        </div>
      </header>

      <div className="bg-ariel-blue text-white rounded-2xl shadow-2xl p-6 mb-12 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-map-marked-alt text-ariel-turquoise"></i> {t.simTitleEvac}
          </h3>
          <div className="flex flex-wrap justify-center gap-3 bg-white/10 p-2 rounded-lg items-center">
            <button onClick={() => setIsPlacingPolice(!isPlacingPolice)} className={`px-3 py-1 text-xs rounded transition-all flex items-center gap-1 border ${isPlacingPolice ? 'bg-blue-600 border-white ring-2 ring-blue-400' : 'bg-gray-600 border-gray-500'}`}>
              <i className="fas fa-user-shield"></i> {lang === 'he' ? `הצב שוטר (${policePositions.length}/2)` : `Place Police (${policePositions.length}/2)`}
            </button>
            <button onClick={() => setIsAlarmActive(true)} className={`px-4 py-2 rounded font-bold transition-all shadow-lg flex items-center gap-2 text-sm ${isAlarmActive ? 'bg-red-800 opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'}`}>
              <i className="fas fa-bell"></i> {lang === 'he' ? 'הפעל אזעקה!' : 'Start Alarm!'}
            </button>
            <button onClick={initGrid} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 font-bold transition-all shadow-lg flex items-center gap-2 text-sm">
              <i className="fas fa-undo"></i> {t.simReset}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-md flex justify-between text-[10px] md:text-xs font-mono text-ariel-turquoise mb-2 px-1">
            <span>{lang === 'he' ? 'מצב:' : 'Mode:'} <span className={isAlarmActive ? 'text-red-500 font-bold animate-pulse' : ''}>{isAlarmActive ? (lang === 'he' ? 'מצב חירום' : 'Emergency') : (lang === 'he' ? 'שיטוט' : 'Normal')}</span></span>
            <span>{lang === 'he' ? 'צעדים:' : 'Steps:'} <span className="font-bold text-lg">{steps}</span></span>
          </div>
          
          <div className="overflow-x-auto w-full flex justify-center pb-4">
            <div 
              className="grid gap-[1px] bg-slate-800 p-1 rounded-lg shadow-2xl border-4 border-slate-700"
              style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(12px, 1fr))`, width: 'fit-content' }}
            >
              {grid.map((row, y) => row.map((cellType, x) => {
                const police = policePositions.find(([px, py]) => px === x && py === y);
                const agent = agents.find(a => !a.isEscaped && a.x === x && a.y === y);
                return (
                  <div key={`${x}-${y}`} onClick={() => togglePolice(x, y)} className={`w-4 h-4 md:w-5 md:h-5 relative rounded-sm cursor-pointer flex items-center justify-center ${cellType === 'wall' ? 'bg-slate-600' : 'bg-slate-700 hover:bg-slate-600'} ${cellType === 'safe' ? 'bg-ariel-turquoise shadow-[0_0_10px_rgba(0,150,57,0.4)]' : ''} ${police ? 'bg-blue-600 ring-1 ring-white z-20' : ''}`}>
                    {cellType === 'safe' && <i className="fas fa-door-open text-white text-[8px]"></i>}
                    {police && <i className="fas fa-user-shield text-white text-[8px]"></i>}
                    {agent && <div className={`w-[80%] h-[80%] rounded-full absolute z-10 transition-all duration-300 ${agent.isSmart ? 'bg-ariel-turquoise border border-white' : (isAlarmActive ? 'bg-red-500 animate-pulse' : 'bg-blue-500')}`} />}
                  </div>
                );
              }))}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {lang === 'he' ? 'רגיל' : 'Normal'}</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> {lang === 'he' ? 'פאניקה' : 'Panic'}</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-ariel-turquoise border border-white"></div> {lang === 'he' ? 'מונחה' : 'Smart'}</div>
          </div>
          
          <div className="mt-4 font-mono text-white text-sm bg-white/10 px-6 py-2 rounded-full border border-white/20">
            {t.simEscaped}: <span className="text-ariel-turquoise font-bold text-lg">{escapedCount}</span> / {AGENT_COUNT}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        <h3 className={`text-xl md:text-2xl font-black text-ariel-blue mb-8 flex items-center ${lang === 'he' ? 'flex-row' : 'flex-row-reverse'}`}>
          <i className={`fas fa-file-alt ${lang === 'he' ? 'ml-3' : 'mr-3'} text-ariel-turquoise`}></i> {lang === 'he' ? 'תקציר המאמר וניתוח ממצאים' : 'Article Summary & Analysis'}
        </h3>
        <div className="space-y-6 text-base md:text-lg text-slate-700 leading-relaxed text-justify">
          {lang === 'he' ? (
            <>
              <p>תעשיית התיירות היא אחת התעשיות הצומחות ביותר בעולם, אך בד בבד עולה הדאגה לבטיחותם של תיירים בעת אירועי חירום. תיירים נחשבים לאוכלוסייה פגיעה יותר מתושבים מכיוון שהם פחות מכירים את הסביבה, את השפה המקומית ואת פרוטוקולי הבטיחות. מחקר זה מציע מסגרת עבודה מקיפה לניתוב פינוי יעיל ובטוח יותר.</p>
              <p>אחד החידושים המרכזיים במאמר הוא הצעה למנגנון איסוף נתונים פסיבי (Passive data collection) שאינו מסתמך על רשתות סלולריות הנוטות לקרוס בעת אסון. השימוש בחיישני BLE מאפשר ניטור רציף ומדויק של תנועת תיירים גם בתוך מבנים מורכבים.</p>
              <p>המחקר מראה כי שילוב של "למידת עמיתים" – שבה תייר מונחה משפיע על תייר מבולבל – מאיץ משמעותית את תהליך הפינוי הכולל. הסימולציה מדגימה את הסיכון בטעויות ניווט ואת התופעה של "תיירים זהירים" החוזרים לנקודה האחרונה כשהם הולכים לאיבוד.</p>
            </>
          ) : (
            <>
              <p>The tourism industry is one of the fastest-growing in the world, yet concerns for tourist safety during emergencies are rising. Tourists are more vulnerable than locals as they are less familiar with the environment, local language, and safety protocols. This research proposes a comprehensive framework for efficient and safer evacuation routing.</p>
              <p>A key innovation in the article is the proposal of a passive data collection mechanism that does not rely on cellular networks, which tend to collapse during disasters. The use of BLE sensors allows for continuous and accurate monitoring of tourist movement even within complex buildings.</p>
              <p>The study shows that integrating "peer learning"—where a guided tourist influences a confused one—significantly accelerates the overall evacuation process. The simulation demonstrates the risks of routing mistakes and the phenomenon of "cautious tourists" returning to their last known point when lost.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
