import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../utils/audio';

interface GameColorMatchProps {
  onSuccess: () => void;
  onFailure?: () => void;
}

interface ColorNode {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  symbol: string;
}

const COLOR_SET: ColorNode[] = [
  { id: 'red', name: 'RED', color: '#ef4444', borderColor: '#b91c1c', symbol: 'R' },
  { id: 'blue', name: 'BLUE', color: '#3b82f6', borderColor: '#1d4ed8', symbol: 'B' },
  { id: 'green', name: 'GREEN', color: '#10b981', borderColor: '#047857', symbol: 'G' },
  { id: 'yellow', name: 'YELLOW', color: '#eab308', borderColor: '#a16207', symbol: 'Y' },
  { id: 'purple', name: 'PURPLE', color: '#a855f7', borderColor: '#7e22ce', symbol: 'P' },
];

export const GameColorMatch: React.FC<GameColorMatchProps> = ({ onSuccess }) => {
  const [leftNodes, setLeftNodes] = useState<ColorNode[]>([]);
  const [rightNodes, setRightNodes] = useState<ColorNode[]>([]);
  const [connections, setConnections] = useState<Record<string, string>>({}); // leftId -> rightId
  const [draggingLeftId, setDraggingLeftId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [won, setWon] = useState(false);

  // Reference to the exact board container holding both the SVG and the pins
  const boardRef = useRef<HTMLDivElement | null>(null);
  const leftPinRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rightPinRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const l = [...COLOR_SET];
    const r = [...COLOR_SET].sort(() => Math.random() - 0.5);
    setLeftNodes(l);
    setRightNodes(r);
    setConnections({});
  }, []);

  const getPinCoords = (element: HTMLElement | null) => {
    if (!element || !boardRef.current) return { x: 0, y: 0 };
    const bRect = boardRef.current.getBoundingClientRect();
    const eRect = element.getBoundingClientRect();
    return {
      x: eRect.left - bRect.left + eRect.width / 2,
      y: eRect.top - bRect.top + eRect.height / 2,
    };
  };

  const updateMouse = (e: React.MouseEvent | React.TouchEvent) => {
    if (!boardRef.current) return;
    const bRect = boardRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setMousePos({
      x: clientX - bRect.left,
      y: clientY - bRect.top,
    });
  };

  const handleStartDrag = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    if (won) return;
    sounds.playSelect();
    setDraggingLeftId(id);
    updateMouse(e);
  };

  const handleDropOnRight = (rightId: string) => {
    if (!draggingLeftId || won) return;
    sounds.playKanaObtained();

    const nextConn = { ...connections, [draggingLeftId]: rightId };
    setConnections(nextConn);
    setDraggingLeftId(null);
    setMousePos(null);

    // Verify all correct
    if (Object.keys(nextConn).length === COLOR_SET.length) {
      const allMatched = Object.entries(nextConn).every(([l, r]) => l === r);
      if (allMatched) {
        setWon(true);
        sounds.playSuccess();
        setTimeout(() => onSuccess(), 750);
      } else {
        sounds.playFail();
      }
    }
  };

  const handleGlobalUp = () => {
    if (draggingLeftId) {
      setDraggingLeftId(null);
      setMousePos(null);
    }
  };

  const removeConnection = (leftId: string) => {
    if (won) return;
    sounds.playBlip(320);
    const next = { ...connections };
    delete next[leftId];
    setConnections(next);
  };

  return (
    <div className="flex flex-col items-center select-none font-pixel w-full max-w-sm">
      <div className="flex justify-between items-center w-full mb-2 text-xs">
        <span className="text-amber-400">CIRCUIT MATRIX</span>
        <span className="text-cyan-400 text-[10px]">DRAG WIRES TO MATCH</span>
      </div>

      {/* Board container: Exact parent of SVG and pins */}
      <div
        ref={boardRef}
        onMouseMove={(e) => draggingLeftId && updateMouse(e)}
        onTouchMove={(e) => draggingLeftId && updateMouse(e)}
        onMouseUp={handleGlobalUp}
        onTouchEnd={handleGlobalUp}
        className="relative bg-slate-950 p-4 border-4 border-slate-700 shadow-2xl w-full h-[270px] flex justify-between items-center overflow-hidden"
      >
        {/* SVG Flexible Wires Layer: Exact coordinate match */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {/* Completed Wire Connections */}
          {Object.entries(connections).map(([leftId, rightId]) => {
            const leftEl = leftPinRefs.current[leftId];
            const rightEl = rightPinRefs.current[rightId];
            const start = getPinCoords(leftEl);
            const end = getPinCoords(rightEl);
            const color = COLOR_SET.find((c) => c.id === leftId)?.color || '#e2e8f0';

            const cX1 = start.x + (end.x - start.x) * 0.45;
            const cX2 = start.x + (end.x - start.x) * 0.55;

            return (
              <g key={`${leftId}-${rightId}`}>
                {/* Outer shadow / cable jacket */}
                <path
                  d={`M ${start.x} ${start.y} C ${cX1} ${start.y}, ${cX2} ${end.y}, ${end.x} ${end.y}`}
                  stroke="rgba(0,0,0,0.7)"
                  strokeWidth="7"
                  fill="none"
                />
                {/* Inner colored wire */}
                <path
                  d={`M ${start.x} ${start.y} C ${cX1} ${start.y}, ${cX2} ${end.y}, ${end.x} ${end.y}`}
                  stroke={color}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Terminal Connection Caps */}
                <circle cx={start.x} cy={start.y} r="4" fill="#facc15" stroke="#000" strokeWidth="1" />
                <circle cx={end.x} cy={end.y} r="4" fill="#facc15" stroke="#000" strokeWidth="1" />
              </g>
            );
          })}

          {/* Currently Dragged Live Wire */}
          {draggingLeftId && mousePos && (
            (() => {
              const leftEl = leftPinRefs.current[draggingLeftId];
              const start = getPinCoords(leftEl);
              const color = COLOR_SET.find((c) => c.id === draggingLeftId)?.color || '#facc15';
              const cX1 = start.x + (mousePos.x - start.x) * 0.45;
              const cX2 = start.x + (mousePos.x - start.x) * 0.55;

              return (
                <g>
                  <path
                    d={`M ${start.x} ${start.y} C ${cX1} ${start.y}, ${cX2} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                    stroke="rgba(0,0,0,0.6)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <path
                    d={`M ${start.x} ${start.y} C ${cX1} ${start.y}, ${cX2} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                    stroke={color}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="5 2"
                  />
                  <circle cx={start.x} cy={start.y} r="4" fill="#ffffff" />
                  <circle cx={mousePos.x} cy={mousePos.y} r="5" fill={color} stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            })()
          )}
        </svg>

        {/* Left Input Terminals */}
        <div className="flex flex-col gap-3.5 z-20">
          {leftNodes.map((node) => {
            const isConnected = !!connections[node.id];
            return (
              <div key={node.id} className="flex items-center gap-2">
                <div
                  ref={(el) => { leftPinRefs.current[node.id] = el; }}
                  onMouseDown={(e) => handleStartDrag(node.id, e)}
                  onTouchStart={(e) => handleStartDrag(node.id, e)}
                  onClick={() => isConnected && removeConnection(node.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs cursor-grab active:cursor-grabbing transition-transform ${
                    isConnected ? 'ring-2 ring-yellow-400/80 scale-95' : 'hover:scale-110 shadow-lg'
                  }`}
                  style={{ backgroundColor: node.color, borderColor: node.borderColor }}
                >
                  <span className="text-black font-extrabold text-[10px]">{node.symbol}</span>
                </div>
                <span className="text-[9px] text-slate-300 font-mono tracking-wider">{node.name}</span>
              </div>
            );
          })}
        </div>

        {/* Right Output Terminals */}
        <div className="flex flex-col gap-3.5 z-20">
          {rightNodes.map((node) => {
            const isConnectedToMe = Object.values(connections).includes(node.id);
            return (
              <div key={node.id} className="flex items-center gap-2">
                <span className="text-[9px] text-slate-300 font-mono tracking-wider">{node.name}</span>
                <div
                  ref={(el) => { rightPinRefs.current[node.id] = el; }}
                  onMouseUp={() => handleDropOnRight(node.id)}
                  onTouchEnd={() => handleDropOnRight(node.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs cursor-pointer transition-transform ${
                    isConnectedToMe ? 'ring-2 ring-emerald-400 scale-95' : 'hover:scale-110 shadow-lg'
                  }`}
                  style={{ backgroundColor: node.color, borderColor: node.borderColor }}
                >
                  <span className="text-black font-extrabold text-[10px]">{node.symbol}</span>
                </div>
              </div>
            );
          })}
        </div>

        {won && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center border-2 border-emerald-400 p-4 animate-in fade-in z-30">
            <span className="text-emerald-400 text-sm mb-1 font-bold">★ CIRCUIT ENERGIZED! ★</span>
            <span className="text-[10px] text-slate-300 mb-3">All lines securely terminated!</span>
            <button
              onClick={() => onSuccess()}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold border-2 border-white cursor-pointer shadow-lg"
            >
              CLAIM REWARD NOW
            </button>
          </div>
        )}
      </div>

      <p className="text-[9px] text-slate-400 mt-2 text-center">
        Drag from each left node to its matching color on the right. Tap a connected node to disconnect.
      </p>
    </div>
  );
};
