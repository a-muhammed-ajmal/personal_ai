/**
 * TOOLKIT VAULT — Engine 02: Asset Engine
 * Design: The Architect's Notebook — Emerald accent
 * Implementation toolkit: SOPs, KPIs, CRM structures, checklists
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Wrench, Copy } from 'lucide-react';
import { consultingStore, generateId, type ToolkitItem } from '@/lib/store';
import { toast } from 'sonner';

const EMERALD = 'oklch(0.72 0.17 160)';

const CATEGORIES = ['SOP Template', 'KPI Dashboard', 'CRM Structure', 'Audit Checklist', 'Discovery Questions', 'Other'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'SOP Template': 'oklch(0.78 0.16 175)',
  'KPI Dashboard': 'oklch(0.78 0.17 65)',
  'CRM Structure': 'oklch(0.72 0.17 160)',
  'Audit Checklist': 'oklch(0.65 0.2 290)',
  'Discovery Questions': 'oklch(0.78 0.16 175)',
  'Other': 'oklch(0.55 0.03 240)',
};

const emptyItem = (): Omit<ToolkitItem, 'id' | 'updatedAt'> => ({
  name: '', category: 'SOP Template', description: '', content: '',
});

export default function ToolkitVault() {
  const [items, setItems] = useState<ToolkitItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setItems(consultingStore.getToolkit()); }, []);
  const reload = () => setItems(consultingStore.getToolkit());

  const handleSave = () => {
    if (!form.name.trim() || !form.content.trim()) { toast.error('Name and content are required'); return; }
    if (editingId) {
      consultingStore.updateToolkitItem(editingId, { ...form, updatedAt: new Date().toISOString() });
      toast.success('Tool updated');
    } else {
      consultingStore.addToolkitItem({ ...form, id: generateId(), updatedAt: new Date().toISOString() });
      toast.success('Tool added to vault');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyItem());
  };

  const handleEdit = (item: ToolkitItem) => {
    setForm({ name: item.name, category: item.category, description: item.description, content: item.content });
    setEditingId(item.id); setShowForm(true);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => toast.success('Copied to clipboard'));
  };

  const filtered = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: EMERALD }}>ENGINE 02 · ASSET</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Implementation Toolkit Vault
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            SOPs · KPI dashboards · CRM structures · Audit checklists · Discovery questions
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyItem()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Tool
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded transition-all duration-150"
            style={{
              background: activeCategory === cat ? `${CATEGORY_COLORS[cat] || EMERALD}20` : 'oklch(0.22 0.05 240)',
              border: `1px solid ${activeCategory === cat ? `${CATEGORY_COLORS[cat] || EMERALD}50` : 'oklch(1 0 0 / 0.06)'}`,
              color: activeCategory === cat ? (CATEGORY_COLORS[cat] || EMERALD) : 'oklch(0.65 0.03 240)',
              fontFamily: 'DM Sans', fontSize: '12px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <Wrench size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {items.length === 0 ? 'No tools yet. Build your implementation toolkit as you go.' : 'No tools in this category.'}
            </div>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="rounded-lg overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${CATEGORY_COLORS[item.category]}20` }}>
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                style={{ borderBottom: expandedId === item.id ? '1px solid oklch(1 0 0 / 0.05)' : 'none' }}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-8 rounded" style={{ background: CATEGORY_COLORS[item.category] }} />
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', color: 'oklch(0.9 0.01 80)' }}>{item.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="status-badge" style={{ background: `${CATEGORY_COLORS[item.category]}15`, color: CATEGORY_COLORS[item.category] }}>{item.category}</span>
                      {item.description && <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.5 0.03 240)' }}>{item.description}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleCopy(item.content); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }} title="Copy content"><Copy size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); consultingStore.deleteToolkitItem(item.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-5 pb-5 pt-3">
                  <pre style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.75 0.01 80)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {item.content}
                  </pre>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.35 0.03 240)', marginTop: '8px' }}>
                    Updated: {new Date(item.updatedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Tool' : 'Add Toolkit Item'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Tool Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Business Audit Checklist" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Short Description</label>
                  <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Content *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={12} placeholder="Paste your template, checklist, or framework here..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '12px', lineHeight: 1.7 }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Add Tool'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
