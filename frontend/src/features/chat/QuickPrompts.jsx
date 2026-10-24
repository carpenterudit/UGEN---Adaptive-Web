import React from 'react';
import {
  Sparkles, FormInput, LayoutDashboard, ShoppingCart, CheckSquare,
  Palette, Smartphone, RotateCcw, Phone, Home, Compass, Utensils, Zap
} from 'lucide-react';

const SUGGESTIONS = [
  { label: "Furniture 3D Store", icon: Home, prompt: "Create a modern furniture store website." },
  { label: "Cinematic 3D Portfolio", icon: Compass, prompt: "Build a cinematic portfolio with a 3D rotating object." },
  { label: "SaaS Analytics Dashboard", icon: LayoutDashboard, prompt: "Generate a dashboard with interactive charts and filters." },
  { label: "Restaurant & Table Booking", icon: Utensils, prompt: "Create a restaurant website with a dynamic menu and booking form." },
  { label: "Futuristic 3D Product", icon: Zap, prompt: "Build a futuristic product landing page with scroll animations." },
  { label: "Login Page", icon: FormInput, prompt: "Create a login page with email, password, and sign in button." },
  { label: "Registration Form", icon: FormInput, prompt: "Build a registration form with name, email, phone number, and password." },
  { label: "Task Manager", icon: CheckSquare, prompt: "Create a task manager with filters and a task creation form." },
  { label: "Add Phone Field", icon: Phone, prompt: "Add a phone number field without changing anything else." },
  { label: "Green Theme", icon: Palette, prompt: "Change the entire theme to green." },
  { label: "Reset Button", icon: RotateCcw, prompt: "Add a reset button to the form." }
];

export function QuickPrompts({ onSelectPrompt }) {
  return (
    <div className="w-full space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-1">
        <Sparkles className="w-3.5 h-3.5 text-[#EAAA00]" />
        <span>Suggested Prompts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectPrompt(s.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#19141C] border border-[#DDE3E8]/15 text-slate-300 hover:text-white hover:bg-[#241B28] hover:border-[#EAAA00]/50 transition-all duration-150 cursor-pointer shadow-sm active:scale-95 text-left group"
            >
              <Icon className="w-3.5 h-3.5 text-[#EAAA00] group-hover:scale-110 transition-transform flex-shrink-0" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
