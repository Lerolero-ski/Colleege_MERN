import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Activity, 
  MousePointer, 
  Gauge, 
  Palette 
} from 'lucide-react';
import { createGraphicsEngine, COLOR_OPTIONS } from '../graphics/canvasEngineFactory';

export const CanvasPlayer = ({
  animationType = 'particles',
  parameters = {},
  compact = false,
  autoPlay = true,
  heightClass = 'h-64',
  className = ''
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(parameters?.speed ?? 1.0);
  const [count, setCount] = useState(parameters?.count ?? (animationType === 'bouncing_balls' ? 24 : 90));
  const [colorScheme, setColorScheme] = useState(parameters?.colorScheme || 'cyber-violet');
  const [fps, setFps] = useState(60);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(!compact);

  // Initialize or re-create engine when animationType or base canvas changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = (rect.width || (compact ? 320 : 800)) * dpr;
    canvas.height = (rect.height || (compact ? 180 : 450)) * dpr;

    // Clean up previous engine
    if (engineRef.current) {
      engineRef.current.destroy();
    }

    const engine = createGraphicsEngine(animationType, canvas, {
      speed,
      count,
      colorScheme,
      interactive: parameters?.interactive !== false
    });

    engineRef.current = engine;

    if (autoPlay) {
      engine.start();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    // FPS polling timer
    const fpsInterval = setInterval(() => {
      if (engineRef.current && isPlaying) {
        setFps(engineRef.current.fps || 60);
      }
    }, 500);

    return () => {
      clearInterval(fpsInterval);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [animationType, compact]);

  // Sync speed changes to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Sync count changes to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setCount(count);
    }
  }, [count]);

  // Sync color changes to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setColorScheme(colorScheme);
    }
  }, [colorScheme]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.pause();
      setIsPlaying(false);
    } else {
      engineRef.current.start();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Reset simulation
  const handleReset = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.reset();
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      if (engineRef.current) {
        engineRef.current.reset();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative group bg-dark-950 rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl ${className}`}
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full ${isFullscreen ? 'h-screen' : heightClass} block cursor-crosshair`}
      />

      {/* Subtle scanline overlay */}
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      {/* Top Overlay Badge / FPS */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isPlaying ? 'RUNNING' : 'PAUSED'}</span>
          </div>
          
          {!compact && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
              <Activity className="w-3.5 h-3.5 text-lab-cyan" />
              <span>{fps} FPS</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {!compact && (
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-dark-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-dark-900/90 backdrop-blur-md border-t border-slate-800/80 p-3 z-10 transition-all duration-200 ${
          compact ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Main Controls: Start/Pause and Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title={isPlaying ? 'Pause Animation' : 'Start Animation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-mono bg-dark-850 hover:bg-dark-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
              title="Reset Simulation State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Detailed Tuning Controls (Shown when not in compact card view) */}
          {!compact && (
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              {/* Speed Slider */}
              <div className="flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-lab-violet" />
                <span className="text-slate-400">Speed:</span>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-20 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="w-8 text-right text-slate-200">{speed.toFixed(1)}x</span>
              </div>

              {/* Count / Density Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-lab-cyan" />
                <span className="text-slate-400">Count:</span>
                <input
                  type="range"
                  min={animationType === 'bouncing_balls' ? 6 : 20}
                  max={animationType === 'bouncing_balls' ? 50 : 250}
                  step={animationType === 'bouncing_balls' ? 2 : 10}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-20 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="w-8 text-right text-slate-200">{count}</span>
              </div>

              {/* Color Scheme Picker */}
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="bg-dark-850 border border-slate-700 text-slate-200 text-xs rounded-md px-2 py-1 outline-none focus:border-lab-violet"
                >
                  {COLOR_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Interactive Mouse Hint */}
          {!compact && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <MousePointer className="w-3 h-3 text-lab-violet" />
              <span>Interactive: Move cursor over canvas</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
