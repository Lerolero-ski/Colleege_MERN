import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Sliders, 
  Code2, 
  Info, 
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { CanvasPlayer } from '../components/CanvasPlayer';
import { demoService } from '../api/demoService';

export const DemoDetails = ({
  demoId,
  initialDemo = null,
  onBack,
  onEdit,
  onDelete
}) => {
  const [demo, setDemo] = useState(initialDemo);
  const [isLoading, setIsLoading] = useState(!initialDemo);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch latest demo details and increment view count
  useEffect(() => {
    if (!demoId) return;

    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await demoService.getDemoById(demoId);
        if (isMounted && res.data) {
          setDemo(res.data);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load experiment');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      isMounted = false;
    };
  }, [demoId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center font-mono">
        <div className="inline-block animate-spin w-8 h-8 border-2 border-lab-violet border-t-transparent rounded-full mb-4" />
        <p className="text-sm text-slate-400">Loading graphics experiment studio...</p>
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-400 font-mono text-sm mb-4">{error || 'Demo not found'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  }

  const formattedDate = demo.createdAt
    ? new Date(demo.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recent';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            title="Copy experiment URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => onEdit(demo)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => onDelete(demo)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/50 text-rose-300 hover:text-rose-200 text-xs font-mono transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Large Canvas + Details Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Canvas Stage (2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-2 rounded-2xl border border-slate-800/80 shadow-2xl">
            <CanvasPlayer
              animationType={demo.animationType}
              parameters={demo.parameters}
              compact={false}
              autoPlay={true}
              heightClass="h-[480px]"
              className="w-full"
            />
          </div>

          {/* Quick Keyboard / Interaction hint bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-2">
            <span>Rendering via HTML5 2D Canvas Context</span>
            <span>Interactive physics: move cursor inside canvas</span>
          </div>
        </div>

        {/* Experiment Details Sidebar */}
        <div className="space-y-6">
          
          {/* Metadata Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <StatusBadge type={demo.animationType} size="sm" />
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{demo.views || 0} views</span>
                </div>
              </div>

              <h1 className="text-xl font-bold text-white tracking-tight leading-snug">
                {demo.title}
              </h1>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {demo.description}
            </p>

            {/* Author & Date Specs */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <User className="w-3.5 h-3.5" /> Author
                </span>
                <span className="text-slate-200">{demo.author || 'Anonymous'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Created
                </span>
                <span className="text-slate-200">{formattedDate}</span>
              </div>
            </div>

            {/* Tags */}
            {demo.tags && demo.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-xs font-mono text-slate-500 block mb-2">Tagged Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {demo.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-850 text-slate-300 border border-slate-700/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Engine Parameters Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-lab-violet" />
              <span>Engine Configuration (JSON)</span>
            </h3>

            <pre className="p-3.5 rounded-xl bg-dark-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(
                {
                  animationType: demo.animationType,
                  parameters: demo.parameters || {},
                  id: demo._id
                },
                null,
                2
              )}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
