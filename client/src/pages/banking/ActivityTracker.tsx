/**
 * ACTIVITY TRACKER — Engine 01: Cash Flow Engine
 * Design: The Architect's Notebook — Amber accent
 * Weekly activity logging with conversion rate calculation
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, TrendingUp } from 'lucide-react';
import { bankingStore, generateId, formatCurrency, type WeeklyActivity } from '@/lib/store';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const AMBER = 'oklch(0.78 0.17 65)';
const AMBER_HEX = '#D97706';

const emptyActivity = (): Omit<WeeklyActivity, 'id' | 'createdAt'> => ({
  weekNumber: 1, weekLabel: '', callsMade: 0, visitsDone: 0,
  submissions: 0, approvals: 0, commissionEarned: 0, notes: '',
});

export default function ActivityTracker() {
  const [activities, setActivities] = useState<WeeklyActivity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyActivity());

  useEffect(() => { setActivities(bankingStore.getActivities()); }, []);
  const reload = () => setActivities(bankingStore.getActivities());

  const handleSave = () => {
    if (!form.weekLabel.trim()) { toast.error('Week label is required'); return; }
    if (editingId) {
      bankingStore.updateActivity(editingId, form);
      toast.success('Activity updated');
    } else {
      bankingStore.addActivity({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Week logged');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyActivity());
  };

  const handleEdit = (a: WeeklyActivity) => {
    setForm({ weekNumber: a.weekNumber, weekLabel: a.weekLabel, callsMade: a.callsMade, visitsDone: a.visitsDone, submissions: a.submissions, approvals: a.approvals, commissionEarned: a.commissionEarned, notes: a.notes || '' });
    setEditingId(a.id); setShowForm(true);
  };

  const totalCalls = activities.reduce((s, a) => s + a.callsMade, 0);
  const totalVisits = activities.reduce((s, a) => s + a.visitsDone, 0);
  const totalSubmissions = activities.reduce((s, a) => s + a.submissions, 0);
  const totalApprovals = activities.reduce((s, a) => s + a.approvals, 0);
  const totalCommission = activities.reduce((s, a) => s + a.commissionEarned, 0);
  const conversionRate = totalSubmissions > 0 ? ((totalApprovals / totalSubmissions) * 100).toFixed(1) : '0.0';

  const chartData = [...activities].slice(-8).map(a => ({
    week: a.weekLabel || `W${a.weekNumber}`,
    calls: a.callsMade,
    visits: a.visitsDone,
    submissions: a.submissions,
    approvals: a.approvals,
  }));

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: AMBER }}>ENGINE 01 · CASH FLOW</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Weekly Activity Tracker
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Calls · Visits · Submissions · Approvals · Commission
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyActivity()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Log Week
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'TOTAL CALLS', value: totalCalls },
          { label: 'TOTAL VISITS', value: totalVisits },
          { label: 'SUBMISSIONS', value: totalSubmissions },
          { label: 'APPROVALS', value: totalApprovals },
          { label: 'CONVERSION', value: `${conversionRate}%` },
          { label: 'COMMISSION', value: formatCurrency(totalCommission) },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-3" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '8px', letterSpacing: '0.12em', color: AMBER, opacity: 0.7, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.1rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4">ACTIVITY TREND · LAST 8 WEEKS</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)', borderRadius: '6px', fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.85 0.01 80)' }}
                cursor={{ fill: 'oklch(1 0 0 / 0.03)' }}
              />
              <Bar dataKey="calls" fill="oklch(0.78 0.17 65 / 0.5)" radius={[2, 2, 0, 0]} name="Calls" />
              <Bar dataKey="visits" fill="oklch(0.78 0.17 65 / 0.7)" radius={[2, 2, 0, 0]} name="Visits" />
              <Bar dataKey="submissions" fill={AMBER_HEX} radius={[2, 2, 0, 0]} name="Submissions" />
              <Bar dataKey="approvals" fill="oklch(0.72 0.17 160)" radius={[2, 2, 0, 0]} name="Approvals" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div
          className="grid px-4 py-3"
          style={{ gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 60px', background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}
        >
          {['WEEK', 'CALLS', 'VISITS', 'SUBMITS', 'APPROVED', 'CONV %', 'COMMISSION', ''].map((h, i) => (
            <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {activities.length === 0 ? (
          <div className="py-12 text-center" style={{ background: 'oklch(0.22 0.05 240)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>No weeks logged yet. Start tracking your activity.</div>
          </div>
        ) : (
          [...activities].reverse().map((a, idx) => {
            const conv = a.submissions > 0 ? ((a.approvals / a.submissions) * 100).toFixed(1) : '—';
            return (
              <div
                key={a.id}
                className="grid items-center px-4 py-3 group"
                style={{ gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 60px', background: idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)', borderBottom: '1px solid oklch(1 0 0 / 0.04)' }}
              >
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.9 0.01 80)' }}>{a.weekLabel}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)' }}>Week {a.weekNumber}</div>
                </div>
                {[a.callsMade, a.visitsDone, a.submissions, a.approvals].map((v, i) => (
                  <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '13px', color: 'oklch(0.8 0.01 80)' }}>{v}</div>
                ))}
                <div style={{ fontFamily: 'DM Mono', fontSize: '12px', color: conv !== '—' ? AMBER : 'oklch(0.45 0.03 240)' }}>{conv !== '—' ? `${conv}%` : '—'}</div>
                <div style={{ fontFamily: 'DM Mono', fontSize: '12px', color: AMBER }}>{a.commissionEarned ? formatCurrency(a.commissionEarned) : '—'}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(a)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={() => { bankingStore.deleteActivity(a.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Week' : 'Log New Week'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Week Label *</label>
                  <input value={form.weekLabel} onChange={e => setForm(p => ({ ...p, weekLabel: e.target.value }))} placeholder="e.g. Mar W1 2026" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Week #</label>
                  <input type="number" value={form.weekNumber} onChange={e => setForm(p => ({ ...p, weekNumber: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Calls Made', key: 'callsMade' },
                  { label: 'Visits Done', key: 'visitsDone' },
                  { label: 'Submissions', key: 'submissions' },
                  { label: 'Approvals', key: 'approvals' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input type="number" value={(form as any)[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))} placeholder="0" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Commission Earned (AED)</label>
                <input type="number" value={form.commissionEarned || ''} onChange={e => setForm(p => ({ ...p, commissionEarned: parseFloat(e.target.value) || 0 }))} placeholder="0" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Notes / Lessons</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Key lessons this week..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Log Week'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
