import React, { useState } from 'react';
import {
  User, Mail, Lock, Phone, Calendar, ArrowRight, RotateCcw,
  Check, AlertCircle, Info, ChevronRight, BookOpen, BarChart2,
  TrendingUp, TrendingDown, Home, ShoppingCart, ShoppingBag, CheckSquare, Flame,
  DollarSign, Activity, Eye, EyeOff, Search, Star, Utensils, Coffee,
  Clock, Compass, Shield, Zap, Sparkles, Filter, Tag, CheckCircle2, Plus
} from 'lucide-react';
import { Scene3D } from './Scene3D';

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
  'search': Search,
  'star': Star,
  'utensils': Utensils,
  'coffee': Coffee,
  'clock': Clock,
  'compass': Compass,
  'shield': Shield,
  'zap': Zap,
  'sparkles': Sparkles,
  'tag': Tag
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
    const subtext = comp.props?.subtext || comp.props?.subtitle || '';
    const align = comp.props?.align || 'left';
    const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

    return (
      <div className={`mb-3 ${alignClass}`}>
        {level === 1 ? (
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-1.5">
            {text}
          </h1>
        ) : level === 2 ? (
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
            {text}
          </h2>
        ) : (
          <h3 className="text-xl font-semibold text-slate-100 mb-1">
            {text}
          </h3>
        )}
        {subtext && (
          <p className="text-xs sm:text-sm text-[#BDB3C1] max-w-2xl leading-relaxed mt-1">
            {subtext}
          </p>
        )}
      </div>
    );
  },

  'text': ({ comp, theme }) => {
    const text = comp.props?.text || '';
    const align = comp.props?.align || 'left';
    const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
    return (
      <p className={`text-sm ${alignClass} text-[#BDB3C1] leading-relaxed mb-4`}>
        {text}
      </p>
    );
  },

  'button': ({ comp, theme, onAction, formId }) => {
    const label = comp.props?.label || 'Button';
    const variant = comp.props?.variant || 'primary';
    const fullWidth = comp.props?.full_width || comp.props?.fullWidth;
    const iconName = comp.props?.icon;
    const actionId = comp.action_id || comp.props?.action_id;
    const isReset = actionId === 'form.reset';

    const handleClick = (e) => {
      if (actionId && onAction) {
        onAction(actionId, {
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
          className={`${baseClasses} text-[#100D12] hover:opacity-95 font-black hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#EAAA00] focus:ring-offset-[#100D12]`}
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
          className={`${baseClasses} border border-[#DDE3E8]/20 bg-[#19141C] text-[#F4F0F5] hover:bg-[#241B28] hover:border-[#EAAA00]/50`}
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
          className={`${baseClasses} text-[#BDB3C1] hover:bg-[#19141C] hover:text-white`}
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
    const inputType = comp.props?.type || 'text';
    const isRequired = comp.validation?.required || comp.props?.required;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
            {isRequired && <span className="text-[#EAAA00] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {comp.props?.icon && (
            <div className="absolute left-3 text-[#EAAA00] pointer-events-none">
              {renderIcon(comp.props.icon)}
            </div>
          )}
          <input
            type={inputType}
            id={comp.id}
            name={comp.props?.name || comp.id}
            placeholder={comp.props?.placeholder || ''}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 ${
              comp.props?.icon ? 'pl-9 pr-3' : 'px-3'
            } ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/10'
                : 'border-[#DDE3E8]/15 bg-[#19141C] text-white placeholder-slate-500 focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40'
            } focus:outline-none`}
          />
        </div>
        {err && <span className="text-xs text-red-400 font-medium">{err}</span>}
      </div>
    );
  },

  'email-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    const isRequired = comp.validation?.required || comp.props?.required;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
            {isRequired && <span className="text-[#EAAA00] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[#EAAA00] pointer-events-none">
            <Mail className="w-4 h-4" />
          </div>
          <input
            type="email"
            id={comp.id}
            name={comp.props?.name || comp.id}
            placeholder={comp.props?.placeholder || 'you@example.com'}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 pl-9 pr-3 ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/10'
                : 'border-[#DDE3E8]/15 bg-[#19141C] text-white placeholder-slate-500 focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40'
            } focus:outline-none`}
          />
        </div>
        {err && <span className="text-xs text-red-400 font-medium">{err}</span>}
      </div>
    );
  },

  'password-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const [showPassword, setShowPassword] = useState(false);
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    const isRequired = comp.validation?.required || comp.props?.required;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
            {isRequired && <span className="text-[#EAAA00] ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-[#EAAA00] pointer-events-none">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id={comp.id}
            name={comp.props?.name || comp.id}
            placeholder={comp.props?.placeholder || '••••••••'}
            value={value}
            onChange={(e) => setFormValue(comp.id, e.target.value)}
            className={`w-full text-sm rounded-xl border transition-all duration-150 py-2.5 pl-9 pr-10 ${
              err
                ? 'border-red-500 focus:ring-red-400 bg-red-500/10'
                : 'border-[#DDE3E8]/15 bg-[#19141C] text-white placeholder-slate-500 focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40'
            } focus:outline-none`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#BDB3C1] hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {err && <span className="text-xs text-red-400 font-medium">{err}</span>}
      </div>
    );
  },

  'number-input': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
            {comp.validation?.required && <span className="text-[#EAAA00] ml-1">*</span>}
          </label>
        )}
        <input
          type="number"
          id={comp.id}
          value={value}
          placeholder={comp.props?.placeholder || ''}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-[#DDE3E8]/15 bg-[#19141C] text-white px-3 py-2.5 focus:outline-none focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40"
        />
        {err && <span className="text-xs text-red-400 font-medium">{err}</span>}
      </div>
    );
  },

  'textarea': ({ comp, theme, formValues, setFormValue, errors }) => {
    const value = formValues?.[comp.id] || '';
    const err = errors?.[comp.id];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
            {comp.validation?.required && <span className="text-[#EAAA00] ml-1">*</span>}
          </label>
        )}
        <textarea
          id={comp.id}
          rows={comp.props?.rows || 4}
          placeholder={comp.props?.placeholder || ''}
          value={value}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-[#DDE3E8]/15 bg-[#19141C] text-white placeholder-slate-500 p-3 focus:outline-none focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40 leading-relaxed"
        />
        {err && <span className="text-xs text-red-400 font-medium">{err}</span>}
      </div>
    );
  },

  'select': ({ comp, theme, formValues, setFormValue }) => {
    const value = formValues?.[comp.id] || '';
    const options = comp.props?.options || [];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {comp.props?.label && (
          <label className="text-xs font-semibold text-[#DDE3E8]">
            {comp.props.label}
          </label>
        )}
        <select
          id={comp.id}
          value={value}
          onChange={(e) => setFormValue(comp.id, e.target.value)}
          className="w-full text-sm rounded-xl border border-[#DDE3E8]/15 bg-[#19141C] text-white px-3 py-2.5 focus:outline-none focus:border-[#EAAA00] focus:ring-1 focus:ring-[#EAAA00]/40"
        >
          {options.map((opt, i) => (
            <option key={i} value={typeof opt === 'object' ? opt.value : opt} className="bg-[#19141C] text-white">
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
          className="w-4 h-4 rounded border-[#DDE3E8]/20 text-[#EAAA00] focus:ring-[#EAAA00] bg-[#19141C]"
        />
        <span className="text-[#DDE3E8] text-xs sm:text-sm">
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
          <span className="text-xs font-semibold text-[#DDE3E8]">
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
                  className="w-4 h-4 text-[#EAAA00] focus:ring-[#EAAA00] bg-[#19141C]"
                />
                <span className="text-[#BDB3C1] text-xs sm:text-sm">{lbl}</span>
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
        className="w-full space-y-4 bg-[#19141C]/90 border border-[#DDE3E8]/15 hover:border-[#EAAA00]/30 transition-all p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-xl"
      >
        {renderChildren(comp.children, { formId })}
      </form>
    );
  },

  'card': ({ comp, theme, renderChildren }) => {
    const { title, value, description, content, price, badge, trend, progress, image } = comp.props || {};
    const textDesc = description || content;

    return (
      <div className="p-5 rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C]/90 hover:border-[#EAAA00]/40 transition-all duration-200 text-[#F4F0F5] hover:shadow-xl shadow-black/40 flex flex-col justify-between">
        {image && (
          <div className="w-full h-40 rounded-xl overflow-hidden mb-3 border border-[#DDE3E8]/10 bg-[#100D12]">
            <img src={image} alt={title || 'Card asset'} className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <div className="flex items-start justify-between gap-2">
            {title && <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>}
            {badge && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/25">
                {badge}
              </span>
            )}
          </div>
          {value && <div className="text-2xl font-black mt-2 tracking-tight text-white">{value}</div>}
          {price && <div className="text-xl font-black mt-2 text-[#EAAA00]">{price}</div>}
          {textDesc && <p className="text-xs text-[#BDB3C1] mt-2 leading-relaxed">{textDesc}</p>}
          {trend && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#EAAA00] mt-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{trend}</span>
            </div>
          )}
          {typeof progress === 'number' && (
            <div className="mt-3">
              <div className="w-full bg-[#100D12] h-2 rounded-full overflow-hidden border border-[#DDE3E8]/10">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#3A0F34] to-[#EAAA00] transition-all duration-500"
                />
              </div>
              <span className="text-[10px] text-[#BDB3C1] mt-1 block text-right font-mono">{progress}%</span>
            </div>
          )}
        </div>
        {comp.children && <div className="mt-4">{renderChildren(comp.children)}</div>}
      </div>
    );
  },

  'metric-card': ({ comp, theme }) => {
    const { title, value, change, trend = 'up', accent = '#EAAA00', subtext, icon } = comp.props || {};
    const isUp = trend === 'up';

    return (
      <div className="p-5 rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C] hover:border-[#EAAA00]/40 transition-all duration-200 shadow-xl shadow-black/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#BDB3C1]">{title}</span>
          {icon ? (
            <div className="w-7 h-7 rounded-lg bg-[#241B28] flex items-center justify-center text-[#EAAA00]">
              {renderIcon(icon, "w-3.5 h-3.5")}
            </div>
          ) : (
            <span style={{ backgroundColor: accent }} className="w-2 h-2 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2 font-mono">
          {value || '0'}
        </div>
        {(change || subtext) && (
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-2.5">
            {change && (
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                isUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
              }`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
              </span>
            )}
            {subtext && <span className="text-[11px] text-[#BDB3C1] truncate">{subtext}</span>}
          </div>
        )}
      </div>
    );
  },

  'scene-3d': ({ comp, theme }) => (
    <Scene3D
      model={comp.props?.model || 'furniture'}
      height={comp.props?.height || 360}
      accentColor={comp.props?.accentColor || theme?.primary || '#EAAA00'}
      title={comp.props?.title || 'Interactive 3D Experience'}
      subtitle={comp.props?.subtitle || 'Drag to rotate • Real-time WebGL engine'}
      showControls={comp.props?.showControls !== false}
      autoRotateSpeed={comp.props?.autoRotateSpeed || 1.2}
    />
  ),

  'hero-banner': ({ comp, theme, onAction }) => {
    const { badge = 'Featured Collection', title, subtitle, ctaLabel = 'Explore Now', secondaryLabel, image } = comp.props || {};
    return (
      <div className="relative rounded-3xl p-6 sm:p-10 my-6 bg-gradient-to-r from-[#241B28] via-[#19141C] to-[#100D12] border border-[#DDE3E8]/15 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#EAAA00]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          {badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/25">
              <Sparkles className="w-3 h-3 text-[#EAAA00]" />
              {badge}
            </span>
          )}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {title || 'Designed for the Modern Living'}
          </h2>
          <p className="text-sm sm:text-base text-[#BDB3C1] leading-relaxed">
            {subtitle || 'Experience architectural craftsmanship tailored to your personalized aesthetic.'}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onAction && onAction('hero.cta', {})}
              style={{ backgroundColor: theme?.primary || '#EAAA00' }}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-black text-[#100D12] hover:opacity-95 shadow-lg shadow-[#EAAA00]/20 flex items-center gap-2 cursor-pointer"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            {secondaryLabel && (
              <button
                onClick={() => onAction && onAction('hero.secondary', {})}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-[#DDE3E8] bg-[#19141C] border border-[#DDE3E8]/20 hover:bg-[#241B28] cursor-pointer"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  },

  'product-card': ({ comp, theme, onAction }) => {
    const { title = 'Minimalist Lounge Chair', price = '$590', category = 'Living Room', rating = 4.9, image, badge } = comp.props || {};
    return (
      <div className="group rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C] p-4 flex flex-col justify-between hover:border-[#EAAA00]/50 transition-all duration-200 shadow-xl">
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#100D12] border border-[#DDE3E8]/10 mb-4">
          <img
            src={image || 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&auto=format&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {badge && (
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/30 shadow-md">
              {badge}
            </span>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] text-[#BDB3C1] mb-1">
            <span>{category}</span>
            <div className="flex items-center gap-1 text-[#EAAA00]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">{title}</h4>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#DDE3E8]/10">
          <span className="text-base font-black text-[#EAAA00] font-mono">{price}</span>
          <button
            onClick={() => onAction && onAction('cart.add', { title, price })}
            className="px-3 py-1.5 rounded-xl bg-[#241B28] hover:bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/25 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    );
  },

  'menu-item': ({ comp, theme, onAction }) => {
    const { title, price, description, tags = [], calories } = comp.props || {};
    return (
      <div className="p-4 rounded-xl border border-[#DDE3E8]/15 bg-[#19141C] flex items-start justify-between gap-4 hover:border-[#EAAA00]/30 transition-all">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{title || 'Signature Dish'}</h4>
            {calories && <span className="text-[10px] text-[#BDB3C1] font-mono">{calories} kcal</span>}
          </div>
          <p className="text-xs text-[#BDB3C1] leading-relaxed">{description || 'Crafted with seasonal artisanal ingredients.'}</p>
          <div className="flex items-center gap-1.5 pt-1">
            {tags.map((t, idx) => (
              <span key={idx} className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-[#3A0F34] text-[#EAAA00]">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-sm font-black text-[#EAAA00] font-mono">{price || '$24'}</span>
          <button
            onClick={() => onAction && onAction('menu.order', { title, price })}
            className="px-2.5 py-1 rounded-lg bg-[#EAAA00] text-[#100D12] text-[11px] font-black hover:bg-[#D49A00] transition-colors cursor-pointer"
          >
            Order
          </button>
        </div>
      </div>
    );
  },

  'filter-bar': ({ comp, onAction }) => {
    const filters = comp.props?.filters || ['All Items', 'Trending', 'Living Room', 'Workspace', 'Lighting'];
    const active = comp.props?.active || filters[0];
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-2 my-2 no-scrollbar">
        {filters.map((f, i) => (
          <button
            key={i}
            onClick={() => onAction && onAction('filter.select', { filter: f })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              active === f
                ? 'bg-[#EAAA00] text-[#100D12] shadow-sm'
                : 'bg-[#19141C] border border-[#DDE3E8]/15 text-[#BDB3C1] hover:text-white hover:border-[#DDE3E8]/30'
            }`}
          >
            {f}
          </button>
        ))}
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
            ? 'bg-[#EAAA00] text-[#100D12] shadow-sm'
            : 'bg-[#19141C] border border-[#DDE3E8]/15 text-[#DDE3E8] hover:border-[#EAAA00]/50 hover:text-white'
        }`}
      >
        {label}
      </span>
    );
  },

  'table': ({ comp, theme }) => {
    const { title, columns = [], rows = [] } = comp.props || {};
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C] my-4 shadow-xl">
        {title && (
          <div className="px-5 py-3.5 border-b border-[#DDE3E8]/10 font-bold text-sm text-white flex items-center justify-between">
            <span>{title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/30 font-bold">
              Live Data
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-[#241B28] text-[#BDB3C1] border-b border-[#DDE3E8]/10">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-5 py-3 font-bold">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE3E8]/10">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#241B28]/50 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-5 py-3.5 text-xs sm:text-sm text-[#DDE3E8]">
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
    const { title = 'Adaptive Experience', items = [] } = comp.props || {};
    return (
      <nav className="flex items-center justify-between px-6 py-3.5 rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C]/90 text-white mb-6 shadow-xl backdrop-blur-md">
        <div className="font-bold text-base tracking-tight flex items-center gap-2">
          <span className="text-[#EAAA00] text-lg">◆</span>
          <span className="text-white font-black">{title}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {items.map((item, i) => {
            const isActive = currentPageId === item.page_id;
            return (
              <button
                key={i}
                onClick={() => onNavigate && onNavigate(item.page_id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#3A0F34] text-[#EAAA00] font-bold border border-[#EAAA00]/30 shadow-sm'
                    : 'text-[#BDB3C1] hover:text-white hover:bg-[#241B28]'
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
    const { title = 'Performance Velocity', chart_type = 'bar', data = [45, 62, 85, 54, 98, 76, 89] } = comp.props || {};
    return (
      <div className="p-5 rounded-2xl border border-[#DDE3E8]/15 bg-[#19141C] my-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <span className="text-[11px] text-[#BDB3C1]">Real-time telemetry stream</span>
          </div>
          <span className="text-xs text-[#EAAA00] capitalize font-bold px-2 py-0.5 rounded bg-[#3A0F34] border border-[#EAAA00]/25">
            {chart_type}
          </span>
        </div>
        <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2">
          {data.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div
                style={{
                  height: `${h}%`,
                  backgroundColor: i === data.length - 1 ? '#EAAA00' : '#3A0F34',
                  opacity: i === data.length - 1 ? 1 : 0.85
                }}
                className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-y-[1.03] transform origin-bottom shadow-md shadow-black"
              />
              <span className="text-[10px] text-[#BDB3C1] font-mono">P{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },

  'progress': ({ comp, theme }) => {
    const { label, value = 65, max = 100 } = comp.props || {};
    const percent = Math.min(100, Math.round((value / max) * 100));
    return (
      <div className="space-y-1.5 my-3">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-[#DDE3E8]">{label}</span>
          <span className="text-[#EAAA00] font-mono">{percent}%</span>
        </div>
        <div className="w-full bg-[#100D12] border border-[#DDE3E8]/10 h-2.5 rounded-full overflow-hidden">
          <div
            style={{ width: `${percent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-[#3A0F34] to-[#EAAA00] transition-all duration-500"
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
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : type === 'success'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : 'bg-[#3A0F34]/50 border-[#EAAA00]/30 text-[#DDE3E8]'
      }`}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#EAAA00]" />
        <p className="text-xs leading-relaxed font-medium">{message}</p>
      </div>
    );
  },

  'divider': () => (
    <hr className="my-6 border-t border-[#DDE3E8]/10" />
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
      className="w-full h-auto rounded-2xl object-cover my-4 border border-[#DDE3E8]/15"
    />
  ),
};

// Map underscored aliases to ensure 100% interoperability across AI engines & fallbacks
ComponentRegistry['text_input'] = ComponentRegistry['text-input'];
ComponentRegistry['email_input'] = ComponentRegistry['email-input'];
ComponentRegistry['password_input'] = ComponentRegistry['password-input'];
ComponentRegistry['number_input'] = ComponentRegistry['number-input'];
ComponentRegistry['radio_group'] = ComponentRegistry['radio-group'];
ComponentRegistry['flex_row'] = ComponentRegistry['flex-row'];
ComponentRegistry['flex_col'] = ComponentRegistry['flex-col'];
ComponentRegistry['metric_card'] = ComponentRegistry['metric-card'];
ComponentRegistry['scene_3d'] = ComponentRegistry['scene-3d'];
ComponentRegistry['model-3d'] = ComponentRegistry['scene-3d'];
ComponentRegistry['model_3d'] = ComponentRegistry['scene-3d'];
ComponentRegistry['canvas-3d'] = ComponentRegistry['scene-3d'];
ComponentRegistry['canvas_3d'] = ComponentRegistry['scene-3d'];
ComponentRegistry['hero_banner'] = ComponentRegistry['hero-banner'];
ComponentRegistry['product_card'] = ComponentRegistry['product-card'];
ComponentRegistry['menu_item'] = ComponentRegistry['menu-item'];
ComponentRegistry['filter_bar'] = ComponentRegistry['filter-bar'];
