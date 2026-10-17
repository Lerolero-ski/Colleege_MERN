import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Toast } from './components/Toast';
import { DemoModal } from './components/DemoModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Dashboard } from './pages/Dashboard';
import { DemoDetails } from './pages/DemoDetails';
import { demoService } from './api/demoService';

export const App = () => {
  // Navigation & View State
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'details'
  const [selectedDemoId, setSelectedDemoId] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);

  // Demos & Filtering State
  const [demos, setDemos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [toast, setToast] = useState(null);

  // Backend Health
  const [healthData, setHealthData] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Check health on mount
  useEffect(() => {
    demoService
      .getHealth()
      .then((data) => setHealthData(data))
      .catch((err) => console.warn('Could not fetch health status:', err.message));
  }, []);

  // Sync with browser hash (e.g. #/demo/123)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/demo/')) {
        const id = hash.replace('#/demo/', '');
        setSelectedDemoId(id);
        setCurrentView('details');
      } else {
        setSelectedDemoId(null);
        setCurrentView('dashboard');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch Demos from Express REST API
  const loadDemos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await demoService.getDemos({
        search,
        type: activeType,
        sort: sortBy
      });
      setDemos(res.data || []);
    } catch (err) {
      console.error('Failed to load demos:', err);
      setError(err.message || 'Could not connect to ShaderLab server');
    } finally {
      setIsLoading(false);
    }
  }, [search, activeType, sortBy]);

  useEffect(() => {
    // Debounce search slightly to avoid excessive calls
    const timer = setTimeout(() => {
      loadDemos();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadDemos]);

  // Navigate to Dedicated Demo View
  const handleViewDemo = (demo) => {
    setSelectedDemoId(demo._id);
    setSelectedDemo(demo);
    window.location.hash = `#/demo/${demo._id}`;
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Dashboard
  const handleBackToDashboard = () => {
    window.location.hash = '';
    setCurrentView('dashboard');
    setSelectedDemoId(null);
    setSelectedDemo(null);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (demo) => {
    setModalInitialData(demo);
    setIsModalOpen(true);
  };

  // Create or Update Submission
  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      if (modalInitialData) {
        // Update existing demo
        const res = await demoService.updateDemo(modalInitialData._id, formData);
        showToast('success', 'Experiment Updated', `"${formData.title}" was successfully updated.`);
        if (selectedDemoId === modalInitialData._id) {
          setSelectedDemo(res.data);
        }
      } else {
        // Create new demo
        const res = await demoService.createDemo(formData);
        showToast('success', 'Experiment Published', `"${formData.title}" added to your playground!`);
      }
      setIsModalOpen(false);
      setModalInitialData(null);
      loadDemos();
    } catch (err) {
      showToast('error', 'Operation Failed', err.message || 'Unable to save experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true);
      await demoService.deleteDemo(id);
      showToast('info', 'Experiment Removed', 'The demo has been deleted from your playground.');
      setDeleteTarget(null);
      if (currentView === 'details' && selectedDemoId === id) {
        handleBackToDashboard();
      }
      loadDemos();
    } catch (err) {
      showToast('error', 'Deletion Failed', err.message || 'Could not delete demo');
    } finally {
      setIsDeleting(false);
    }
  };

  // Seed / Reset Default Demos
  const handleSeed = async () => {
    try {
      setIsSeeding(true);
      const res = await demoService.resetSeedDemos();
      showToast('success', 'Playground Reset', `Loaded ${res.count || 3} sample graphics experiments!`);
      loadDemos();
    } catch (err) {
      showToast('error', 'Reset Failed', err.message || 'Could not reset sample demos');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-slate-100 font-sans">
      
      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Top Navigation */}
      <Navbar
        onOpenCreate={handleOpenCreate}
        onSeed={handleSeed}
        healthData={healthData}
        totalDemos={demos.length}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'dashboard' ? (
          <Dashboard
            demos={demos}
            isLoading={isLoading}
            error={error}
            onRetry={loadDemos}
            search={search}
            setSearch={setSearch}
            activeType={activeType}
            setActiveType={setActiveType}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onViewDemo={handleViewDemo}
            onEditDemo={handleOpenEdit}
            onDeleteDemo={(demo) => setDeleteTarget(demo)}
            onOpenCreate={handleOpenCreate}
          />
        ) : (
          <DemoDetails
            demoId={selectedDemoId}
            initialDemo={selectedDemo}
            onBack={handleBackToDashboard}
            onEdit={handleOpenEdit}
            onDelete={(demo) => setDeleteTarget(demo)}
          />
        )}
      </main>

      {/* Create / Edit Modal */}
      <DemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalInitialData}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        demo={deleteTarget}
        isDeleting={isDeleting}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-dark-900/50 py-8 mt-16 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            ShaderLab — Complete MERN Stack Graphics Demo Playground
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React + Vite</span>
            <span>•</span>
            <span>Node / Express REST API</span>
            <span>•</span>
            <span>MongoDB Atlas</span>
            <span>•</span>
            <span>HTML5 Canvas</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
