
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const SIZE = 20;
const AGENT_COUNT = 30;

interface Agent {
  id: number;
  x: number;
  y: number;
  isSmart: boolean;
  isEscaped: boolean;
}

export const EvacuationView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [policePositions, setPolicePositions] = useState<[number, number][]>([]);
  const [isPlacingPolice, setIsPlacingPolice] = useState(false);
  const [steps, setSteps] = useState(0);

  const safeZone = { x: SIZE - 1, y: 0 };
  const intervalRef = useRef<number | null>(null);

  // BFS to find shortest path from any cell to the exit (The "Expert" Map)
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
    
    // Create Walls (Spiral Pattern)
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

        // Openings
        if ((x === 10 && (y === 2 || y === 17)) || (y === 10 && (x === 2 || x === 17)) || (x === 10 && (y === 6 || y === 13))) {
          isWall = false;
        }

        if (isWall) newGrid[y][x] = 'wall';
      }
    }
    newGrid[safeZone.y][safeZone.x] = 'safe';
    setGrid(newGrid);

    // Initial Agents
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

      // 1. Interactions & Learning (Peer-to-peer and Police)
      if (isAlarmActive) {
        newAgents.forEach(agent => {
          if (agent.isEscaped) return;

          // Check Police contact (being in the same spot or right next to it)
          const metPolice = policePositions.some(([px, py]) => 
            Math.abs(px - agent.x) <= 1 && Math.abs(py - agent.y) <= 1
          );
          if (metPolice) agent.isSmart = true;

          // Check Peer contact (Social Learning)
          if (!agent.isSmart) {
            const nearSmartPeer = newAgents.find(other => 
              other.id !== agent.id && 
              !other.isEscaped && 
              other.isSmart && 
              Math.abs(other.x - agent.x) <= 1 && 
              Math.abs(other.y - agent.y) <= 1
            );
            if (nearSmartPeer) agent.isSmart = true;
          }
        });
      }

      // 2. Movement logic
      newAgents.forEach(agent => {
        if (agent.isEscaped) return;

        let nx = agent.x;
        let ny = agent.y;

        if (!isAlarmActive) {
          // Wander Randomly
          if (Math.random() > 0.6) {
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
            const tx = agent.x + dx;
            const ty = agent.y + dy;
            if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall' && grid[ty][tx] !== 'safe') {
              nx = tx; ny = ty;
            }
          }
        } else {
          // Alarm is Active
          if (agent.isSmart && distanceMap) {
            // EXPERT PATHFINDING (Avoids walls, knows BFS distance)
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [0, 0]];
            let minVal = distanceMap[agent.y][agent.x];
            let bestMoves: [number, number][] = [[agent.x, agent.y]];

            for (const [dx, dy] of dirs) {
              const tx = agent.x + dx;
              const ty = agent.y + dy;
              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE) {
                const val = distanceMap[ty][tx];
                if (val < minVal) {
                  minVal = val;
                  bestMoves = [[tx, ty]];
                } else if (val === minVal && val !== Infinity) {
                  bestMoves.push([tx, ty]);
                }
              }
            }
            const [tx, ty] = bestMoves[Math.floor(Math.random() * bestMoves.length)];
            nx = tx; ny = ty;
          } else {
            // PANIC MODE (Greedy direction + mistakes, gets stuck at walls)
            if (Math.random() > 0.3) {
              // Try to reduce distance to exit greedily (x-axis or y-axis)
              let dx = agent.x < safeZone.x ? 1 : (agent.x > safeZone.x ? -1 : 0);
              let dy = agent.y < safeZone.y ? 1 : (agent.y > safeZone.y ? -1 : 0);
              
              let tx = agent.x, ty = agent.y;
              // Bias towards moving in one direction at a time
              if (Math.random() > 0.5 && dx !== 0) tx += dx;
              else if (dy !== 0) ty += dy;
              else tx += dx;

              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall') {
                nx = tx; ny = ty;
              }
            } else {
              // 30% chance to wander or just stay still in panic
              const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
              const [dx, dy] = dirs[Math.floor(Math.random() * 4)];
              const tx = agent.x + dx;
              const ty = agent.y + dy;
              if (tx >= 0 && tx < SIZE && ty >= 0 && ty < SIZE && grid[ty][tx] !== 'wall') {
                nx = tx; ny = ty;
              }
            }
          }
        }

        // Apply Move if target is not occupied (safe zone allows multiple)
        const isOccupied = newAgents.some(other => other.id !== agent.id && !other.isEscaped && other.x === nx && other.y === ny);
        if (!isOccupied || grid[ny][nx] === 'safe') {
          agent.x = nx;
          agent.y = ny;
          if (grid[ny][nx] === 'safe') {
            agent.isEscaped = true;
          }
        }
      });

      return newAgents;
    });
  }, [grid, isAlarmActive, policePositions, distanceMap, safeZone]);

  // Main Loop
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      const escaped = agents.filter(a => a.isEscaped).length;
      if (escaped < AGENT_COUNT) {
        handleSimStep();
        if (isAlarmActive) {
          setSteps(s => s + 1);
        }
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
    if (existsIdx > -1) {
      setPolicePositions(prev => prev.filter((_, i) => i !== existsIdx));
    } else if (policePositions.length < 2) {
      setPolicePositions(prev => [...prev, [x, y]]);
    }
  };

  const escapedCount = agents.filter(a => a.isEscaped).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 flex items-center text-slate-500 hover:text-ariel-green font-bold transition-colors">
        <i className="fas fa-arrow-right ml-2"></i> חזרה לראשי
      </button>

      <header className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-ariel-green mb-8 border border-slate-100 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-grow">
            <h1 className="text-3xl font-black text-gray-800 mb-2">תכנון מסלולי פינוי תיירים (2021)</h1>
            <p className="text-slate-500 font-medium mb-4">Urban Analytics and City Science, SAGE</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://journals.sagepub.com/doi/full/10.1177/2399808321994575" 
                target="_blank" 
                rel="noreferrer"
                className="bg-ariel-green text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-md"
              >
                <i className="fas fa-external-link-alt"></i> צפייה במאמר ב-SAGE
              </a>
              <a 
                href="https://scholar.google.com/citations?view_op=view_citation&user=Y3hTWIMAAAAJ&citation_for_view=Y3hTWIMAAAAJ:L8W6d9pNpYUC" 
                target="_blank" 
                rel="noreferrer"
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-graduation-cap"></i> פרופיל Google Scholar
              </a>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[120px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">שנת פרסום</div>
            <div className="text-2xl font-black text-slate-800">2021</div>
          </div>
        </div>
      </header>

      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl p-6 mb-12 border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-map-marked-alt text-ariel-green"></i> סימולטור פינוי חכם
          </h3>
          <div className="flex gap-4 mt-4 md:mt-0 bg-gray-800 p-2 rounded-lg items-center">
            <button 
              onClick={() => setIsPlacingPolice(!isPlacingPolice)} 
              className={`px-3 py-1 text-xs rounded transition-all flex items-center gap-1 border ${isPlacingPolice ? 'bg-blue-600 border-white ring-2 ring-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-gray-600 border-gray-500'}`}
            >
              <i className="fas fa-user-shield"></i> הצב שוטר ({policePositions.length}/2)
            </button>
            <button 
              onClick={() => setIsAlarmActive(true)}
              className={`px-4 py-2 rounded font-bold transition-all shadow-lg flex items-center gap-2 text-sm ${isAlarmActive ? 'bg-red-800 opacity-50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'}`}
            >
              <i className="fas fa-bell"></i> הפעל אזעקה!
            </button>
            <button onClick={initGrid} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 font-bold transition-all shadow-lg flex items-center gap-2 text-sm">
              <i className="fas fa-undo"></i> איפוס
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-md flex justify-between text-xs font-mono text-ariel-green mb-1 px-1">
            <span>מצב: <span className={isAlarmActive ? 'text-red-500 font-bold animate-pulse' : ''}>{isAlarmActive ? 'מצב חירום' : 'שיטוט רגיל'}</span></span>
            <span>צעדים (מהאזעקה עד הפינוי): <span className="font-bold text-lg">{steps}</span></span>
          </div>
          
          <div 
            className="grid grid-cols-20 gap-[1px] bg-slate-800 p-1 rounded-lg w-full max-w-md aspect-square shadow-2xl border-4 border-slate-700 relative overflow-hidden"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
          >
            {grid.map((row, y) => row.map((cellType, x) => {
              const police = policePositions.find(([px, py]) => px === x && py === y);
              const agent = agents.find(a => !a.isEscaped && a.x === x && a.y === y);
              
              return (
                <div 
                  key={`${x}-${y}`} 
                  onClick={() => togglePolice(x, y)}
                  className={`aspect-square relative rounded-sm transition-colors duration-200 cursor-pointer flex items-center justify-center
                    ${cellType === 'wall' ? 'bg-slate-600' : ''}
                    ${cellType === 'empty' ? 'bg-slate-700 hover:bg-slate-600' : ''}
                    ${cellType === 'safe' ? 'bg-ariel-green shadow-[0_0_15px_rgba(144,192,48,0.4)]' : ''}
                    ${police ? 'bg-blue-600 ring-1 ring-white z-20 shadow-[0_0_10px_rgba(37,99,235,0.8)]' : ''}
                  `}
                >
                  {cellType === 'safe' && <i className="fas fa-door-open text-white text-[10px]"></i>}
                  {police && <i className="fas fa-user-shield text-white text-[8px]"></i>}
                  {agent && (
                    <div className={`w-[80%] h-[80%] rounded-full absolute z-10 transition-all duration-300 shadow-md
                      ${agent.isSmart ? 'bg-ariel-green border-2 border-white' : (isAlarmActive ? 'bg-red-500 animate-pulse' : 'bg-blue-500')}
                    `} />
                  )}
                </div>
              );
            }))}
          </div>
          
          <div className="mt-6 flex gap-6 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> רגיל</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> פאניקה</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-ariel-green border border-white"></div> מונחה (חכם)</div>
          </div>
          
          <div className="mt-4 font-mono text-white text-sm bg-slate-800 px-6 py-2 rounded-full border border-slate-700">
            מפונים: <span className="text-ariel-green font-bold text-lg">{escapedCount}</span> / {AGENT_COUNT}
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-black text-ariel-green mb-8 flex items-center">
          <i className="fas fa-file-alt ml-3 text-ariel-green"></i> תקציר המאמר וניתוח ממצאים
        </h3>
        
        <div className="space-y-8 text-lg text-slate-700 leading-relaxed text-justify">
          <p>
            תעשיית התיירות היא אחת התעשיות הצומחות ביותר בעולם, אך בד בבד עולה הדאגה לבטיחותם של תיירים בעת אירועי חירום. תדירות האסונות הטבעיים, לצד צמיחת המרחב האורבני, הופכת את נושא החוסן (Resilience) של תיירים למורכב במיוחד. תיירים נחשבים לאוכלוסייה פגיעה יותר מתושבים מכיוון שהם פחות מכירים את הסביבה, את השפה המקומית ואת פרוטוקולי הבטיחות. מחקר זה מציע מסגרת עבודה מקיפה לאיסוף מידע על מיקומי תיירים וזרימתם בתוך ערים, וכיצד להשתמש במידע זה לניתוב פינוי יעיל ובטוח יותר.
          </p>

          <p>
            אחד החידושים המרכזיים במאמר הוא הצעה למנגנון איסוף נתונים פסיבי (Passive data collection) שאינו מסתמך על רשתות סלולריות או Wi-Fi חיצוני, אשר נוטים לקרוס בעת אסון. השימוש בחיישני Bluetooth Low Energy (BLE) המופעלים באמצעות סוללה לטווח ארוך מאפשר ניטור רציף ומדויק של תנועת תיירים גם בתוך מבנים תלת-ממדיים מורכבים. ניתוח הנתונים מאפשר למקבלי ההחלטות להבין את ריכוזי האוכלוסייה בזמן אמת ולהקצות משאבים לנקודות התורפה (Soft points) של הרשת האורבנית.
          </p>

          <p>
            המחקר מגדיר ומסווג שלושה מודלים של התנהגות אוכלוסייה בעת פינוי: <strong>Target-oriented</strong> (תיירים עם יעד ברור), <strong>Explorer</strong> (תיירים משוטטים ללא יעד), ו-<strong>Follower</strong> (עוקבים אחר קבוצה). הסימולציה המצורפת מדגימה את הסיכון בטעויות ניווט (Routing mistakes) ואת התופעה של "תיירים זהירים" החוזרים לנקודה המאומתת האחרונה כשהם הולכים לאיבוד. המחקר מראה כי שילוב של "למידת עמיתים" – שבה תייר מונחה משפיע על תייר מבולבל – מאיץ משמעותית את תהליך הפינוי הכולל.
          </p>

          <p>
            לסיכום, המחקר מדגים באמצעות מקרה בוחן באזור Higashiyama בקיוטו (יפן) כיצד שילוב של אמצעי הכוונה מסורתיים (שוטרים, שילוט) עם פתרונות טכנולוגיים מתקדמים (אפליקציות, חיישני BLE) משפר דרמטית את אחוזי הפינוי המוצלחים. המסקנה המרכזית היא שאין להסתמך על מסלול פינוי אחיד לכולם, אלא יש לייצר הנחיה מותאמת אישית (Localized & Personalized) הלוקחת בחשבון את מאפייני התייר, רמת הידע שלו ואת תנאי השטח הדינמיים.
          </p>
        </div>
      </div>
    </div>
  );
};
