import React from 'react';
import { Sparkles, Terminal, Cpu, Database, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { DemoCard } from '../components/DemoCard';
import { SearchFilterBar } from '../components/SearchFilterBar';

export const Dashboard = ({
  demos,
  isLoading,
  error,
  onRetry,
  search,
  setSearch,
  activeType,
  setActiveType,
  sortBy,
  setSortBy,
  onViewDemo,
  onEditDemo,
  onDeleteDemo,
  onOpenCreate
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Hero Header */}
      <div className="relative mb-10 pb-8 border-b border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-violet/10 border border-lab-violet/25 text-lab-violet text-xs font-mono font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HTML5 Canvas Procedural Graphics Engine</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              Shader<span className="text-lab-violet">Lab</span> Playground
            </h1>
            
            <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed">
              Explore interactive canvas simulations including autonomous neural particle networks,
              kinetic elastic spheres, and relativistic warp-speed starfields. Customize parameters,
              inspect physics, and publish your own experiments.
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <div className="px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-lab-cyan" />
              <span>60 FPS Native Canvas</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-dark-900 border border-slate-800 text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-lab-violet" />
              <span>Full REST CRUD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter, and Sort Toolbar */}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={demos.length}
      />

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center my-8 max-w-xl mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-rose-200 font-mono">Connection Alert</h3>
          <p className="text-xs text-rose-300 mt-1 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-200 text-xs font-mono transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-slate-800/80 bg-dark-900/60 overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-dark-850" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
                <div className="pt-3 border-t border-slate-800 flex justify-between">
                  <div className="h-3 bg-slate-800 rounded w-1/4" />
                  <div className="h-6 bg-slate-800 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Demos Grid */}
      {!isLoading && !error && demos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map((demo) => (
            <DemoCard
              key={demo._id}
              demo={demo}
              onView={onViewDemo}
              onEdit={onEditDemo}
              onDelete={onDeleteDemo}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && demos.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-slate-800/60 bg-dark-900/30">
          <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Sparkles className="w-7 h-7 text-lab-violet" />
          </div>
          <h3 className="text-lg font-semibold text-white font-mono">No Experiments Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || activeType !== 'all'
              ? 'No graphics experiments matched your search filter criteria. Try adjusting your search term or filter category.'
              : 'There are currently no graphics experiments saved in the database. Create your first experiment to get started!'}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            {(search || activeType !== 'all') ? (
              <button
                onClick={() => {
                  setSearch('');
                  setActiveType('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Demo</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
