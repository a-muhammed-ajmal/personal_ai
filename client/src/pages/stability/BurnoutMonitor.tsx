/**
 * BURNOUT MONITOR — Engine 03: Stability Engine
 * Design: The Architect's Notebook — Violet accent
 * Weekly energy, focus, stress tracking with radar chart
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Activity } from 'lucide-react';
import { stabilityStore, generateId, type BurnoutEntry } from '@/lib/store';
import { toast } from 'sonner';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const VIOLET = 'oklch(0.65 0.2 290)';
const VIOLET_HEX = '#7C3AED';

const emptyEntry = (): Omit<BurnoutEntry, 'id' | 'createdAt'> => ({
  weekLabel: '', energy: 5, focus: 5, stress: 5, notes: '',
});

function getStatusColor(energy: number, stress: number) {
  const score = energy - stress + 5;
  if (score >= 8) return 'oklch(0.72 0.17 160)';
  if (score >= 5) return VIOLET;
  if (score >= 3) return 'oklch(0.78 0.17 65)';
  return 'oklch(0.65 0.22 25)';
}

function getStatusLabel(energy: number, stress: number) {
  const score = energy - stress + 5;
  if (score >= 8) return 'Thriving';
  if (score >= 5) return 'Stable';
  if (score >= 3) return 'Monitor';
  return 'Rest Needed';
}

export default function BurnoutMonitor() {
  const [entries, setEntries] = useState<BurnoutEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEntry());

  useEffect(() => { setEntries(stabilityStore.getBurnout()); }, []);
  const reload = () => setEntries(stabilityStore.getBurnout());

  const handleSave = () => {
    if (!form.weekLabel.trim()) { toast.error('Week label is required'); return; }
    if (editingId) {
      stabilityStore.updateBurnout(editingId, form);
      toast.success('Entry updated');
    } else {
      stabilityStore.addBurnout({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Week logged');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyEntry());
  };

  const handleEdit = (e: BurnoutEntry) => {
    setForm({ weekLabel: e.weekLabel, energy: e.energy, focus: e.focus, stress: e.stress, notes: e.notes || '' });
    setEditingId(e.id); setShowForm(true);
  };

  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const avgEnergy = entries.length > 0 ? (entries.reduce((s, e) => s + e.energy, 0) / entries.length).toFixed(1) : '—';
  const avgFocus = entries.length > 0 ? (entries.reduce((s, e) => s + e.focus, 0) / entries.length).toFixed(1) : '—';
  const avgStress = entries.length > 0 ? (entries.reduce((s, e) => s + e.stress, 0) / entries.length).toFixed(1) : '—';

  const radarData = latest ? [
    { subject: 'Energy', value: latest.energy, fullMark: 10 },
    { subject: 'Focus', value: latest.focus, fullMark: 10 },
    { subject: 'Calm', value: 10 - latest.stress, fullMark: 10 },
  ] : [];

  const trendData = [...entries].slice(-8).map(e => ({
    week: e.weekLabel,
    energy: e.energy,
    focus: e.focus,
    stress: e.stress,
  }));

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: VIOLET }}>ENGINE 03 · STABILITY</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Burnout Monitor
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Weekly energy · Focus · Stress tracking · Sustainable performance
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyEntry()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Log Week
        </button>
      </div>

      {/* Current status */}
      {latest && (
        <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${getStatusColor(latest.energy, latest.stress)}30` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="section-label mb-1">CURRENT STATUS · {latest.weekLabel}</div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '18px', color: getStatusColor(latest.energy, latest.stress) }}>
                {getStatusLabel(latest.energy, latest.stress)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'ENERGY', value: latest.energy, color: 'oklch(0.72 0.17 160)' },
                { label: 'FOCUS', value: latest.focus, color: 'oklch(0.78 0.16 175)' },
                { label: 'STRESS', value: latest.stress, color: 'oklch(0.65 0.22 25)' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div style={{ fontFamily: 'DM Mono', fontSize: '8px', letterSpacing: '0.12em', color: s.color, textTransform: 'uppercase', marginBottom: '2px' }}>{s.label}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '1.4rem', fontWeight: 500, color: s.color }}>{s.value}<span style={{ fontSize: '0.7rem', color: 'oklch(0.45 0.03 240)' }}>/10</span></div>
                </div>
              ))}
            </div>
          </div>
          {radarData.length > 0 && (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(1 0 0 / 0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'oklch(0.55 0.03 240)' }} />
                <Radar dataKey="value" stroke={VIOLET_HEX} fill={VIOLET_HEX} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'AVG ENERGY', value: avgEnergy, color: 'oklch(0.72 0.17 160)' },
          { label: 'AVG FOCUS', value: avgFocus, color: 'oklch(0.78 0.16 175)' },
          { label: 'AVG STRESS', value: avgStress, color: 'oklch(0.65 0.22 25)' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: s.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.3rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      {trendData.length > 0 && (
        <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4">TREND · LAST 8 WEEKS</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)', borderRadius: '6px', fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.85 0.01 80)' }} />
              <Line type="monotone" dataKey="energy" stroke="oklch(0.72 0.17 160)" strokeWidth={2} dot={false} name="Energy" />
              <Line type="monotone" dataKey="focus" stroke="oklch(0.78 0.16 175)" strokeWidth={2} dot={false} name="Focus" />
              <Line type="monotone" dataKey="stress" stroke="oklch(0.65 0.22 25)" strokeWidth={2} dot={false} name="Stress" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="grid px-4 py-3" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 1fr 60px', background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
          {['WEEK', 'ENERGY', 'FOCUS', 'STRESS', 'STATUS', 'NOTES', ''].map((h, i) => (
            <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {entries.length === 0 ? (
          <div className="py-12 text-center" style={{ background: 'oklch(0.22 0.05 240)' }}>
            <Activity size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>No weeks logged yet. Start monitoring your sustainability.</div>
          </div>
        ) : (
          [...entries].reverse().map((entry, idx) => (
            <div key={entry.id} className="grid items-center px-4 py-3 group" style={{ gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 1fr 60px', background: idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)', borderBottom: '1px solid oklch(1 0 0 / 0.04)' }}>
              <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.9 0.01 80)' }}>{entry.weekLabel}</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '13px', color: 'oklch(0.72 0.17 160)' }}>{entry.energy}/10</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '13px', color: 'oklch(0.78 0.16 175)' }}>{entry.focus}/10</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '13px', color: 'oklch(0.65 0.22 25)' }}>{entry.stress}/10</div>
              <div>
                <span className="status-badge" style={{ background: `${getStatusColor(entry.energy, entry.stress)}15`, color: getStatusColor(entry.energy, entry.stress) }}>
                  {getStatusLabel(entry.energy, entry.stress)}
                </span>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.6 0.01 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.notes || '—'}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(entry)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                <button onClick={() => { stabilityStore.deleteBurnout(entry.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Entry' : 'Log This Week'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Week Label *</label>
                <input value={form.weekLabel} onChange={e => setForm(p => ({ ...p, weekLabel: e.target.value }))} placeholder="e.g. Mar W1 2026" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
              {[
                { label: 'ENERGY LEVEL', key: 'energy', color: 'oklch(0.72 0.17 160)', desc: '1 = Exhausted, 10 = Fully charged' },
                { label: 'FOCUS LEVEL', key: 'focus', color: 'oklch(0.78 0.16 175)', desc: '1 = Scattered, 10 = Laser focused' },
                { label: 'STRESS LEVEL', key: 'stress', color: 'oklch(0.65 0.22 25)', desc: '1 = Calm, 10 = Overwhelmed' },
              ].map(({ label, key, color, desc }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color, textTransform: 'uppercase' }}>{label}</label>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '14px', color, fontWeight: 500 }}>{(form as any)[key]}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10" value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: parseInt(e.target.value) }))}
                    className="w-full"
                    style={{ accentColor: color.replace('oklch', 'oklch') }}
                  />
                  <div style={{ fontFamily: 'DM Sans', fontSize: '10px', color: 'oklch(0.45 0.03 240)', marginTop: '2px' }}>{desc}</div>
                </div>
              ))}
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Notes / Reflections</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="What's affecting your energy this week?" className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Log Week'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
