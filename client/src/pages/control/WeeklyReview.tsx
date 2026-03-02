/**
 * WEEKLY REVIEW — Control System
 * Design: The Architect's Notebook — Teal accent
 * Structured weekly reflection across all three engines
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, ChevronDown, ChevronUp } from 'lucide-react';
import { controlStore, generateId, formatDate, type WeeklyReview } from '@/lib/store';
import { toast } from 'sonner';

const TEAL = 'oklch(0.72 0.14 195)';

const emptyReview = (): Omit<WeeklyReview, 'id' | 'createdAt'> => ({
  weekLabel: '',
  date: new Date().toISOString().split('T')[0],
  banking: { activityScore: '', pipelineGrowth: '', conversionRate: '', lessons: '' },
  consulting: { newLeads: '', authorityGrowth: '', conversations: '', improvements: '' },
  finance: { income: '', savings: '', expenseControl: '' },
  personal: { disciplineScore: '', energyLevel: '', relationshipHealth: '' },
  nextWeekFocus: { banking: '', consulting: '', personal: '' },
});

export default function WeeklyReview() {
  const [reviews, setReviews] = useState<WeeklyReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReview());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { setReviews(controlStore.getWeeklyReviews()); }, []);
  const reload = () => setReviews(controlStore.getWeeklyReviews());

  const handleSave = () => {
    if (!form.weekLabel.trim()) { toast.error('Week label is required'); return; }
    if (editingId) {
      controlStore.updateWeeklyReview(editingId, form);
      toast.success('Review updated');
    } else {
      controlStore.addWeeklyReview({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Weekly review saved');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyReview());
  };

  const handleEdit = (r: WeeklyReview) => {
    setForm({ weekLabel: r.weekLabel, date: r.date, banking: { ...r.banking }, consulting: { ...r.consulting }, finance: { ...r.finance }, personal: { ...r.personal }, nextWeekFocus: { ...r.nextWeekFocus } });
    setEditingId(r.id); setShowForm(true);
  };

  const updateSection = (section: keyof typeof form, key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), [key]: value },
    }));
  };

  const SECTIONS = [
    {
      title: 'BANKING ENGINE',
      color: 'oklch(0.78 0.17 65)',
      section: 'banking' as const,
      fields: [
        { key: 'activityScore', label: 'Activity Score', placeholder: 'Calls, visits, submissions this week...' },
        { key: 'pipelineGrowth', label: 'Pipeline Growth', placeholder: 'New leads added, stage movements...' },
        { key: 'conversionRate', label: 'Conversion Rate', placeholder: 'Approvals vs submissions...' },
        { key: 'lessons', label: 'Key Lessons', placeholder: 'What worked, what didn\'t...' },
      ],
    },
    {
      title: 'CONSULTING ENGINE',
      color: 'oklch(0.72 0.17 160)',
      section: 'consulting' as const,
      fields: [
        { key: 'newLeads', label: 'New Leads / Prospects', placeholder: 'New consulting prospects this week...' },
        { key: 'authorityGrowth', label: 'Authority Growth', placeholder: 'Content posted, engagement, followers...' },
        { key: 'conversations', label: 'Key Conversations', placeholder: 'Business meetings, discovery calls...' },
        { key: 'improvements', label: 'Improvements Made', placeholder: 'Systems built, tools created...' },
      ],
    },
    {
      title: 'FINANCE',
      color: 'oklch(0.65 0.2 290)',
      section: 'finance' as const,
      fields: [
        { key: 'income', label: 'Income This Week', placeholder: 'Salary, commission, consulting fees...' },
        { key: 'savings', label: 'Savings Progress', placeholder: 'Amount saved, % of income...' },
        { key: 'expenseControl', label: 'Expense Control', placeholder: 'Unnecessary expenses avoided...' },
      ],
    },
    {
      title: 'PERSONAL',
      color: TEAL,
      section: 'personal' as const,
      fields: [
        { key: 'disciplineScore', label: 'Discipline Score', placeholder: 'Habits completed, consistency...' },
        { key: 'energyLevel', label: 'Energy Level', placeholder: 'Physical and mental energy...' },
        { key: 'relationshipHealth', label: 'Relationship Health', placeholder: 'Family, friends, connections...' },
      ],
    },
  ];

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: TEAL }}>CONTROL SYSTEM</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Weekly Review
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Every Sunday · Reflect · Recalibrate · Plan forward
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

      {/* Review list */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              No weekly reviews yet. Consistency in reflection is the foundation of growth.
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
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.9 0.01 80)' }}>{review.weekLabel}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)', marginTop: '2px' }}>{formatDate(review.date)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(review); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); controlStore.deleteWeeklyReview(review.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                  {expandedId === review.id ? <ChevronUp size={14} style={{ color: 'oklch(0.45 0.03 240)' }} /> : <ChevronDown size={14} style={{ color: 'oklch(0.45 0.03 240)' }} />}
                </div>
              </div>
              {expandedId === review.id && (
                <div className="px-5 pb-5 pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[
                      { title: 'BANKING', color: 'oklch(0.78 0.17 65)', data: review.banking, keys: ['activityScore', 'pipelineGrowth', 'conversionRate', 'lessons'], labels: ['Activity Score', 'Pipeline Growth', 'Conversion Rate', 'Key Lessons'] },
                      { title: 'CONSULTING', color: 'oklch(0.72 0.17 160)', data: review.consulting, keys: ['newLeads', 'authorityGrowth', 'conversations', 'improvements'], labels: ['New Leads', 'Authority Growth', 'Key Conversations', 'Improvements'] },
                      { title: 'FINANCE', color: 'oklch(0.65 0.2 290)', data: review.finance, keys: ['income', 'savings', 'expenseControl'], labels: ['Income', 'Savings', 'Expense Control'] },
                      { title: 'PERSONAL', color: TEAL, data: review.personal, keys: ['disciplineScore', 'energyLevel', 'relationshipHealth'], labels: ['Discipline Score', 'Energy Level', 'Relationships'] },
                    ].map(({ title, color, data, keys, labels }) => (
                      <div key={title} className="p-3 rounded" style={{ background: 'oklch(0.19 0.055 240)', border: `1px solid ${color}15` }}>
                        <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color, textTransform: 'uppercase', marginBottom: '8px' }}>{title}</div>
                        {keys.map((k, i) => (
                          (data as any)[k] && (
                            <div key={k} className="mb-2">
                              <div style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', marginBottom: '2px' }}>{labels[i]}</div>
                              <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.78 0.01 80)', lineHeight: 1.5 }}>{(data as any)[k]}</div>
                            </div>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                  {(review.nextWeekFocus.banking || review.nextWeekFocus.consulting || review.nextWeekFocus.personal) && (
                    <div className="mt-4 p-3 rounded" style={{ background: 'oklch(0.72 0.14 195 / 0.06)', border: '1px solid oklch(0.72 0.14 195 / 0.15)' }}>
                      <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: TEAL, textTransform: 'uppercase', marginBottom: '8px' }}>NEXT WEEK FOCUS</div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Banking', value: review.nextWeekFocus.banking },
                          { label: 'Consulting', value: review.nextWeekFocus.consulting },
                          { label: 'Personal', value: review.nextWeekFocus.personal },
                        ].map(({ label, value }) => value && (
                          <div key={label}>
                            <div style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.78 0.01 80)' }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Review' : 'New Weekly Review'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Week Label *</label>
                  <input value={form.weekLabel} onChange={e => setForm(p => ({ ...p, weekLabel: e.target.value }))} placeholder="e.g. Mar W1 2026" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
              </div>
              {SECTIONS.map(({ title, color, section, fields }) => (
                <div key={section} className="p-4 rounded" style={{ background: 'oklch(0.19 0.055 240)', border: `1px solid ${color}15` }}>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color, textTransform: 'uppercase', marginBottom: '10px' }}>{title}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {fields.map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label style={{ fontFamily: 'DM Mono', fontSize: '8px', letterSpacing: '0.1em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>{label}</label>
                        <textarea value={(form[section] as any)[key]} onChange={e => updateSection(section, key, e.target.value)} rows={2} placeholder={placeholder} className="w-full px-2 py-1.5 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '12px' }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-4 rounded" style={{ background: 'oklch(0.72 0.14 195 / 0.06)', border: '1px solid oklch(0.72 0.14 195 / 0.15)' }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: TEAL, textTransform: 'uppercase', marginBottom: '10px' }}>NEXT WEEK FOCUS</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'banking', label: 'Banking Priority', placeholder: 'Top banking goal...' },
                    { key: 'consulting', label: 'Consulting Priority', placeholder: 'Top consulting goal...' },
                    { key: 'personal', label: 'Personal Priority', placeholder: 'Top personal goal...' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontFamily: 'DM Mono', fontSize: '8px', letterSpacing: '0.1em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>{label}</label>
                      <textarea value={(form.nextWeekFocus as any)[key]} onChange={e => updateSection('nextWeekFocus', key, e.target.value)} rows={2} placeholder={placeholder} className="w-full px-2 py-1.5 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '12px' }} />
                    </div>
                  ))}
                </div>
              </div>
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
