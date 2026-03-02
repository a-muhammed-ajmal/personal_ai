/**
 * STRATEGIC CORE — Identity Blueprint
 * Design: The Architect's Notebook — Teal accent
 * Vision, values, identity, non-negotiables, 5-year targets
 */

import { useState } from 'react';
import { Edit3, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const TEAL = 'oklch(0.72 0.14 195)';

function getStore<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch { return defaultValue; }
}
function setStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DEFAULT_CORE = {
  identity: `I am Muhammed Ajmal — a banker by day, a systems consultant in the making, and a man building a life of purpose, financial freedom, and lasting impact.

I operate at the intersection of finance and business operations. I help people access capital through banking, and I help businesses build the systems they need to grow sustainably.

I am not just building a career. I am building an empire — brick by brick, system by system.`,

  vision: `By 2027, I will have:
• Built a consulting practice generating AED 20,000+ per month
• Accumulated a 12-month financial runway
• Established myself as a recognized voice in UAE business systems
• Transitioned from employee to entrepreneur, on my own terms
• Built a life where my family is financially secure and my work is meaningful`,

  values: [
    { value: 'Discipline over motivation', description: 'I show up regardless of how I feel. Systems beat willpower.' },
    { value: 'Clarity over complexity', description: 'I simplify. I document. I make things repeatable.' },
    { value: 'Patience with urgency', description: 'I play the long game but move with daily intensity.' },
    { value: 'Integrity in all dealings', description: 'My reputation is my most valuable asset.' },
    { value: 'Family first, always', description: 'Every ambition is in service of the people I love.' },
  ],

  nonNegotiables: [
    'Fajr on time, every day',
    'No compromising on client trust',
    'Weekly review — no exceptions',
    'Save before spending',
    'Physical training minimum 4x per week',
    'Read every single day',
    'Never stop learning about business and finance',
  ],

  targets2027: [
    { category: 'Banking', target: 'Top 10% performer in my team, consistent AED 8,000+ monthly commission' },
    { category: 'Consulting', target: '5 active consulting clients, AED 20,000+ monthly revenue' },
    { category: 'Finance', target: 'AED 150,000 in savings, 12-month emergency runway' },
    { category: 'Knowledge', target: 'Deep expertise in UAE business law, finance, and operations' },
    { category: 'Brand', target: '10,000 LinkedIn followers, recognized as a UAE business systems expert' },
  ],
};

export default function StrategicCore() {
  const [data, setData] = useState(() => getStore('ajmal_strategic_core', DEFAULT_CORE));
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const startEdit = (section: string, currentValue: string) => {
    setEditingSection(section);
    setTempValue(currentValue);
  };

  const saveEdit = (section: string) => {
    const updated = { ...data, [section]: tempValue };
    setData(updated);
    setStore('ajmal_strategic_core', updated);
    setEditingSection(null);
    toast.success('Updated');
  };

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="mb-6">
        <div className="section-label mb-1" style={{ color: TEAL }}>STRATEGIC CORE</div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
          Identity Blueprint
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
          Who you are · Where you're going · What you stand for
        </p>
      </div>

      <div className="space-y-5">
        {/* Identity */}
        <Section
          title="WHO I AM"
          color={TEAL}
          editingSection={editingSection}
          sectionKey="identity"
          onEdit={() => startEdit('identity', data.identity)}
          onSave={() => saveEdit('identity')}
          onCancel={() => setEditingSection(null)}
          tempValue={tempValue}
          setTempValue={setTempValue}
        >
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.78 0.01 80)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{data.identity}</p>
        </Section>

        {/* Vision */}
        <Section
          title="THE VISION · 2027"
          color="oklch(0.78 0.17 65)"
          editingSection={editingSection}
          sectionKey="vision"
          onEdit={() => startEdit('vision', data.vision)}
          onSave={() => saveEdit('vision')}
          onCancel={() => setEditingSection(null)}
          tempValue={tempValue}
          setTempValue={setTempValue}
        >
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.78 0.01 80)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{data.vision}</p>
        </Section>

        {/* Values */}
        <div className="rounded-lg p-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4" style={{ color: 'oklch(0.72 0.17 160)' }}>CORE VALUES</div>
          <div className="space-y-3">
            {data.values.map((v: typeof data.values[0], i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded" style={{ background: 'oklch(0.19 0.055 240)' }}>
                <div className="w-0.5 h-full min-h-8 rounded" style={{ background: 'oklch(0.72 0.17 160)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '13px', color: 'oklch(0.9 0.01 80)', marginBottom: '2px' }}>{v.value}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.65 0.01 80)' }}>{v.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-negotiables */}
        <div className="rounded-lg p-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4" style={{ color: 'oklch(0.65 0.22 25)' }}>NON-NEGOTIABLES</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.nonNegotiables.map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded" style={{ background: 'oklch(0.19 0.055 240)' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'oklch(0.65 0.22 25)' }} />
                <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.82 0.01 80)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2027 Targets */}
        <div className="rounded-lg p-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div className="section-label mb-4" style={{ color: TEAL }}>2027 TARGETS</div>
          <div className="space-y-3">
            {data.targets2027.map((t: typeof data.targets2027[0], i: number) => (
              <div key={i} className="grid grid-cols-4 gap-3 p-3 rounded" style={{ background: 'oklch(0.19 0.055 240)' }}>
                <div style={{ fontFamily: 'DM Mono', fontSize: '10px', letterSpacing: '0.1em', color: TEAL, textTransform: 'uppercase' }}>{t.category}</div>
                <div className="col-span-3" style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.78 0.01 80)', lineHeight: 1.5 }}>{t.target}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, color, editingSection, sectionKey, onEdit, onSave, onCancel, tempValue, setTempValue, children
}: {
  title: string; color: string; editingSection: string | null; sectionKey: string;
  onEdit: () => void; onSave: () => void; onCancel: () => void;
  tempValue: string; setTempValue: (v: string) => void; children: React.ReactNode;
}) {
  const isEditing = editingSection === sectionKey;
  return (
    <div className="rounded-lg p-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="section-label" style={{ color }}>{title}</div>
        {!isEditing ? (
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '12px' }}>
            <Edit3 size={12} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={onCancel} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '12px' }} className="px-3 py-1.5 rounded">
              <X size={12} />
            </button>
            <button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontFamily: 'DM Sans', fontSize: '12px' }}>
              <Save size={12} /> Save
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <textarea
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          rows={10}
          className="w-full px-3 py-2 rounded resize-none"
          style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px', lineHeight: 1.7 }}
          autoFocus
        />
      ) : children}
    </div>
  );
}
