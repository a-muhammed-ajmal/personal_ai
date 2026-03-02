/**
 * CONTENT SYSTEM — Engine 02: Asset Engine
 * Design: The Architect's Notebook — Emerald accent
 * Content pipeline: ideas, drafts, posts, engagement
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Lightbulb } from 'lucide-react';
import { consultingStore, generateId, formatDate, type ContentItem } from '@/lib/store';
import { toast } from 'sonner';

const EMERALD = 'oklch(0.72 0.17 160)';

const PILLARS = ['Finance', 'Systems', 'AI', 'Growth'] as const;
const STATUSES = ['Idea', 'Drafting', 'Ready', 'Posted'] as const;

const PILLAR_COLORS: Record<string, string> = {
  'Finance': 'oklch(0.78 0.17 65)',
  'Systems': 'oklch(0.78 0.16 175)',
  'AI': 'oklch(0.65 0.2 290)',
  'Growth': 'oklch(0.72 0.17 160)',
};

const STATUS_COLORS: Record<string, string> = {
  'Idea': 'oklch(0.55 0.03 240)',
  'Drafting': 'oklch(0.78 0.17 65)',
  'Ready': 'oklch(0.78 0.16 175)',
  'Posted': 'oklch(0.72 0.17 160)',
};

const emptyItem = (): Omit<ContentItem, 'id' | 'createdAt'> => ({
  topicIdea: '', pillar: 'Finance', draftStatus: 'Idea', postedDate: '', engagementNotes: '',
});

export default function ContentSystem() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyItem());
  const [filterPillar, setFilterPillar] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  useEffect(() => { setItems(consultingStore.getContent()); }, []);
  const reload = () => setItems(consultingStore.getContent());

  const handleSave = () => {
    if (!form.topicIdea.trim()) { toast.error('Topic idea is required'); return; }
    if (editingId) {
      consultingStore.updateContent(editingId, form);
      toast.success('Content updated');
    } else {
      consultingStore.addContent({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Content idea added');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyItem());
  };

  const handleEdit = (item: ContentItem) => {
    setForm({ topicIdea: item.topicIdea, pillar: item.pillar, draftStatus: item.draftStatus, postedDate: item.postedDate || '', engagementNotes: item.engagementNotes || '' });
    setEditingId(item.id); setShowForm(true);
  };

  const filtered = items.filter(i => {
    const matchPillar = filterPillar === 'All' || i.pillar === filterPillar;
    const matchStatus = filterStatus === 'All' || i.draftStatus === filterStatus;
    return matchPillar && matchStatus;
  });

  const postedCount = items.filter(i => i.draftStatus === 'Posted').length;
  const readyCount = items.filter(i => i.draftStatus === 'Ready').length;

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: EMERALD }}>ENGINE 02 · ASSET</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Content System
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Authority building · Finance · Systems · AI · Growth · Post 2–3 weekly
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyItem()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Topic
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'TOTAL IDEAS', value: items.length, color: EMERALD },
          { label: 'READY TO POST', value: readyCount, color: 'oklch(0.78 0.16 175)' },
          { label: 'POSTED', value: postedCount, color: EMERALD },
          { label: 'IN DRAFT', value: items.filter(i => i.draftStatus === 'Drafting').length, color: 'oklch(0.78 0.17 65)' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: s.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.3rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pillar filter */}
      <div className="flex flex-wrap gap-2 mb-3">
        {['All', ...PILLARS].map(p => (
          <button key={p} onClick={() => setFilterPillar(p)} className="px-3 py-1.5 rounded transition-all duration-150" style={{ background: filterPillar === p ? `${PILLAR_COLORS[p] || EMERALD}20` : 'oklch(0.22 0.05 240)', border: `1px solid ${filterPillar === p ? `${PILLAR_COLORS[p] || EMERALD}50` : 'oklch(1 0 0 / 0.06)'}`, color: filterPillar === p ? (PILLAR_COLORS[p] || EMERALD) : 'oklch(0.65 0.03 240)', fontFamily: 'DM Sans', fontSize: '12px' }}>
            {p}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {['All', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-3 py-1.5 rounded transition-all duration-150" style={{ background: filterStatus === s ? `${STATUS_COLORS[s] || EMERALD}20` : 'oklch(0.22 0.05 240)', border: `1px solid ${filterStatus === s ? `${STATUS_COLORS[s] || EMERALD}50` : 'oklch(1 0 0 / 0.06)'}`, color: filterStatus === s ? (STATUS_COLORS[s] || EMERALD) : 'oklch(0.65 0.03 240)', fontFamily: 'DM Sans', fontSize: '12px' }}>
            {s}
          </button>
        ))}
      </div>

      {/* Content cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <Lightbulb size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {items.length === 0 ? 'No content ideas yet. Start building your authority pipeline.' : 'No content matches this filter.'}
            </div>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="rounded-lg p-4 group" style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${PILLAR_COLORS[item.pillar]}20` }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <span className="status-badge" style={{ background: `${PILLAR_COLORS[item.pillar]}15`, color: PILLAR_COLORS[item.pillar] }}>{item.pillar}</span>
                  <span className="status-badge" style={{ background: `${STATUS_COLORS[item.draftStatus]}15`, color: STATUS_COLORS[item.draftStatus] }}>{item.draftStatus}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(item)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={() => { consultingStore.deleteContent(item.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                </div>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.88 0.01 80)', lineHeight: 1.5, marginBottom: '8px' }}>
                {item.topicIdea}
              </div>
              {item.postedDate && (
                <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)' }}>
                  Posted: {formatDate(item.postedDate)}
                </div>
              )}
              {item.engagementNotes && (
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.6 0.01 80)', marginTop: '6px', lineHeight: 1.5 }}>
                  {item.engagementNotes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Content' : 'Add Content Idea'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Topic Idea *</label>
                <textarea value={form.topicIdea} onChange={e => setForm(p => ({ ...p, topicIdea: e.target.value }))} rows={3} placeholder="e.g. Why most SMEs fail at cash flow management..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Pillar</label>
                  <select value={form.pillar} onChange={e => setForm(p => ({ ...p, pillar: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {PILLARS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select value={form.draftStatus} onChange={e => setForm(p => ({ ...p, draftStatus: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {form.draftStatus === 'Posted' && (
                  <div>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Posted Date</label>
                    <input type="date" value={form.postedDate} onChange={e => setForm(p => ({ ...p, postedDate: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Engagement Notes</label>
                <textarea value={form.engagementNotes} onChange={e => setForm(p => ({ ...p, engagementNotes: e.target.value }))} rows={2} placeholder="Likes, comments, DMs received..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
