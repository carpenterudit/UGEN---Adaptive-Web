import React, { useState, useEffect } from 'react';
import { Sliders, X, Check, Moon, Sun, Monitor, Type, Layout } from 'lucide-react';
import { api } from '../../services/api';

export function PreferencesModal({ isOpen, onClose, onPreferencesUpdated }) {
  const [prefs, setPrefs] = useState({
    theme: 'dark',
    font_size: 'medium',
    density: 'comfortable',
    animations: true,
    reduced_motion: false,
    preferred_layout: 'split'
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    try {
      const data = await api.getPreferences('default_session');
      setPrefs({
        theme: data.theme || 'dark',
        font_size: data.font_size || 'medium',
        density: data.density || 'comfortable',
        animations: data.animations ?? true,
        reduced_motion: data.reduced_motion ?? false,
        preferred_layout: data.preferred_layout || 'split'
      });
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updatePreferences(prefs, 'default_session');
      if (onPreferencesUpdated) onPreferencesUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 600);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-card border border-border-charcoal rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-charcoal bg-surface-panel/80">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sliders className="w-4 h-4 text-neon-rose" />
            <span>Personalization Preferences</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm bg-surface-panel/40">
          {/* Theme */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Application Theme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'dark', label: 'Dark', icon: Moon },
                { val: 'light', label: 'Light', icon: Sun },
                { val: 'system', label: 'System', icon: Monitor }
              ].map(({ val, label, icon: Icon }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPrefs(p => ({ ...p, theme: val }))}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    prefs.theme === val
                      ? 'border-cerulean bg-cerulean/15 text-cerulean-300 font-bold shadow-sm'
                      : 'border-border-charcoal bg-surface-card text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Typography Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPrefs(p => ({ ...p, font_size: size }))}
                  className={`py-2 px-3 rounded-xl border text-xs capitalize font-medium transition-all cursor-pointer ${
                    prefs.font_size === size
                      ? 'border-cerulean bg-cerulean/15 text-cerulean-300 font-bold shadow-sm'
                      : 'border-border-charcoal bg-surface-card text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Information Density</label>
            <div className="grid grid-cols-3 gap-2">
              {['compact', 'comfortable', 'spacious'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPrefs(p => ({ ...p, density: d }))}
                  className={`py-2 px-3 rounded-xl border text-xs capitalize font-medium transition-all cursor-pointer ${
                    prefs.density === d
                      ? 'border-cerulean bg-cerulean/15 text-cerulean-300 font-bold shadow-sm'
                      : 'border-border-charcoal bg-surface-card text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Animations & Reduced Motion */}
          <div className="space-y-3 pt-3 border-t border-border-charcoal">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-300">UI Animations</span>
              <input
                type="checkbox"
                checked={prefs.animations}
                onChange={(e) => setPrefs(p => ({ ...p, animations: e.target.checked }))}
                className="w-4 h-4 rounded border-border-charcoal text-neon-rose bg-surface-input focus:ring-neon-rose"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-300">Reduced Motion</span>
              <input
                type="checkbox"
                checked={prefs.reduced_motion}
                onChange={(e) => setPrefs(p => ({ ...p, reduced_motion: e.target.checked }))}
                className="w-4 h-4 rounded border-border-charcoal text-neon-rose bg-surface-input focus:ring-neon-rose"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-border-charcoal bg-surface-panel/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neon-rose hover:bg-neon-rose-600 text-white transition-all shadow-md shadow-neon-rose/25 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
