import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { ChatPanel } from './features/chat/ChatPanel';
import { ChatInput } from './features/chat/ChatInput';
import { QuickPrompts } from './features/chat/QuickPrompts';
import { Workspace } from './features/workspace/Workspace';
import { RevisionHistoryModal } from './features/revisions/RevisionHistoryModal';
import { PreferencesModal } from './features/preferences/PreferencesModal';
import { ProjectListModal } from './features/projects/ProjectListModal';
import {
  Sparkles, Layers, Sliders, FolderKanban, RotateCcw,
  Bot, ArrowRight, ShieldCheck, Cpu
} from 'lucide-react';

export function App() {
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [uiSpec, setUiSpec] = useState(null);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);

  // User preferences
  const [preferences, setPreferences] = useState({ theme: 'dark' });

  // Initialize: load or create active project
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const prefs = await api.getPreferences('default_session');
      if (prefs) setPreferences(prefs);

      const projectsData = await api.listProjects(1, 1);
      if (projectsData.items && projectsData.items.length > 0) {
        const activeProj = projectsData.items[0];
        setProject(activeProj);
        await loadProjectData(activeProj.id);
      }
    } catch (err) {
      console.warn('Backend not ready or running offline demo:', err);
    }
  };

  const loadProjectData = async (projId) => {
    try {
      const msgsData = await api.getMessages(projId);
      if (msgsData?.messages) setMessages(msgsData.messages);

      const specData = await api.getUISpec(projId);
      if (specData?.spec) {
        setUiSpec(specData.spec);
        setCurrentPageId(specData.spec.current_page_id || specData.spec.pages?.[0]?.id);
      }
    } catch (err) {
      console.error('Error loading project data:', err);
    }
  };

  const handleSendMessage = async (content) => {
    setIsLoading(true);

    try {
      let currentProjId = project?.id;

      if (!currentProjId) {
        const newProj = await api.createProject('My Generative App');
        setProject(newProj);
        currentProjId = newProj.id;
      }

      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMsg]);

      const res = await api.sendMessage(currentProjId, content);

      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        { ...tempUserMsg, id: `user-${Date.now()}` },
        res.message
      ]);

      if (res.ui_spec) {
        setUiSpec(res.ui_spec);
        if (res.ui_spec.current_page_id) {
          setCurrentPageId(res.ui_spec.current_page_id);
        } else if (res.ui_spec.pages?.length > 0) {
          setCurrentPageId(res.ui_spec.pages[0].id);
        }
        showToast(res.explanation || 'Interface updated successfully!');
      }
    } catch (err) {
      console.error('Send message error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Failed to process request: ${err.message}`,
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (actionId, payload = {}) => {
    try {
      const response = await api.executeAction(actionId, payload, project?.id);
      if (response.message) {
        showToast(response.message);
      }
      if (actionId === 'navigation.go_to_page' && response.result?.page_id) {
        setCurrentPageId(response.result.page_id);
      }
    } catch (err) {
      console.error('Action error:', err);
      showToast(`Error: ${err.message}`);
    }
  };

  const handleNavigatePage = (pageId) => {
    setCurrentPageId(pageId);
    handleExecuteAction('navigation.go_to_page', { page_id: pageId });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNewProject = async () => {
    try {
      const newProj = await api.createProject('New Generative App');
      setProject(newProj);
      setMessages([]);
      setUiSpec(null);
      setCurrentPageId(null);
      showToast('Started new generative workspace!');
    } catch (err) {
      console.error('Create project error:', err);
    }
  };

  const hasGeneratedUI = Boolean(uiSpec && uiSpec.pages && uiSpec.pages.length > 0);

  return (
    <div className={`h-screen w-screen flex flex-col bg-jet-black text-slate-100 overflow-hidden font-sans ${preferences.theme === 'light' ? 'light' : 'dark'}`}>
      {/* Top Application Navigation Bar */}
      <header className="h-14 border-b border-border-charcoal bg-surface-panel/90 backdrop-blur-md px-6 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cerulean via-indigo-600 to-neon-rose flex items-center justify-center text-white shadow-glow-rose/25 font-black text-sm tracking-wider shadow-md">
            UP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-tight text-white">
                UPGW
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-rose/15 text-neon-rose border border-neon-rose/30 font-bold tracking-wide">
                v2.0
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-cerulean/15 text-cerulean-300 border border-cerulean/30 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-cerulean animate-pulse" />
                <ShieldCheck className="w-3 h-3 text-cerulean-400" />
                AI Demo Engine Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Workspaces Switcher */}
          <button
            onClick={() => setIsProjectsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-cerulean/50 transition-colors shadow-sm cursor-pointer"
          >
            <FolderKanban className="w-3.5 h-3.5 text-cerulean-400" />
            <span className="truncate max-w-[120px]">{project?.name || 'Workspaces'}</span>
          </button>

          {/* Preferences */}
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="p-2 rounded-xl text-xs font-medium bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-neon-rose/40 transition-colors cursor-pointer shadow-sm"
            title="User Personalization Settings"
          >
            <Sliders className="w-4 h-4 text-slate-300 hover:text-neon-rose transition-colors" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex overflow-hidden">
        {!hasGeneratedUI ? (
          /* ======================================================== */
          /* INITIAL CHAT-FIRST HERO SCREEN (Mode A Initial State)    */
          /* Futuristic dark ambient layout with Jet Black foundation */
          /* ======================================================== */
          <div className="flex-1 flex flex-col items-center justify-center p-6 ambient-workspace-bg overflow-y-auto">
            <div className="w-full max-w-2xl space-y-8 my-auto text-center">
              {/* Hero Header */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-card border border-cerulean/40 text-cerulean-300 text-xs font-bold mb-2 shadow-glow-blue/10">
                  <Sparkles className="w-3.5 h-3.5 text-neon-rose" />
                  <span>Universal Personalized Generative Web</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  What would you like to build today?
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Describe any web interface in plain language. UPGW creates functional, validated pages and workflows in real time.
                </p>
              </div>

              {/* Large Prompt Input Box */}
              <div className="text-left shadow-2xl rounded-2xl border border-border-charcoal bg-surface-card/90 backdrop-blur-xl p-2.5">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  placeholder="e.g., 'Create a registration form with name, email, phone number, and password.'"
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="text-left bg-surface-panel/80 border border-border-charcoal rounded-2xl p-5 shadow-xl backdrop-blur-md">
                <QuickPrompts onSelectPrompt={handleSendMessage} />
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* GENERATED WORKSPACE (Split Chat & Live Interface)        */
          /* ======================================================== */
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Left: Chat Side Panel (for continuous refinements) */}
            <div className="w-full md:w-[380px] lg:w-[420px] h-full flex-shrink-0 z-10 border-r border-border-charcoal">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                project={project}
                onNewProject={handleNewProject}
              />
            </div>

            {/* Right: Interactive Workspace with Live Renderer */}
            <div className="flex-1 h-full overflow-hidden">
              <Workspace
                spec={uiSpec}
                currentPageId={currentPageId}
                onNavigate={handleNavigatePage}
                onAction={handleExecuteAction}
                onOpenRevisions={() => setIsRevisionsOpen(true)}
                onOpenPreferences={() => setIsPreferencesOpen(true)}
                toastMessage={toastMessage}
              />
            </div>
          </div>
        )}
      </main>

      {/* Revisions History Modal */}
      {project && (
        <RevisionHistoryModal
          projectId={project.id}
          isOpen={isRevisionsOpen}
          onClose={() => setIsRevisionsOpen(false)}
          onRestore={(restoredSpec) => {
            setUiSpec(restoredSpec);
            setCurrentPageId(restoredSpec.current_page_id || restoredSpec.pages?.[0]?.id);
            showToast('Restored previous revision!');
          }}
        />
      )}

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesUpdated={(updated) => {
          setPreferences(updated);
          showToast('Preferences updated!');
        }}
      />

      {/* Workspaces List Modal */}
      <ProjectListModal
        isOpen={isProjectsOpen}
        onClose={() => setIsProjectsOpen(false)}
        activeProjectId={project?.id}
        onSelectProject={(selected) => {
          setProject(selected);
          loadProjectData(selected.id);
          showToast(`Switched to "${selected.name}"`);
        }}
      />
    </div>
  );
}

export default App;
