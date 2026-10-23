import React, { useState, useEffect } from 'react';
import { FolderKanban, Plus, X, ArrowRight, Calendar } from 'lucide-react';
import { api } from '../../services/api';

export function ProjectListModal({ isOpen, onClose, onSelectProject, activeProjectId }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.listProjects();
      setProjects(data.items || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const newProj = await api.createProject(newName.trim());
      setNewName('');
      loadProjects();
      if (onSelectProject) onSelectProject(newProj);
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-charcoal rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-charcoal bg-surface-panel/80">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <FolderKanban className="w-4 h-4 text-cerulean-400" />
            <span>Generative Workspaces</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create New Form */}
        <form onSubmit={handleCreate} className="p-4 border-b border-border-charcoal bg-surface-panel/50 flex gap-2">
          <input
            type="text"
            placeholder="New workspace title..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 text-xs bg-surface-input border border-border-charcoal rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cerulean focus:ring-1 focus:ring-cerulean/40"
          />
          <button
            type="submit"
            disabled={!newName.trim() || creating}
            className="flex items-center gap-1.5 px-4 py-2 bg-neon-rose hover:bg-neon-rose-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md shadow-neon-rose/25 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        </form>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-surface-panel/30">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-500">Loading workspaces...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No workspaces yet. Create one above!</div>
          ) : (
            projects.map((p) => {
              const isActive = p.id === activeProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (onSelectProject) onSelectProject(p);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'border-cerulean/60 bg-cerulean/10 shadow-glow-blue/10'
                      : 'border-border-charcoal bg-surface-card hover:border-cerulean/40 hover:bg-surface-hover'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{p.name}</span>
                      {isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cerulean/20 text-cerulean-300 font-bold border border-cerulean/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{new Date(p.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-cerulean-400" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
