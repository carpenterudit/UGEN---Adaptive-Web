import React from 'react';
import {
  Sparkles, FormInput, LayoutDashboard, ShoppingCart, CheckSquare,
  Palette, Smartphone, RotateCcw, Phone
} from 'lucide-react';

const SUGGESTIONS = [
  { label: "Login Page", icon: FormInput, prompt: "Create a login page with email, password, and sign in button." },
  { label: "Registration Form", icon: FormInput, prompt: "Build a registration form with name, email, phone number, and password." },
  { label: "Student Dashboard", icon: LayoutDashboard, prompt: "Create a student dashboard with course stats, charts, and progress tracker." },
  { label: "Task Manager", icon: CheckSquare, prompt: "Create a task manager with filters and a task creation form." },
  { label: "E-commerce Store", icon: ShoppingCart, prompt: "Build an e-commerce shopping workflow with products and cart." },
  { label: "Add Phone Field", icon: Phone, prompt: "Add a phone number field without changing anything else." },
  { label: "Green Theme", icon: Palette, prompt: "Change the entire theme to green." },
  { label: "Reset Button", icon: RotateCcw, prompt: "Add a reset button to the form." },
  { label: "Make Responsive", icon: Smartphone, prompt: "Make this interface responsive." }
];

export function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="w-full space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
        <Sparkles className="w-3.5 h-3.5 text-neon-rose" />
        <span>Suggested Prompts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(s.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-surface-card border border-border-charcoal text-slate-300 hover:text-white hover:bg-surface-hover hover:border-cerulean/50 transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-left group"
            >
              <Icon className="w-3.5 h-3.5 text-cerulean-400 group-hover:text-neon-rose transition-colors flex-shrink-0" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
