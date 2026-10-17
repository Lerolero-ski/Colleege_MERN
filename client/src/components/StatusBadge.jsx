import React from 'react';

const TYPE_CONFIG = {
  particles: {
    label: 'Neural Particles',
    bg: 'bg-violet-950/60',
    border: 'border-violet-700/40',
    text: 'text-violet-300',
    dot: 'bg-violet-400'
  },
  bouncing_balls: {
    label: 'Kinetic Spheres',
    bg: 'bg-amber-950/60',
    border: 'border-amber-700/40',
    text: 'text-amber-300',
    dot: 'bg-amber-400'
  },
  starfield: {
    label: 'Warp Starfield',
    bg: 'bg-cyan-950/60',
    border: 'border-cyan-700/40',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400'
  },
  matrix_rain: {
    label: 'Digital Matrix',
    bg: 'bg-emerald-950/60',
    border: 'border-emerald-700/40',
    text: 'text-emerald-300',
    dot: 'bg-emerald-400'
  }
};

export const StatusBadge = ({ type, size = 'sm' }) => {
  const config = TYPE_CONFIG[type] || {
    label: type || 'Unknown',
    bg: 'bg-slate-900',
    border: 'border-slate-700',
    text: 'text-slate-300',
    dot: 'bg-slate-400'
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium border ${config.bg} ${config.border} ${config.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-subtle`} />
      {config.label}
    </span>
  );
};
