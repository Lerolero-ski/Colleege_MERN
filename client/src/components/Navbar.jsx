import React from 'react';
import { Sparkles, Plus, Database, RotateCcw, Cpu, Layers } from 'lucide-react';

export const Navbar = ({ onOpenCreate, onSeed, healthData, totalDemos, isSeeding }) => {
  const isConnected = healthData?.database?.connected;
  const dbMode = healthData?.database?.mode;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 p-0.5 shadow-glow-violet">
              <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  Shader<span className="text-lab-violet">Lab</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-800/50">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Graphics Demo Playground • HTML5 Canvas
              </p>
            </div>
          </div>

          {/* Center Info Stats */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-850 border border-slate-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-lab-cyan" />
              <span>Demos:</span>
              <strong className="text-white">{totalDemos}</strong>
            </div>

            {/* DB Status Badge */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                isConnected
                  ? 'bg-emerald-950/50 border-emerald-800/50 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800/50 text-amber-300'
              }`}
              title={
                isConnected
                  ? 'Connected to MongoDB Atlas cluster'
                  : 'Running in In-Memory Storage Fallback mode. Fully functional for evaluation! Configure MONGODB_URI in server/.env to use MongoDB Atlas.'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span>{isConnected ? 'MongoDB Atlas' : 'In-Memory Store'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onSeed}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-slate-800 hover:border-slate-700 transition-all disabled:opacity-50"
              title="Reset initial 3 sample demos (Particle, Bouncing Balls, Starfield)"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demos</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all border border-indigo-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create Demo</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
