/**
 * MARKET INTELLIGENCE LOG — Engine 01: Cash Flow Engine
 * Design: The Architect's Notebook — Amber accent
 * Log business visits: industry, cash flow, consulting angles
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Brain, ChevronDown } from 'lucide-react';
import { bankingStore, generateId, formatDate, type MarketIntelLog } from '@/lib/store';
import { toast } from 'sonner';

const AMBER = 'oklch(0.78 0.17 65)';

const CASH_FLOW_COLORS: Record<string, string> = {
  'Strong': 'oklch(0.72 0.17 160)',
  'Stable': 'oklch(0.78 0.16 175)',
  'Tight': 'oklch(0.78 0.17 65)',
  'Critical': 'oklch(0.65 0.22 25)',
};

const emptyLog = (): Omit<MarketIntelLog, 'id' | 'createdAt'> => ({
  businessName: '', industry: '', businessSize: '', cashFlowCondition: 'Stable',
  ownerMindset: '', operationalIssues: '', consultingAngle: '', date: new Date().toISOString().split('T')[0],
});

export default function MarketIntel() {
  const [logs, setLogs] = useState<MarketIntelLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLog());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCF, setFilterCF] = useState<string>('All');

  useEffect(() => { setLogs(bankingStore.getMarketIntel()); }, []);
  const reload = () => setLogs(bankingStore.getMarketIntel());

  const handleSave = () => {
    if (!form.businessName.trim()) { toast.error('Business name is required'); return; }
    if (editingId) {
      bankingStore.updateMarketIntel(editingId, form);
      toast.success('Log updated');
    } else {
      bankingStore.addMarketIntel({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Intelligence logged');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyLog());
  };

  const handleEdit = (log: MarketIntelLog) => {
    setForm({ businessName: log.businessName, industry: log.industry, businessSize: log.businessSize, cashFlowCondition: log.cashFlowCondition, ownerMindset: log.ownerMindset, operationalIssues: log.operationalIssues, consultingAngle: log.consultingAngle, date: log.date });
    setEditingId(log.id); setShowForm(true);
  };

  const filtered = filterCF === 'All' ? logs : logs.filter(l => l.cashFlowCondition === filterCF);
  const withConsultingAngle = logs.filter(l => l.consultingAngle.trim()).length;

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: AMBER }}>ENGINE 01 · CASH FLOW</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Market Intelligence Log
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Banking visits → Business intelligence → Consulting research
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyLog()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Log Visit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'BUSINESSES VISITED', value: logs.length, color: AMBER },
          { label: 'CONSULTING ANGLES', value: withConsultingAngle, color: 'oklch(0.72 0.17 160)' },
          { label: 'TIGHT CASH FLOW', value: logs.filter(l => l.cashFlowCondition === 'Tight' || l.cashFlowCondition === 'Critical').length, color: 'oklch(0.78 0.17 65)' },
          { label: 'INDUSTRIES', value: new Set(logs.map(l => l.industry)).size, color: 'oklch(0.78 0.16 175)' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: s.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.3rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Cash flow filter */}
      <div className="flex gap-2 mb-5">
        {['All', 'Strong', 'Stable', 'Tight', 'Critical'].map(cf => (
          <button
            key={cf}
            onClick={() => setFilterCF(cf)}
            className="px-3 py-1.5 rounded transition-all duration-150"
            style={{
              background: filterCF === cf ? (cf === 'All' ? 'oklch(0.78 0.17 65 / 0.15)' : `${CASH_FLOW_COLORS[cf] || AMBER}20`) : 'oklch(0.22 0.05 240)',
              border: `1px solid ${filterCF === cf ? (cf === 'All' ? 'oklch(0.78 0.17 65 / 0.4)' : `${CASH_FLOW_COLORS[cf] || AMBER}50`) : 'oklch(1 0 0 / 0.06)'}`,
              color: filterCF === cf ? (cf === 'All' ? AMBER : CASH_FLOW_COLORS[cf]) : 'oklch(0.65 0.03 240)',
              fontFamily: 'DM Sans', fontSize: '12px',
            }}
          >
            {cf}
          </button>
        ))}
      </div>

      {/* Log cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-12 text-center rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <Brain size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {logs.length === 0 ? 'No intelligence logged yet. Every business visit is market research.' : 'No logs match this filter.'}
            </div>
          </div>
        ) : (
          filtered.map(log => (
            <div key={log.id} className="rounded-lg overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', color: 'oklch(0.9 0.01 80)' }}>{log.businessName}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.55 0.03 240)' }}>{log.industry || '—'}</span>
                      {log.businessSize && <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)' }}>· {log.businessSize}</span>}
                    </div>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: `${CASH_FLOW_COLORS[log.cashFlowCondition]}15`, color: CASH_FLOW_COLORS[log.cashFlowCondition] }}
                  >
                    {log.cashFlowCondition}
                  </span>
                  {log.consultingAngle && (
                    <span className="status-badge" style={{ background: 'oklch(0.72 0.17 160 / 0.1)', color: 'oklch(0.72 0.17 160)' }}>
                      Consulting Angle
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)' }}>{formatDate(log.date)}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(log); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={(e) => { e.stopPropagation(); bankingStore.deleteMarketIntel(log.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                  <ChevronDown size={14} style={{ color: 'oklch(0.45 0.03 240)', transform: expandedId === log.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>
              {expandedId === log.id && (
                <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.05)' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {[
                      { label: 'OWNER MINDSET', value: log.ownerMindset },
                      { label: 'OPERATIONAL ISSUES', value: log.operationalIssues },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
                        <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: value ? 'oklch(0.75 0.01 80)' : 'oklch(0.4 0.03 240)', fontStyle: value ? 'normal' : 'italic' }}>{value || 'Not noted'}</div>
                      </div>
                    ))}
                    {log.consultingAngle && (
                      <div className="md:col-span-2 p-3 rounded" style={{ background: 'oklch(0.72 0.17 160 / 0.06)', border: '1px solid oklch(0.72 0.17 160 / 0.15)' }}>
                        <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.72 0.17 160)', textTransform: 'uppercase', marginBottom: '4px' }}>CONSULTING ANGLE</div>
                        <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.8 0.01 80)' }}>{log.consultingAngle}</div>
                      </div>
                    )}
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
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Log' : 'Log Business Visit'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Business Name *', key: 'businessName', placeholder: 'Al Noor Trading LLC' },
                  { label: 'Industry', key: 'industry', placeholder: 'Trading, F&B, Logistics...' },
                  { label: 'Business Size', key: 'businessSize', placeholder: '10-20 employees, ~5M revenue' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className={key === 'businessName' ? 'col-span-2' : ''}>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Cash Flow</label>
                  <select value={form.cashFlowCondition} onChange={e => setForm(p => ({ ...p, cashFlowCondition: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {['Strong', 'Stable', 'Tight', 'Critical'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Visit Date</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
              </div>
              {[
                { label: 'Owner Mindset', key: 'ownerMindset', placeholder: 'Growth-focused, risk-averse, overwhelmed...' },
                { label: 'Operational Issues Noticed', key: 'operationalIssues', placeholder: 'No SOPs, manual tracking, founder bottleneck...' },
                { label: 'Potential Consulting Angle', key: 'consultingAngle', placeholder: 'Could benefit from process documentation...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <textarea value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} rows={2} placeholder={placeholder} className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Log Visit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
