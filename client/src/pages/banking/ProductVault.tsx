/**
 * PRODUCT MASTERY VAULT — Engine 01: Cash Flow Engine
 * Design: The Architect's Notebook — Amber accent
 * Knowledge base: eligibility, objections, profit structure, compliance
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, BookOpen } from 'lucide-react';
import { bankingStore, generateId, type ProductNote } from '@/lib/store';
import { toast } from 'sonner';

const AMBER = 'oklch(0.78 0.17 65)';

const CATEGORIES = ['Eligibility', 'Objection Handling', 'Profit Structure', 'Rejection Reasons', 'Compliance'] as const;

const CATEGORY_COLORS: Record<string, string> = {
  'Eligibility': 'oklch(0.72 0.17 160)',
  'Objection Handling': 'oklch(0.78 0.17 65)',
  'Profit Structure': 'oklch(0.78 0.16 175)',
  'Rejection Reasons': 'oklch(0.65 0.22 25)',
  'Compliance': 'oklch(0.65 0.2 290)',
};

const emptyNote = (): Omit<ProductNote, 'id' | 'updatedAt'> => ({ product: '', category: 'Eligibility', content: '' });

export default function ProductVault() {
  const [notes, setNotes] = useState<ProductNote[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyNote());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setNotes(bankingStore.getProductNotes()); }, []);
  const reload = () => setNotes(bankingStore.getProductNotes());

  const handleSave = () => {
    if (!form.product.trim() || !form.content.trim()) { toast.error('Product and content are required'); return; }
    if (editingId) {
      bankingStore.updateProductNote(editingId, { ...form, updatedAt: new Date().toISOString() });
      toast.success('Note updated');
    } else {
      bankingStore.addProductNote({ ...form, id: generateId(), updatedAt: new Date().toISOString() });
      toast.success('Note added to vault');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyNote());
  };

  const handleEdit = (note: ProductNote) => {
    setForm({ product: note.product, category: note.category, content: note.content });
    setEditingId(note.id); setShowForm(true);
  };

  const filtered = activeCategory === 'All' ? notes : notes.filter(n => n.category === activeCategory);

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: AMBER }}>ENGINE 01 · CASH FLOW</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Product Mastery Vault
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Eligibility · Objections · Profit structure · Compliance
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyNote()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Note
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 rounded transition-all duration-150"
            style={{
              background: activeCategory === cat ? (cat === 'All' ? 'oklch(0.78 0.17 65 / 0.15)' : `${CATEGORY_COLORS[cat]}20`) : 'oklch(0.22 0.05 240)',
              border: `1px solid ${activeCategory === cat ? (cat === 'All' ? 'oklch(0.78 0.17 65 / 0.4)' : `${CATEGORY_COLORS[cat]}50`) : 'oklch(1 0 0 / 0.06)'}`,
              color: activeCategory === cat ? (cat === 'All' ? AMBER : CATEGORY_COLORS[cat]) : 'oklch(0.65 0.03 240)',
              fontFamily: 'DM Sans', fontSize: '12px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <BookOpen size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {notes.length === 0 ? 'No notes yet. Build your product knowledge base.' : 'No notes in this category.'}
            </div>
          </div>
        ) : (
          filtered.map(note => (
            <div
              key={note.id}
              className="rounded-lg overflow-hidden"
              style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${CATEGORY_COLORS[note.category]}20` }}
            >
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                style={{ borderBottom: expandedId === note.id ? '1px solid oklch(1 0 0 / 0.05)' : 'none' }}
                onClick={() => setExpandedId(expandedId === note.id ? null : note.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-8 rounded" style={{ background: CATEGORY_COLORS[note.category] }} />
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '13px', color: 'oklch(0.9 0.01 80)' }}>{note.product}</div>
                    <span
                      className="status-badge"
                      style={{ background: `${CATEGORY_COLORS[note.category]}15`, color: CATEGORY_COLORS[note.category] }}
                    >
                      {note.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(note); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); bankingStore.deleteProductNote(note.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                </div>
              </div>
              {expandedId === note.id && (
                <div className="px-4 pb-4 pt-3">
                  <pre style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.75 0.01 80)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {note.content}
                  </pre>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.35 0.03 240)', marginTop: '8px' }}>
                    Updated: {new Date(note.updatedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
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
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Note' : 'Add Knowledge Note'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Product *</label>
                  <input value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))} placeholder="Personal Loan, Credit Card..." className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Content *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={8} placeholder="Write your knowledge notes here..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px', lineHeight: 1.6 }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
