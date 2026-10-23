import React, { useState } from 'react';
import { ComponentRegistry } from './ComponentRegistry';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function UIRenderer({
  spec,
  currentPageId,
  onNavigate,
  onAction,
  toastMessage
}) {
  // Local state for all form inputs keyed by component ID
  const [formStates, setFormStates] = useState({});
  const [formErrors, setFormErrors] = useState({});

  if (!spec || !spec.pages || spec.pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
        <p className="text-sm">No UI specification available.</p>
        <p className="text-xs text-slate-600 mt-1">Submit a prompt in the chat to generate a functional interface.</p>
      </div>
    );
  }

  // Active page resolution
  const activePageId = currentPageId || spec.current_page_id || spec.pages[0].id;
  const activePage = spec.pages.find(p => p.id === activePageId) || spec.pages[0];

  const theme = spec.theme || { mode: 'dark', primary: '#EAAA00', secondary: '#3A0F34' };

  const setFormValue = (compId, value) => {
    setFormStates(prev => ({ ...prev, [compId]: value }));
    if (formErrors[compId]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[compId];
        return next;
      });
    }
  };

  const handleResetForm = (formId) => {
    const formComp = findComponent(activePage.components, formId);
    if (formComp && formComp.children) {
      const idsToClear = [];
      const collectIds = (items) => {
        items.forEach(c => {
          idsToClear.push(c.id);
          if (c.children) collectIds(c.children);
        });
      };
      collectIds(formComp.children);

      setFormStates(prev => {
        const next = { ...prev };
        idsToClear.forEach(id => delete next[id]);
        return next;
      });
    } else {
      setFormStates({});
    }
    setFormErrors({});
  };

  const renderComponent = (comp, context = {}) => {
    if (!comp || comp.hidden) return null;

    const Component = ComponentRegistry[comp.type];

    if (!Component) {
      return (
        <div key={comp.id} className="p-3 my-2 border border-dashed border-border-charcoal rounded-xl bg-surface-card text-xs text-slate-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-cerulean-400" />
          <span>Unknown component type: <code>{comp.type}</code> (omitted safely)</span>
        </div>
      );
    }

    const renderChildren = (children, childContext = {}) => {
      if (!children || !Array.isArray(children)) return null;
      return children.map(c => renderComponent(c, { ...context, ...childContext }));
    };

    return (
      <div key={comp.id} id={`comp-wrapper-${comp.id}`} className="transition-all duration-150">
        <Component
          comp={comp}
          theme={theme}
          renderChildren={renderChildren}
          onAction={onAction}
          onNavigate={onNavigate}
          currentPageId={activePageId}
          formId={context.formId}
          formValues={formStates}
          setFormValue={setFormValue}
          onResetForm={handleResetForm}
          errors={formErrors}
        />
      </div>
    );
  };

  const isAuthLayout = activePage.layout === 'auth';
  const isTwoColLayout = activePage.layout === 'two-column';

  return (
    <div
      style={{
        '--primary-theme': theme.primary || '#EAAA00',
      }}
      className="min-h-full w-full p-6 sm:p-10 transition-colors duration-300 text-slate-100"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface-card border border-cerulean/50 text-white shadow-glow-blue/20 shadow-xl text-xs font-semibold backdrop-blur-xl animate-bounce">
          <CheckCircle className="w-4 h-4 text-neon-rose flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Auth Layout Wrapper */}
      {isAuthLayout ? (
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <div className="w-full max-w-md">
            {activePage.components.map(comp => renderComponent(comp))}
          </div>
        </div>
      ) : isTwoColLayout ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {activePage.components.map(comp => renderComponent(comp))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4">
          {activePage.components.map(comp => renderComponent(comp))}
        </div>
      )}
    </div>
  );
}

function findComponent(components, id) {
  for (const c of components) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findComponent(c.children, id);
      if (found) return found;
    }
  }
  return null;
}
