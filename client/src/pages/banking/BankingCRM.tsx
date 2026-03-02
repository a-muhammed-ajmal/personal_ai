/**
 * BANKING CRM — Engine 01: Cash Flow Engine
 * Design: The Architect's Notebook — Amber accent for banking
 * Full pipeline CRM with stages, add/edit/delete leads
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, ChevronDown, Search, Filter } from 'lucide-react';
import { bankingStore, generateId, formatCurrency, formatDate, BANKING_STAGES, type BankingLead } from '@/lib/store';
import { toast } from 'sonner';

const AMBER = 'oklch(0.78 0.17 65)';
const STAGE_COLORS: Record<string, string> = {
  'Lead': 'oklch(0.55 0.03 240)',
  'Contacted': 'oklch(0.65 0.12 200)',
  'Interested': 'oklch(0.72 0.15 175)',
  'Docs Pending': 'oklch(0.78 0.17 65)',
  'Submitted': 'oklch(0.72 0.17 160)',
  'Approved': 'oklch(0.72 0.17 160)',
  'Commission Received': 'oklch(0.78 0.16 175)',
};

const emptyLead = (): Omit<BankingLead, 'id' | 'createdAt'> => ({
  name: '', company: '', phone: '', product: '', stage: 'Lead',
  nextFollowUp: '', commissionValue: 0, status: 'Active', notes: '',
});

export default function BankingCRM() {
  const [leads, setLeads] = useState<BankingLead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLead());
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState<string>('All');

  useEffect(() => { setLeads(bankingStore.getLeads()); }, []);

  const reload = () => setLeads(bankingStore.getLeads());

  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (editingId) {
      bankingStore.updateLead(editingId, form);
      toast.success('Lead updated');
    } else {
      bankingStore.addLead({ ...form, id: generateId(), createdAt: new Date().toISOString() });
      toast.success('Lead added to pipeline');
    }
    reload();
    setShowForm(false);
    setEditingId(null);
    setForm(emptyLead());
  };

  const handleEdit = (lead: BankingLead) => {
    setForm({ name: lead.name, company: lead.company, phone: lead.phone, product: lead.product, stage: lead.stage, nextFollowUp: lead.nextFollowUp, commissionValue: lead.commissionValue, status: lead.status, notes: lead.notes || '' });
    setEditingId(lead.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    bankingStore.deleteLead(id);
    reload();
    toast.success('Lead removed');
  };

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === 'All' || l.stage === filterStage;
    return matchSearch && matchStage;
  });

  const stageCount = BANKING_STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.stage === s).length }), {} as Record<string, number>);
  const totalCommission = leads.reduce((sum, l) => sum + (l.commissionValue || 0), 0);
  const activeCount = leads.filter(l => l.status === 'Active').length;

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: AMBER }}>ENGINE 01 · CASH FLOW</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Banking CRM
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Pipeline management · Lead tracking · Commission monitoring
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyLead()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded transition-colors duration-150"
          style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Lead
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'TOTAL LEADS', value: leads.length, color: AMBER },
          { label: 'ACTIVE', value: activeCount, color: 'oklch(0.72 0.17 160)' },
          { label: 'COMMISSION PIPELINE', value: formatCurrency(totalCommission), color: AMBER },
          { label: 'APPROVED', value: stageCount['Approved'] + (stageCount['Commission Received'] || 0), color: 'oklch(0.78 0.16 175)' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: stat.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.3rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline stage overview */}
      <div className="rounded-lg p-4 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="section-label mb-3">PIPELINE STAGES</div>
        <div className="flex flex-wrap gap-2">
          {BANKING_STAGES.map(stage => (
            <button
              key={stage}
              onClick={() => setFilterStage(filterStage === stage ? 'All' : stage)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded transition-all duration-150"
              style={{
                background: filterStage === stage ? 'oklch(0.78 0.17 65 / 0.15)' : 'oklch(0.18 0.055 240)',
                border: `1px solid ${filterStage === stage ? 'oklch(0.78 0.17 65 / 0.4)' : 'oklch(1 0 0 / 0.06)'}`,
                color: filterStage === stage ? AMBER : 'oklch(0.65 0.03 240)',
                fontFamily: 'DM Sans',
                fontSize: '12px',
              }}
            >
              {stage}
              <span
                className="rounded-full px-1.5 py-0.5"
                style={{ fontFamily: 'DM Mono', fontSize: '10px', background: 'oklch(1 0 0 / 0.06)', color: 'oklch(0.75 0.01 80)' }}
              >
                {stageCount[stage] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'oklch(0.45 0.03 240)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or company..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg"
          style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.08)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
        />
      </div>

      {/* Leads table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div
          className="grid text-left px-4 py-3"
          style={{
            gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 1fr 0.8fr 80px',
            background: 'oklch(0.19 0.055 240)',
            borderBottom: '1px solid oklch(1 0 0 / 0.06)',
          }}
        >
          {['NAME / COMPANY', 'PRODUCT', 'STAGE', 'FOLLOW-UP', 'COMMISSION', 'STATUS', ''].map((h, i) => (
            <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>
              {h}
            </div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center" style={{ background: 'oklch(0.22 0.05 240)' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>
              {leads.length === 0 ? 'No leads yet. Add your first lead to start building your pipeline.' : 'No leads match your filter.'}
            </div>
          </div>
        ) : (
          filtered.map((lead, idx) => (
            <div
              key={lead.id}
              className="grid items-center px-4 py-3 transition-colors duration-100 group"
              style={{
                gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr 1fr 0.8fr 80px',
                background: idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)',
                borderBottom: '1px solid oklch(1 0 0 / 0.04)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.9 0.01 80)' }}>{lead.name}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)' }}>{lead.company || '—'}</div>
              </div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.7 0.01 80)' }}>{lead.product || '—'}</div>
              <div>
                <span
                  className="status-badge"
                  style={{ background: `${STAGE_COLORS[lead.stage]}20`, color: STAGE_COLORS[lead.stage], border: `1px solid ${STAGE_COLORS[lead.stage]}40` }}
                >
                  {lead.stage}
                </span>
              </div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '11px', color: 'oklch(0.65 0.03 240)' }}>{formatDate(lead.nextFollowUp)}</div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '12px', color: AMBER }}>{lead.commissionValue ? formatCurrency(lead.commissionValue) : '—'}</div>
              <div>
                <span
                  className="status-badge"
                  style={{
                    background: lead.status === 'Active' ? 'oklch(0.72 0.17 160 / 0.1)' : lead.status === 'Lost' ? 'oklch(0.65 0.22 25 / 0.1)' : 'oklch(0.78 0.17 65 / 0.1)',
                    color: lead.status === 'Active' ? 'oklch(0.72 0.17 160)' : lead.status === 'Lost' ? 'oklch(0.65 0.22 25)' : 'oklch(0.78 0.17 65)',
                  }}
                >
                  {lead.status}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(lead)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}>
                  <Edit3 size={12} />
                </button>
                <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>
                {editingId ? 'Edit Lead' : 'Add New Lead'}
              </div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', key: 'name', type: 'text', placeholder: 'Ahmed Al Rashid' },
                  { label: 'Company', key: 'company', type: 'text', placeholder: 'Al Rashid Trading LLC' },
                  { label: 'Phone', key: 'phone', type: 'text', placeholder: '+971 50 000 0000' },
                  { label: 'Product', key: 'product', type: 'text', placeholder: 'Personal Loan / Credit Card' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={(form as any)[key]}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded"
                      style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Stage
                  </label>
                  <select
                    value={form.stage}
                    onChange={e => setForm(prev => ({ ...prev, stage: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded"
                    style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                  >
                    {BANKING_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded"
                    style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Next Follow-Up
                  </label>
                  <input
                    type="date"
                    value={form.nextFollowUp}
                    onChange={e => setForm(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                    className="w-full px-3 py-2 rounded"
                    style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Commission Value (AED)
                  </label>
                  <input
                    type="number"
                    value={form.commissionValue || ''}
                    onChange={e => setForm(prev => ({ ...prev, commissionValue: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded"
                    style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 rounded resize-none"
                  style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="px-4 py-2 rounded"
                style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2 rounded"
                style={{ background: 'oklch(0.78 0.17 65 / 0.15)', color: AMBER, border: '1px solid oklch(0.78 0.17 65 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
              >
                <Save size={13} /> {editingId ? 'Update' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
