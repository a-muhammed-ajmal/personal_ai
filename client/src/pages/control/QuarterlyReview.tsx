/**
 * QUARTERLY REVIEW — Control System
 * Design: The Architect's Notebook — Teal accent
 * Quarterly reflection: commission, clients, runway, alignment
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { controlStore, generateId, type QuarterlyReview } from '@/lib/store';
import { toast } from 'sonner';

const TEAL = 'oklch(0.72 0.14 195)';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
const CURRENT_YEAR = new Date().getFullYear();

const emptyReview = (): Omit<QuarterlyReview, 'id' | 'createdAt'> => ({
  quarter: 'Q1',
  year: CURRENT_YEAR,
  commissionGrowing: '',
  consultingClients: '',
  runwayImproving: '',
  stillAligned: '',
  mustChange: '',
});

export default function QuarterlyReview() {
  const [reviews, setReviews] = useState<QuarterlyReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReview());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setReviews(controlStore.getQuarterlyReviews()); }, []);
  const reload = () => setReviews(controlStore.getQuarterlyReviews());

  const handleSave = () => {
    if (editingId) {
      controlStore.updateQuarterlyReview(editingId, form);
      toast.success('Review updated');
    } else {
      controlStore.addQuarterlyReview({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Quarterly review saved');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyReview());
  };

  const handleEdit = (r: QuarterlyReview) => {
    setForm({ quarter: r.quarter, year: r.year, commissionGrowing: r.commissionGrowing, consultingClients: r.consultingClients, runwayImproving: r.runwayImproving, stillAligned: r.stillAligned, mustChange: r.mustChange });
    setEditingId(r.id); setShowForm(true);
  };

  const REVIEW_QUESTIONS = [
    { key: 'commissionGrowing' as const, label: 'IS COMMISSION GROWING?', color: 'oklch(0.78 0.17 65)', placeholder: 'Trend, targets hit, what drove growth or decline...' },
    { key: 'consultingClients' as const, label: 'CONSULTING CLIENTS BUILDING?', color: 'oklch(0.72 0.17 160)', placeholder: 'New clients, pipeline status, revenue from consulting...' },
    { key: 'runwayImproving' as const, label: 'FINANCIAL RUNWAY IMPROVING?', color: 'oklch(0.65 0.2 290)', placeholder: 'Emergency fund progress, savings rate, financial stability...' },
    { key: 'stillAligned' as const, label: 'STILL ALIGNED WITH THE VISION?', color: TEAL, placeholder: 'Are daily actions matching long-term goals? What\'s drifting?' },
    { key: 'mustChange' as const, label: 'WHAT MUST CHANGE NEXT QUARTER?', color: 'oklch(0.65 0.22 25)', placeholder: 'Top 3 changes to make, habits to drop, systems to build...' },
  ];

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: TEAL }}>CONTROL SYSTEM</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Quarterly Review
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Every 3 months · Zoom out · Recalibrate · Realign with the vision
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyReview()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.72 0.14 195 / 0.15)', color: TEAL, border: '1px solid oklch(0.72 0.14 195 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> New Review
        </button>
      </div>

      {/* The 5 questions reminder */}
      <div className="rounded-lg p-5 mb-6" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="section-label mb-3">THE 5 QUARTERLY QUESTIONS</div>
        <div className="space-y-2">
          {REVIEW_QUESTIONS.map(({ label, color }, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color }}>{i + 1}</span>
              </div>
              <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              No quarterly reviews yet. The quarterly review is your compass check.
            </div>
          </div>
        ) : (
          [...reviews].reverse().map(review => (
            <div key={review.id} className="rounded-lg overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                style={{ borderBottom: expandedId === review.id ? '1px solid oklch(1 0 0 / 0.05)' : 'none' }}
                onClick={() => setExpandedId(expandedId === review.id ? null : review.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}30` }}>
                    <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '14px', color: TEAL }}>{review.quarter}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.9 0.01 80)' }}>{review.quarter} {review.year}</div>
                    <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)', marginTop: '2px' }}>
                      {new Date(review.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(review); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); controlStore.deleteQuarterlyReview(review.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                  {expandedId === review.id ? <ChevronUp size={14} style={{ color: 'oklch(0.45 0.03 240)' }} /> : <ChevronDown size={14} style={{ color: 'oklch(0.45 0.03 240)' }} />}
                </div>
              </div>
              {expandedId === review.id && (
                <div className="px-5 pb-5 pt-3 space-y-3">
                  {REVIEW_QUESTIONS.map(({ key, label, color }) => (
                    review[key] && (
                      <div key={key} className="p-3 rounded" style={{ background: 'oklch(0.19 0.055 240)', borderLeft: `3px solid ${color}` }}>
                        <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color, textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
                        <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.78 0.01 80)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{review[key]}</div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-xl rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Review' : 'New Quarterly Review'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Quarter</label>
                  <select value={form.quarter} onChange={e => setForm(p => ({ ...p, quarter: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Year</label>
                  <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) || CURRENT_YEAR }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                </div>
              </div>
              {REVIEW_QUESTIONS.map(({ key, label, color, placeholder }) => (
                <div key={key}>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={3} placeholder={placeholder} className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: `1px solid ${color}20`, color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px', lineHeight: 1.6 }} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.72 0.14 195 / 0.15)', color: TEAL, border: '1px solid oklch(0.72 0.14 195 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Save Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
