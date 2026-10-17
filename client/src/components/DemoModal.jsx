import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders, Palette, Activity, Loader2 } from 'lucide-react';
import { ANIMATION_TYPES, COLOR_OPTIONS } from '../graphics/canvasEngineFactory';
import { CanvasPlayer } from './CanvasPlayer';

export const DemoModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [animationType, setAnimationType] = useState('particles');
  const [speed, setSpeed] = useState(1.0);
  const [count, setCount] = useState(80);
  const [colorScheme, setColorScheme] = useState('cyber-violet');
  const [interactive, setInteractive] = useState(true);
  const [tags, setTags] = useState('canvas, interactive');
  const [author, setAuthor] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAnimationType(initialData.animationType || 'particles');
      setSpeed(initialData.parameters?.speed ?? 1.0);
      setCount(initialData.parameters?.count ?? 80);
      setColorScheme(initialData.parameters?.colorScheme || 'cyber-violet');
      setInteractive(initialData.parameters?.interactive !== false);
      setTags(Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''));
      setAuthor(initialData.author || '');
    } else {
      setTitle('');
      setDescription('');
      setAnimationType('particles');
      setSpeed(1.2);
      setCount(90);
      setColorScheme('cyber-violet');
      setInteractive(true);
      setTags('canvas, simulation, interactive');
      setAuthor('Lab Engineer');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Adjust default count when animationType switches
  const handleTypeSelect = (typeId) => {
    setAnimationType(typeId);
    if (typeId === 'bouncing_balls' && count > 40) {
      setCount(24);
    } else if (typeId === 'starfield' && count < 150) {
      setCount(200);
    } else if (typeId === 'particles' && count < 60) {
      setCount(85);
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length > 80) errs.title = 'Title cannot exceed 80 characters';

    if (!description.trim()) errs.description = 'Description is required';
    else if (description.trim().length > 500) errs.description = 'Description cannot exceed 500 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      animationType,
      parameters: {
        speed: Number(speed),
        count: Number(count),
        colorScheme,
        interactive: Boolean(interactive)
      },
      tags: parsedTags.length > 0 ? parsedTags : [animationType],
      author: author.trim() || 'Anonymous Lab Developer'
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-dark-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-lab-violet/10 border border-lab-violet/20 text-lab-violet">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white font-mono">
                {isEdit ? 'Edit Graphics Experiment' : 'Create New Experiment'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure canvas procedural parameters and metadata
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Title and Author */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Experiment Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Quantum Wave Constellation"
                className={`w-full px-3.5 py-2 rounded-xl bg-dark-850 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 transition-all ${
                  errors.title ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-lab-violet focus:ring-lab-violet/30'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-400 font-mono">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your Name / Handle"
                className="w-full px-3.5 py-2 rounded-xl bg-dark-850 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lab-violet focus:ring-1 focus:ring-lab-violet/30"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-medium text-slate-300">
                Description <span className="text-rose-400">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                {description.length}/500 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mathematical behavior, visual properties, and interaction mechanics..."
              className={`w-full px-3.5 py-2 rounded-xl bg-dark-850 border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 transition-all resize-none ${
                errors.description ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-800 focus:border-lab-violet focus:ring-lab-violet/30'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-400 font-mono">{errors.description}</p>}
          </div>

          {/* Animation Type Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-medium text-slate-300">
              Animation Type Engine <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ANIMATION_TYPES.map((type) => {
                const isSelected = animationType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-lab-violet/15 border-lab-violet shadow-sm shadow-lab-violet/30 text-white'
                        : 'bg-dark-850 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold">{type.badge}</span>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                      {type.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameters & Live Mini Preview Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/70">
            
            {/* Parameters Controls */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-lab-cyan" />
                <span>Simulation Parameters</span>
              </h4>

              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Velocity Speed:</span>
                  <span className="text-slate-200 font-bold">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Count / Density Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {animationType === 'bouncing_balls' ? 'Sphere Count:' : 'Particle Density:'}
                  </span>
                  <span className="text-slate-200 font-bold">{count}</span>
                </div>
                <input
                  type="range"
                  min={animationType === 'bouncing_balls' ? 6 : 20}
                  max={animationType === 'bouncing_balls' ? 45 : 250}
                  step={animationType === 'bouncing_balls' ? 1 : 10}
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Color Scheme Picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-400">
                  Color Palette Theme:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setColorScheme(c.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all ${
                        colorScheme === c.id
                          ? 'bg-dark-750 border-white/30 text-white shadow-sm'
                          : 'bg-dark-850 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span className="truncate">{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-400">
                  Tags (comma-separated):
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="physics, canvas, glow"
                  className="w-full px-3 py-1.5 rounded-lg bg-dark-850 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-lab-violet"
                />
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="space-y-2 flex flex-col">
              <h4 className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-lab-violet" />
                <span>Live Parameter Preview</span>
              </h4>
              <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 bg-dark-950 relative min-h-[190px]">
                <CanvasPlayer
                  animationType={animationType}
                  parameters={{ speed, count, colorScheme, interactive }}
                  compact={true}
                  autoPlay={true}
                  heightClass="h-48"
                  className="border-0 rounded-none h-full"
                />
              </div>
              <p className="text-[11px] font-mono text-slate-500 text-center">
                Preview updates in real-time with selected parameters
              </p>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-slate-700/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 border border-indigo-400/30 transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? 'Save Changes' : 'Publish Experiment'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
