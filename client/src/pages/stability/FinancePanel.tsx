/**
 * FINANCE CONTROL PANEL — Engine 03: Stability Engine
 * Design: The Architect's Notebook — Violet accent
 * Monthly income/expenses, savings %, emergency fund progress
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Save, Wallet } from 'lucide-react';
import { stabilityStore, generateId, formatCurrency, type MonthlyFinance } from '@/lib/store';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VIOLET = 'oklch(0.65 0.2 290)';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EMERGENCY_FUND_TARGET = 50000; // 6-month runway target in AED

const emptyRecord = (): Omit<MonthlyFinance, 'id'> => ({
  month: MONTHS[new Date().getMonth()],
  year: new Date().getFullYear(),
  salary: 0, commission: 0, consultingIncome: 0, expenses: 0,
  savingsPercent: 0, emergencyFund: 0, notes: '',
});

export default function FinancePanel() {
  const [records, setRecords] = useState<MonthlyFinance[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRecord());

  useEffect(() => { setRecords(stabilityStore.getFinance()); }, []);
  const reload = () => setRecords(stabilityStore.getFinance());

  const handleSave = () => {
    if (editingId) {
      stabilityStore.updateFinance(editingId, form);
      toast.success('Record updated');
    } else {
      stabilityStore.addFinance({ ...form, id: generateId() });
      toast.success('Month logged');
    }
    reload(); setShowForm(false); setEditingId(null); setForm(emptyRecord());
  };

  const handleEdit = (r: MonthlyFinance) => {
    setForm({ month: r.month, year: r.year, salary: r.salary, commission: r.commission, consultingIncome: r.consultingIncome, expenses: r.expenses, savingsPercent: r.savingsPercent, emergencyFund: r.emergencyFund, notes: r.notes || '' });
    setEditingId(r.id); setShowForm(true);
  };

  const latestRecord = records.length > 0 ? records[records.length - 1] : null;
  const totalIncome = records.reduce((s, r) => s + r.salary + r.commission + r.consultingIncome, 0);
  const totalExpenses = records.reduce((s, r) => s + r.expenses, 0);
  const latestEmergencyFund = latestRecord?.emergencyFund || 0;
  const emergencyProgress = Math.min((latestEmergencyFund / EMERGENCY_FUND_TARGET) * 100, 100);

  const chartData = [...records].slice(-6).map(r => ({
    label: `${r.month.slice(0, 3)} ${r.year}`,
    income: r.salary + r.commission + r.consultingIncome,
    expenses: r.expenses,
    savings: Math.max(0, (r.salary + r.commission + r.consultingIncome) - r.expenses),
  }));

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: VIOLET }}>ENGINE 03 · STABILITY</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Finance Control Panel
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Salary · Commission · Consulting · Savings · Emergency runway
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyRecord()); setEditingId(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Log Month
        </button>
      </div>

      {/* Financial rules reminder */}
      <div className="rounded-lg p-4 mb-5" style={{ background: 'oklch(0.65 0.2 290 / 0.06)', border: '1px solid oklch(0.65 0.2 290 / 0.15)' }}>
        <div className="section-label mb-2">FINANCIAL RULES</div>
        <div className="flex flex-wrap gap-4">
          {[
            { rule: 'Salary = Survival', color: 'oklch(0.55 0.03 240)' },
            { rule: 'Commission = Growth Accelerator', color: 'oklch(0.78 0.17 65)' },
            { rule: 'Consulting Income = Long-Term Asset', color: 'oklch(0.72 0.17 160)' },
            { rule: 'Save ≥30% of commissions', color: VIOLET },
            { rule: 'Build 6-month emergency runway', color: VIOLET },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ background: r.color }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.72 0.01 80)' }}>{r.rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'TOTAL INCOME', value: formatCurrency(totalIncome), color: VIOLET },
          { label: 'TOTAL EXPENSES', value: formatCurrency(totalExpenses), color: 'oklch(0.65 0.22 25)' },
          { label: 'NET SAVINGS', value: formatCurrency(totalIncome - totalExpenses), color: 'oklch(0.72 0.17 160)' },
          { label: 'EMERGENCY FUND', value: formatCurrency(latestEmergencyFund), color: VIOLET },
        ].map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
            <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: s.color, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>{s.label}</div>
            <div style={{ fontFamily: 'DM Mono', fontSize: '1.1rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Emergency Fund Progress */}
      <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="section-label mb-1">EMERGENCY FUND PROGRESS</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)' }}>
              Target: {formatCurrency(EMERGENCY_FUND_TARGET)} (6-month runway)
            </div>
          </div>
          <div style={{ fontFamily: 'DM Mono', fontSize: '1.2rem', fontWeight: 500, color: VIOLET }}>
            {emergencyProgress.toFixed(1)}%
          </div>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'oklch(1 0 0 / 0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${emergencyProgress}%`, background: `linear-gradient(to right, oklch(0.65 0.2 290 / 0.6), oklch(0.65 0.2 290))` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.45 0.03 240)' }}>{formatCurrency(latestEmergencyFund)}</span>
          <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.45 0.03 240)' }}>{formatCurrency(EMERGENCY_FUND_TARGET)}</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4">INCOME VS EXPENSES · LAST 6 MONTHS</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.2 290)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.2 290)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'oklch(0.45 0.03 240)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)', borderRadius: '6px', fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.85 0.01 80)' }} formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="income" stroke="oklch(0.65 0.2 290)" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="oklch(0.65 0.22 25)" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Records table */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="grid px-4 py-3" style={{ gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr 0.7fr 60px', background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
          {['MONTH', 'SALARY', 'COMMISSION', 'CONSULTING', 'EXPENSES', 'SAVINGS %', 'EMERG. FUND', ''].map((h, i) => (
            <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {records.length === 0 ? (
          <div className="py-12 text-center" style={{ background: 'oklch(0.22 0.05 240)' }}>
            <Wallet size={24} style={{ color: 'oklch(0.35 0.03 240)', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.45 0.03 240)' }}>No months logged yet. Start tracking your finances.</div>
          </div>
        ) : (
          [...records].reverse().map((r, idx) => {
            const totalInc = r.salary + r.commission + r.consultingIncome;
            return (
              <div key={r.id} className="grid items-center px-4 py-3 group" style={{ gridTemplateColumns: '1fr 0.8fr 0.8fr 0.8fr 0.8fr 0.7fr 0.7fr 60px', background: idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)', borderBottom: '1px solid oklch(1 0 0 / 0.04)' }}>
                <div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 500, color: 'oklch(0.9 0.01 80)' }}>{r.month}</div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)' }}>{r.year}</div>
                </div>
                {[r.salary, r.commission, r.consultingIncome, r.expenses].map((v, i) => (
                  <div key={i} style={{ fontFamily: 'DM Mono', fontSize: '11px', color: i === 3 ? 'oklch(0.65 0.22 25)' : 'oklch(0.8 0.01 80)' }}>{v ? formatCurrency(v) : '—'}</div>
                ))}
                <div style={{ fontFamily: 'DM Mono', fontSize: '11px', color: r.savingsPercent >= 30 ? 'oklch(0.72 0.17 160)' : 'oklch(0.78 0.17 65)' }}>{r.savingsPercent ? `${r.savingsPercent}%` : '—'}</div>
                <div style={{ fontFamily: 'DM Mono', fontSize: '11px', color: VIOLET }}>{r.emergencyFund ? formatCurrency(r.emergencyFund) : '—'}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(r)} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Edit3 size={12} /></button>
                  <button onClick={() => { stabilityStore.deleteFinance(r.id); reload(); toast.success('Deleted'); }} className="p-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)' }}><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>{editingId ? 'Edit Month' : 'Log New Month'}</div>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Month</label>
                  <select value={form.month} onChange={e => setForm(p => ({ ...p, month: e.target.value }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Year</label>
                  <input type="number" value={form.year} onChange={e => setForm(p => ({ ...p, year: parseInt(e.target.value) || 2026 }))} className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Salary (AED)', key: 'salary' },
                  { label: 'Commission (AED)', key: 'commission' },
                  { label: 'Consulting Income (AED)', key: 'consultingIncome' },
                  { label: 'Expenses (AED)', key: 'expenses' },
                  { label: 'Savings %', key: 'savingsPercent' },
                  { label: 'Emergency Fund (AED)', key: 'emergencyFund' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input type="number" value={(form as any)[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: parseFloat(e.target.value) || 0 }))} placeholder="0" className="w-full px-3 py-2 rounded" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Mono', fontSize: '13px' }} />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} placeholder="Any notes for this month..." className="w-full px-3 py-2 rounded resize-none" style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> {editingId ? 'Update' : 'Log Month'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
