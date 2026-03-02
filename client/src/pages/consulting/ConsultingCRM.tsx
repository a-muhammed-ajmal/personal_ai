/**
 * CONSULTING CRM — Engine 02: Asset Engine
 * Design: The Architect's Notebook — Emerald accent
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Search } from 'lucide-react';
import { consultingStore, generateId, formatCurrency, formatDate, CONSULTING_STAGES, type ConsultingLead } from '@/lib/store';
import { toast } from 'sonner';

const EMERALD = 'oklch(0.72 0.17 160)';
const STAGE_COLORS: Record<string, string> = {
  'New': 'oklch(0.55 0.03 240)',
  'Contacted': 'oklch(0.65 0.12 200)',
  'Session Done': 'oklch(0.78 0.16 175)',
  'Proposal Sent': 'oklch(0.78 0.17 65)',
  'Negotiating': 'oklch(0.78 0.17 65)',
  'Active Client': 'oklch(0.72 0.17 160)',
  'Closed': 'oklch(0.55 0.03 240)',
};

const emptyLead = (): Omit<ConsultingLead, 'id' | 'createdAt'> => ({
  businessName: '', owner: '', industry: '', observedProblem: '', leadSource: '',
  sessionDate: '', proposalSent: false, status: 'New', estimatedProjectValue: 0, notes: '',
});

export default function ConsultingCRM() {
  const [leads, setLeads] = useState<ConsultingLead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLead());
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<string>('All');

  useEffect(() => { setLeads(consultingStore.getLeads()); }, []);
  const reload = () => setLeads(consultingStore.getLeads());

  const handleSave = () => {
    if (!form.businessName.trim()) { toast.error('Business name is required'); return; }
    if (editingId) {
      consultingStore.updateLead(editingId, form);
      toast.success('Lead updated');
    } else {
      consultingStore.addLead({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Consulting lead added');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyLead());
  };

  const handleEdit = (lead: ConsultingLead) => {
    setForm({ businessName: lead.businessName, owner: lead.owner, industry: lead.industry, observedProblem: lead.observedProblem, leadSource: lead.leadSource, sessionDate: lead.sessionDate, proposalSent: lead.proposalSent, status: lead.status, estimatedProjectValue: lead.estimatedProjectValue, notes: lead.notes || '' });
    setEditingId(lead.id); setShowForm(true);
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.businessName.toLowerCase().includes(search.toLowerCase()) || l.owner.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'All' || l.status === filterStage;
    return matchSearch && matchStage;
  });

  const totalValue = leads.reduce((s, l) => s + (l.estimatedProjectValue || 0), 0);
  const activeClients = leads.filter(l => l.status === 'Active Client').length;
  const stageCount = CONSULTING_STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<string, number>);

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: EMERALD }}>ENGINE 02 · ASSET</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Consulting CRM
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Business prospects · Session tracking · Proposal pipeline
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyLead()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Prospect
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'TOTAL PROSPECTS', value: leads.length, color: EMERALD },
          { label: 'ACTIVE CLIENTS', value: activeClients, color: EMERALD },
          { label: 'PIPELINE VALUE', value: formatCurrency(totalValue), color: 'oklch(0.78 0.17 65)' },
          { label: 'PROPOSALS SENT', value: leads.filter(l => l.proposalSent).length, color: 'oklch(0.78 0.16 175)' },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: s.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.3rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Stage filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['All', ...CONSULTING_STAGES].map(stage => (
          <button
            key={stage}
            onClick={() => setFilterStage(stage)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-150"
            style={{
              background: filterStage === stage ? 'oklch(0.72 0.17 160 / 0.15)' : 'oklch(0.22 0.05 240)',
              border: `1px solid ${filterStage === stage ? 'oklch(0.72 0.17 160 / 0.4)' : 'oklch(1 0 0 / 0.06)'}`,
              color: filterStage === stage ? EMERALD : 'oklch(0.65 0.03 240)',
              fontFamily: 'DM Sans', fontSize: '12px',
            }}
          >
            {stage}
            {stage !== 'All' && <span style={{ fontFamily: 'DM Mono', fontSize: '10px', background: 'oklch(1 0 0 / 0.06)', color: 'oklch(0.75 0.01 80)', padding: '1px 5px', borderRadius: '2px' }}>{stageCount[stage] || 0}</span>}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.03 240)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by business or owner..." className="w-full pl-9 pr-4 py-2.5 rounded-lg" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.08)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="grid px-4 py-3" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.8fr 0.8fr 60px', background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
          {['BUSINESS / OWNER', 'INDUSTRY', 'PROBLEM', 'STATUS', 'PROPOSAL', 'VALUE', ''].map((h, i) => (
            <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center" style={{ background: 'oklch(0.22 0.05 240)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {leads.length === 0 ? 'No consulting prospects yet. Start building your client pipeline.' : 'No prospects match your filter.'}
            </div>
          </div>
        ) : (
          filtered.map((lead, idx) => (
            <div key={lead.id} className="grid items-center px-4 py-3 group" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.8fr 0.8fr 60px', background: idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)', borderBottom: '1px solid oklch(1 0 0 / 0.04)' }}>
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.9 0.01 80)' }}>{lead.businessName}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)' }}>{lead.owner || '—'}</div>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.7 0.01 80)' }}>{lead.industry || '—'}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.65 0.01 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.observedProblem || '—'}</div>
              <div>
                <span className="status-badge" style={{ background: `${STAGE_COLORS[lead.status]}20`, color: STAGE_COLORS[lead.status], border: `1px solid ${STAGE_COLORS[lead.status]}40` }}>{lead.status}</span>
              </div>
              <div>
                <span className="status-badge" style={{ background: lead.proposalSent ? 'oklch(0.72 0.17 160 / 0.1)' : 'oklch(1 0 0 / 0.04)', color: lead.proposalSent ? 'oklch(0.72 0.17 160)' : 'oklch(0.45 0.03 240)' }}>
                  {lead.proposalSent ? 'Sent' : 'Pending'}
                </span>
              </div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '12px', color: 'oklch(0.78 0.17 65)' }}>{lead.estimatedProjectValue ? formatCurrency(lead.estimatedProjectValue) : '—'}</div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(lead)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                <button onClick={() => { consultingStore.deleteLead(lead.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Prospect' : 'Add Consulting Prospect'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Business Name *', key: 'businessName', placeholder: 'Al Noor Trading LLC' },
                  { label: 'Owner Name', key: 'owner', placeholder: 'Mohammed Al Noor' },
                  { label: 'Industry', key: 'industry', placeholder: 'Trading, F&B, Logistics...' },
                  { label: 'Lead Source', key: 'leadSource', placeholder: 'Banking visit, LinkedIn, referral...' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Observed Problem</label>
                <textarea value={form.observedProblem} onChange={e => setForm(p => ({ ...p, observedProblem: e.target.value }))} rows={2} placeholder="No SOPs, founder bottleneck, cash flow issues..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {CONSULTING_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Session Date</label>
                  <input type="date" value={form.sessionDate} onChange={e => setForm(p => ({ ...p, sessionDate: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Est. Project Value (AED)</label>
                  <input type="number" value={form.estimatedProjectValue || ''} onChange={e => setForm(p => ({ ...p, estimatedProjectValue: parseFloat(e.target.value) || 0 }))} placeholder="0" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" id="proposalSent" checked={form.proposalSent} onChange={e => setForm(p => ({ ...p, proposalSent: e.target.checked }))} className="w-4 h-4 rounded" style={{ accentColor: EMERALD }} />
                  <label htmlFor="proposalSent" style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)' }}>Proposal Sent</label>
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Additional notes..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.72 0.17 160 / 0.15)', color: EMERALD, border: '1px solid oklch(0.72 0.17 160 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Add Prospect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
