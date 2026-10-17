import React from 'react';
import { Eye, Edit3, Trash2, ArrowUpRight, Clock, User } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { CanvasPlayer } from './CanvasPlayer';

export const DemoCard = ({ demo, onView, onEdit, onDelete }) => {
  const formattedDate = demo.createdAt
    ? new Date(demo.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-slate-800/80 hover:border-slate-700/80">
      
      {/* Canvas Live Miniature Preview */}
      <div className="relative overflow-hidden bg-dark-950">
        <CanvasPlayer
          animationType={demo.animationType}
          parameters={demo.parameters}
          compact={true}
          autoPlay={true}
          heightClass="h-48"
          className="rounded-b-none border-0"
        />

        {/* Quick Launch Overlay Button */}
        <button
          onClick={() => onView(demo)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-dark-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-lab-violet/60 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Open in Dedicated Playground"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Badge & Meta Header */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <StatusBadge type={demo.animationType} size="xs" />
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{demo.views || 0}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onView(demo)}
            className="text-base font-semibold text-slate-100 group-hover:text-lab-violet transition-colors cursor-pointer line-clamp-1 mb-1.5"
            title={demo.title}
          >
            {demo.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {demo.description}
          </p>

          {/* Tags */}
          {demo.tags && demo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {demo.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-800 text-slate-400 border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
              {demo.tags.length > 3 && (
                <span className="text-[10px] font-mono text-slate-500">
                  +{demo.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer & Actions */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(demo)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
              title="Edit Demo"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(demo)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition-colors"
              title="Delete Demo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onView(demo)}
              className="ml-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition-colors flex items-center gap-1 font-mono"
            >
              <span>Play</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
