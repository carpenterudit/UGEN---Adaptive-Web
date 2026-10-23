import React, { useEffect, useState } from 'react';
import { History, X, RotateCcw, Clock, Check } from 'lucide-react';
import { api } from '../../services/api';

export function RevisionHistoryModal({ projectId, isOpen, onClose, onRestore }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      loadRevisions();
    }
  }, [isOpen, projectId]);

  const loadRevisions = async () => {
    setLoading(true);
    try {
      const data = await api.listRevisions(projectId);
      setRevisions(data.items || []);
    } catch (err) {
      console.error('Failed to load revisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (revId) => {
    setRestoringId(revId);
    try {
      const result = await api.restoreRevision(projectId, revId);
      if (result.ui_spec && onRestore) {
        onRestore(result.ui_spec);
      }
      onClose();
    } catch (err) {
      console.error('Failed to restore revision:', err);
    } finally {
      setRestoringId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-charcoal rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-charcoal bg-surface-panel/80">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <History className="w-4 h-4 text-cerulean-400" />
            <span>Revision History</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-surface-panel/40">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-500">Loading revisions...</div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">No revisions recorded yet.</div>
          ) : (
            revisions.map((rev, index) => (
              <div
                key={rev.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border-charcoal bg-surface-card hover:border-cerulean/50 transition-all shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">
                      Revision #{rev.revision_number}
                    </span>
                    {rev.operation_type && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cerulean/15 text-cerulean-300 border border-cerulean/30 font-semibold">
                        {rev.operation_type}
                      </span>
                    )}
                    {index === 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-rose/15 text-neon-rose border border-neon-rose/30 font-bold">
                        Current
                      </span>
                    )}
                  </div>
                  {rev.description && (
                    <p className="text-xs text-slate-400 line-clamp-1">{rev.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(rev.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {index !== 0 && (
                  <button
                    onClick={() => handleRestore(rev.id)}
                    disabled={restoringId === rev.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-surface-panel border border-border-charcoal hover:bg-neon-rose hover:text-white hover:border-neon-rose text-slate-200 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
