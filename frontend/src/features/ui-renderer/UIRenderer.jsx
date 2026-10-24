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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-[#BDB3C1]">
        <p className="text-sm font-semibold">No UI specification available.</p>
        <p className="text-xs text-[#BDB3C1]/60 mt-1">Submit a prompt in the chat to generate a functional interface.</p>
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

    const compType = comp.type || '';
    const hyphenated = compType.replace(/_/g, '-');
    const underscored = compType.replace(/-/g, '_');
    const Component = ComponentRegistry[compType] || ComponentRegistry[hyphenated] || ComponentRegistry[underscored];

    if (!Component) {
      return (
        <div key={comp.id} className="p-3 my-2 border border-dashed border-[#DDE3E8]/20 rounded-xl bg-[#19141C] text-xs text-[#BDB3C1] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#EAAA00]" />
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

  const isAuthLayout = activePage.layout === 'auth' || activePage.layout === 'form';
  const isTwoColLayout = activePage.layout === 'two-column';

  return (
    <div
      style={{
        '--primary-theme': theme.primary || '#EAAA00',
      }}
      className="min-h-full w-full p-4 sm:p-8 transition-colors duration-300 text-[#F4F0F5]"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#19141C] border border-[#EAAA00]/50 text-white shadow-2xl text-xs font-semibold backdrop-blur-xl animate-bounce">
          <CheckCircle className="w-4 h-4 text-[#EAAA00] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Layout Rendering */}
      {isAuthLayout ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-8">
          <div className="w-full max-w-md space-y-4">
            {activePage.components.map(comp => renderComponent(comp))}
          </div>
        </div>
      ) : isTwoColLayout ? (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {activePage.components.map(comp => renderComponent(comp))}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {activePage.components.map(comp => renderComponent(comp))}
        </div>
      )}
    </div>
  );
}

function findComponent(components, id) {
  if (!components || !Array.isArray(components)) return null;
  for (const c of components) {
    if (c.id === id) return c;
    if (c.children) {
      const found = findComponent(c.children, id);
      if (found) return found;
    }
  }
  return null;
}
