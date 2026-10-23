import React, { useState } from 'react';
import {
  User, Mail, Lock, Phone, Calendar, ArrowRight, RotateCcw,
  Check, AlertCircle, Info, ChevronRight, BookOpen, BarChart2,
  TrendingUp, Home, ShoppingCart, ShoppingBag, CheckSquare, Flame,
  DollarSign, Activity, Eye, EyeOff, Search
} from 'lucide-react';

const ICON_MAP = {
  'user': User,
  'mail': Mail,
  'lock': Lock,
  'phone': Phone,
  'calendar': Calendar,
  'arrow-right': ArrowRight,
  'rotate-ccw': RotateCcw,
  'book': BookOpen,
  'bar-chart': BarChart2,
  'home': Home,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  'check-square': CheckSquare,
  'flame': Flame,
  'dollar-sign': DollarSign,
  'activity': Activity,
  'target': TrendingUp,
  'search': Search
};

function renderIcon(iconName, className = "w-4 h-4") {
  if (!iconName) return null;
  const IconComponent = ICON_MAP[iconName.toLowerCase()];
  return IconComponent ? <IconComponent className={className} /> : null;
}

export const ComponentRegistry = {
  'container': ({ comp, renderChildren, theme }) => (
    <div className={`w-full max-w-5xl mx-auto px-4 py-6 ${comp.props?.className || ''}`}>
      {renderChildren(comp.children)}
    </div>
  ),

  'section': ({ comp, renderChildren }) => (
    <section className={`my-6 space-y-4 ${comp.props?.className || ''}`}>
      {renderChildren(comp.children)}
    </section>
  ),

  'heading': ({ comp, theme }) => {
    const level = comp.props?.level || 2;
    const text = comp.props?.text || 'Heading';
    const align = comp.props?.align || 'left';
    const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

    if (level === 1) {
      return (
        <h1 className={`text-3xl font-black tracking-tight ${alignClass} text-white mb-2`}>
          {text}
        </h1>
      );
    }
    if (level === 2) {
      return (
        <h2 className={`text-2xl font-bold tracking-tight ${alignClass} text-white mb-2`}>
          {text}
        </h2>
      );
    }
    return (
      <h3 className={`text-xl font-semibold ${alignClass} text-slate-100 mb-2`}>
        {text}
      </h3>
    );
  },

  'text': ({ comp, theme }) => {
    const text = comp.props?.text || '';
    const align = comp.props?.align || 'left';
    const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
    return (
      <p className={`text-sm ${alignClass} text-slate-400 leading-relaxed mb-4`}>
        {text}
      </p>
    );
  },

  'button': ({ comp, theme, onAction, formId }) => {
    const label = comp.props?.label || 'Button';
    const variant = comp.props?.variant || 'primary';
    const fullWidth = comp.props?.full_width;
    const iconName = comp.props?.icon;
    const isReset = comp.action_id === 'form.reset';

    const handleClick = (e) => {
      if (comp.action_id && onAction) {
        onAction(comp.action_id, {
          form_id: formId,
          component_id: comp.id,
          payload: comp.props?.action_payload || {}
        });
      }
    };

    let baseClasses = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer shadow-md active:scale-[0.98] select-none ";
    if (fullWidth) baseClasses += "w-full ";

    if (variant === 'primary') {
      return (
        <button
          type={isReset ? "reset" : "button"}
          onClick={handleClick}
          style={{ backgroundColor: theme?.primary || '#EAAA00' }}
          className={`${baseClasses} text-white hover:opacity-90 hover:shadow-glow-rose/30 focus:ring-2 focus:ring-offset-2 focus:ring-neon-rose focus:ring-offset-jet-black`}
        >
          {renderIcon(iconName)}
          <span>{label}</span>
        </button>
      );
    } else if (variant === 'outline') {
      return (
        <button
          type={isReset ? "reset" : "button"}
          onClick={handleClick}
          className={`${baseClasses} border border-border-charcoal bg-surface-card text-slate-200 hover:bg-surface-hover hover:border-cerulean/50 hover:text-white`}
        >
          {renderIcon(iconName)}
          <span>{label}</span>
        </button>
      );
    } else {
      return (
        <button
          type={isReset ? "reset" : "button"}
          onClick={handleClick}
          className={`${baseClasses} text-slate-400 hover:bg-surface-card hover:text-slate-200`}
        >
          {renderIcon(iconName)}
          <span>{label}</span>
        </button>
      );
    }
  },

  'text-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
            {comp.validation?.required && <span className="text-neon-rose ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {comp.props?.icon && (
            <div className="absolute left-3 text-cerulean-400 pointer-events-none">
              {renderIcon(comp.props.icon)}
            </div>
          )}
          <input
            type="text"
            id={comp.id}
            name={comp.id}
            placeholder={comp.props?.placeholder || ''}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 ${
              comp.props?.icon ? 'pl-9 pr-3' : 'px-3'
            } ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/5'
                : 'border-border-charcoal bg-surface-input text-white placeholder-slate-500 focus:border-cerulean focus:ring-1 focus:ring-cerulean/40'
            } focus:outline-none`}
          />
        </div>
        {err && <span className="text-xs text-neon-rose font-medium">{err}</span>}
      </div>
    );
  },

  'email-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
            {comp.validation?.required && <span className="text-neon-rose ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-cerulean-400 pointer-events-none">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            id={comp.id}
            name={comp.id}
            placeholder={comp.props?.placeholder || 'you@example.com'}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 pl-9 pr-3 ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/5'
                : 'border-border-charcoal bg-surface-input text-white placeholder-slate-500 focus:border-cerulean focus:ring-1 focus:ring-cerulean/40'
            } focus:outline-none`}
          />
        </div>
        {err && <span className="text-xs text-neon-rose font-medium">{err}</span>}
      </div>
    );
  },

  'password-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const [showPassword, setShowPassword] = useState(false);
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
            {comp.validation?.required && <span className="text-neon-rose ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-cerulean-400 pointer-events-none">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id={comp.id}
            name={comp.id}
            placeholder={comp.props?.placeholder || '••••••••'}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 pl-9 pr-10 ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/5'
                : 'border-border-charcoal bg-surface-input text-white placeholder-slate-500 focus:border-cerulean focus:ring-1 focus:ring-cerulean/40'
            } focus:outline-none`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-cerulean-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {err && <span className="text-xs text-neon-rose font-medium">{err}</span>}
      </div>
    );
  },

  'number-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
            {comp.validation?.required && <span className="text-neon-rose ml-1">*</span>}
          </label>
        )}
        <input
          type="number"
          id={comp.id}
          value={value}
          placeholder={comp.props?.placeholder || ''}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-border-charcoal bg-surface-input text-white px-3 py-2.5 focus:outline-none focus:border-cerulean focus:ring-1 focus:ring-cerulean/40"
        />
        {err && <span className="text-xs text-neon-rose font-medium">{err}</span>}
      </div>
    );
  },

  'textarea': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
            {comp.validation?.required && <span className="text-neon-rose ml-1">*</span>}
          </label>
        )}
        <textarea
          id={comp.id}
          rows={comp.props?.rows || 4}
          placeholder={comp.props?.placeholder || ''}
          value={value}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-border-charcoal bg-surface-input text-white placeholder-slate-500 p-3 focus:outline-none focus:border-cerulean focus:ring-1 focus:ring-cerulean/40 leading-relaxed"
        />
        {err && <span className="text-xs text-neon-rose font-medium">{err}</span>}
      </div>
    );
  },

  'select': ({ comp, theme, formValues, setFormValue }) => {
    const value = formValues?.[comp.id] || '';
    const options = comp.props?.options || [];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-slate-300">
            {comp.props.label}
          </label>
        )}
        <select
          id={comp.id}
          value={value}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-border-charcoal bg-surface-input text-white px-3 py-2.5 focus:outline-none focus:border-cerulean focus:ring-1 focus:ring-cerulean/40"
        >
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === 'object' ? opt.value : opt} className="bg-surface-card text-white">
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
      </div>
    );
  },

  'checkbox': ({ comp, theme, formValues, setFormValue }) => {
    const checked = Boolean(formValues?.[comp.id]);
    return (
      <label className="flex items-center gap-3 cursor-pointer select-none text-sm my-1.5">
        <input
          type="checkbox"
          id={comp.id}
          checked={checked}
          onChange={(e) => setFormValue(comp.id, e.target.checked)}
          className="w-4 h-4 rounded border-border-charcoal text-neon-rose focus:ring-neon-rose bg-surface-input"
        />
        <span className="text-slate-300">
          {comp.props?.label}
        </span>
      </label>
    );
  },

  'radio-group': ({ comp, theme, formValues, setFormValue }) => {
    const selected = formValues?.[comp.id] || '';
    const options = comp.props?.options || [];
    return (
      <div className="flex flex-col gap-2 my-2">
        {comp.props?.label && (
          <span className="text-xs font-semibold text-slate-300">
            {comp.props.label}
          </span>
        )}
        <div className="flex flex-col gap-1.5">
          {options.map((opt, i) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <label key={i} className="flex items-center gap-2.5 cursor-pointer text-sm">
                <input
                  type="radio"
                  name={comp.id}
                  value={val}
                  checked={selected === val}
                  onChange={() => setFormValue(comp.id, val)}
                  className="w-4 h-4 text-neon-rose focus:ring-neon-rose bg-surface-input"
                />
                <span className="text-slate-300">{lbl}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  },

  'form': ({ comp, renderChildren, theme, onAction, formValues, onResetForm }) => {
    const formId = comp.id;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (onAction) {
        onAction('form.submit_demo', {
          form_id: formId,
          form_data: formValues || {},
        });
      }
    };

    const handleReset = (e) => {
      e.preventDefault();
      if (onResetForm) onResetForm(formId);
      if (onAction) {
        onAction('form.reset', { form_id: formId });
      }
    };

    return (
      <form
        id={formId}
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="w-full space-y-4 bg-surface-card/90 border border-border-charcoal hover:border-cerulean/30 transition-all p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
      >
        {renderChildren(comp.children, { formId })}
      </form>
    );
  },

  'card': ({ comp, theme, renderChildren }) => {
    const { title, value, description, price, badge, trend, progress } = comp.props || {};
    return (
      <div
        className="p-5 rounded-2xl border border-border-charcoal bg-surface-card/80 hover:border-cerulean/50 transition-all duration-200 text-slate-100 hover:shadow-lg shadow-black/40"
      >
        <div className="flex items-start justify-between">
          {title && <h4 className="text-sm font-semibold text-slate-400">{title}</h4>}
          {badge && (
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-neon-rose/15 text-neon-rose border border-neon-rose/30"
            >
              {badge}
            </span>
          )}
        </div>
        {value && <div className="text-2xl font-black mt-2 tracking-tight text-white">{value}</div>}
        {price && <div className="text-xl font-black mt-2 text-cerulean-400">{price}</div>}
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cerulean-400 mt-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{trend}</span>
          </div>
        )}
        {typeof progress === 'number' && (
          <div className="mt-3">
            <div className="w-full bg-surface-panel h-2 rounded-full overflow-hidden border border-border-charcoal">
              <div
                style={{ width: `${progress}%` }}
                className="h-full rounded-full bg-gradient-to-r from-cerulean to-neon-rose transition-all duration-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-right font-medium">{progress}%</span>
          </div>
        )}
        {comp.children && <div className="mt-4">{renderChildren(comp.children)}</div>}
      </div>
    );
  },

  'badge': ({ comp, theme }) => {
    const label = comp.props?.label || 'Badge';
    const active = comp.props?.active;
    return (
      <span
        className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
          active
            ? 'bg-neon-rose text-white shadow-glow-rose/25'
            : 'bg-surface-card border border-border-charcoal text-slate-300 hover:border-cerulean/50 hover:text-white'
        }`}
      >
        {label}
      </span>
    );
  },

  'table': ({ comp, theme }) => {
    const { title, columns = [], rows = [] } = comp.props || {};
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-border-charcoal bg-surface-card/90 my-4 shadow-xl">
        {title && (
          <div className="px-5 py-3.5 border-b border-border-charcoal font-bold text-sm text-white flex items-center justify-between">
            <span>{title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-cerulean/20 text-cerulean-300 border border-cerulean/30">Active Table</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-surface-panel text-slate-400 border-b border-border-charcoal">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-5 py-3 font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-charcoal/60">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-surface-hover/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-5 py-3.5 text-sm text-slate-300">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  },

  'navigation': ({ comp, theme, onNavigate, currentPageId }) => {
    const { title = 'Navigation', items = [] } = comp.props || {};
    return (
      <nav className="flex items-center justify-between px-6 py-3.5 rounded-2xl border border-border-charcoal bg-surface-panel/90 text-white mb-6 shadow-xl backdrop-blur-md">
        <div className="font-bold text-base tracking-tight flex items-center gap-2">
          <span className="text-neon-rose text-lg">◆</span>
          <span className="text-white font-black">{title}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {items.map((item, i) => {
            const isActive = currentPageId === item.page_id;
            return (
              <button
                key={i}
                onClick={() => onNavigate && onNavigate(item.page_id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cerulean/20 text-cerulean-300 font-bold border border-cerulean/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-surface-hover'
                }`}
              >
                {renderIcon(item.icon, "w-3.5 h-3.5")}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  },

  'chart': ({ comp, theme }) => {
    const { title = 'Performance', chart_type = 'line' } = comp.props || {};
    return (
      <div className="p-5 rounded-2xl border border-border-charcoal bg-surface-card/90 my-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className="text-xs text-cerulean-400 capitalize font-medium">{chart_type} Chart</span>
        </div>
        {/* SVG Chart visualization styled with Cerulean and Neon Rose */}
        <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2">
          {[45, 62, 80, 54, 95, 76, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 4 ? '#EAAA00' : '#3A0F34',
                  opacity: i === 4 ? 1 : 0.75
                }}
                className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-y-[1.02] transform origin-bottom shadow-sm shadow-black"
              />
              <span className="text-[10px] text-slate-500 font-mono">D{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },

  'progress': ({ comp, theme }) => {
    const { label, value = 50, max = 100 } = comp.props || {};
    const percent = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-300">{label}</span>
          <span className="text-cerulean-400 font-mono">{percent}%</span>
        </div>
        <div className="w-full bg-surface-panel border border-border-charcoal h-2.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${percent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-cerulean to-neon-rose transition-all duration-500"
          />
        </div>
      </div>
    );
  },

  'alert': ({ comp, theme }) => {
    const { type = 'info', message = '' } = comp.props || {};
    return (
      <div className={`flex items-start gap-3 p-4 rounded-xl border my-3 ${
        type === 'error'
          ? 'bg-neon-rose/10 border-neon-rose/30 text-neon-rose'
          : type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-cerulean/10 border-cerulean/30 text-cerulean-300'
      }`}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">{message}</p>
      </div>
    );
  },

  'divider': ({ comp, theme }) => (
    <hr className="my-6 border-t border-border-charcoal" />
  ),

  'grid': ({ comp, renderChildren }) => {
    const cols = comp.props?.columns || 3;
    const colClass = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
    return (
      <div className={`grid ${colClass} gap-4 my-4`}>
        {renderChildren(comp.children)}
      </div>
    );
  },

  'flex-row': ({ comp, renderChildren }) => (
    <div className={`flex items-center gap-3 flex-wrap my-3 ${comp.props?.className || ''}`}>
      {renderChildren(comp.children)}
    </div>
  ),

  'flex-col': ({ comp, renderChildren }) => (
    <div className={`flex flex-col gap-3 my-3 ${comp.props?.className || ''}`}>
      {renderChildren(comp.children)}
    </div>
  ),

  'spacer': ({ comp }) => (
    <div style={{ height: `${comp.props?.size || 16}px` }} />
  ),

  'image': ({ comp }) => (
    <img
      src={comp.props?.src || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80'}
      alt={comp.props?.alt || 'Generated interface asset'}
      className="w-full h-auto rounded-2xl object-cover my-4 border border-border-charcoal"
    />
  ),
};
