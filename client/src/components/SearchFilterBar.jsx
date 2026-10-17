import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const FILTER_OPTIONS = [
  { id: 'all', label: 'All Demos' },
  { id: 'particles', label: 'Particles' },
  { id: 'bouncing_balls', label: 'Bouncing Balls' },
  { id: 'starfield', label: 'Starfield' },
  { id: 'matrix_rain', label: 'Matrix Rain' }
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'views', label: 'Most Viewed' },
  { id: 'title', label: 'Alphabetical (A-Z)' }
];

export const SearchFilterBar = ({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  sortBy,
  onSortChange,
  totalCount
}) => {
  const searchInputRef = useRef(null);

  // Keyboard shortcut: pressing '/' focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-4 mb-8">
      {/* Search Input & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search experiments by title, description, or #tag... (Press '/' to focus)"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-lab-violet focus:ring-1 focus:ring-lab-violet/40 transition-all font-mono"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-800"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer pr-1"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-dark-900 text-slate-200">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Filter Tabs & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = activeType === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onTypeChange(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  isActive
                    ? 'bg-lab-violet text-white shadow-md shadow-lab-violet/20'
                    : 'bg-dark-900 text-slate-400 hover:text-slate-200 hover:bg-dark-850 border border-slate-800/80'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing <span className="text-slate-300 font-semibold">{totalCount}</span> experiments
        </div>
      </div>
    </div>
  );
};
