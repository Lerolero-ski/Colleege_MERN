import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, demo, isDeleting }) => {
  if (!isOpen || !demo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-dark-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-white font-mono">
              Delete Experiment?
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-200 font-mono">"{demo.title}"</strong>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-dark-850 hover:bg-dark-800 border border-slate-700/80 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => onConfirm(demo._id)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition-all disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Delete Permanently</span>
          </button>
        </div>

      </div>
    </div>
  );
};
