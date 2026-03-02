/**
 * OFFER FRAMEWORK — Engine 02: Asset Engine
 * Design: The Architect's Notebook — Emerald accent
 * Three-tier consulting offer with checklists
 */

import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';

const EMERALD = 'oklch(0.72 0.17 160)';

const offers = [
  {
    id: 'entry',
    tier: 'ENTRY',
    name: 'Business Clarity Session',
    price: 'AED 1,500 – 3,000',
    duration: '2–3 hours',
    description: 'A diagnostic conversation that identifies the core bottlenecks preventing the business from growing. The client leaves with clarity on what to fix first.',
    deliverables: [
      'Pre-session questionnaire sent and reviewed',
      'Business model and revenue stream analysis',
      'Identification of top 3 operational bottlenecks',
      'Cash flow pattern assessment',
      'Team structure and role clarity review',
      'Founder dependency mapping',
      'Written summary report with prioritized recommendations',
      'Follow-up action plan (30-day roadmap)',
    ],
    color: 'oklch(0.78 0.16 175)',
  },
  {
    id: 'core',
    tier: 'CORE',
    name: 'Systems Foundation Implementation',
    price: 'AED 8,000 – 20,000',
    duration: '4–8 weeks',
    description: 'Full implementation of the operational foundation. The business gets documented processes, measurable KPIs, and a working system structure.',
    deliverables: [
      'Complete process mapping of all core operations',
      'SOP documentation (minimum 5 core processes)',
      'KPI dashboard design and setup',
      'Role and responsibility matrix',
      'Workflow automation for repetitive tasks',
      'CRM structure setup (if needed)',
      'Team training on new systems',
      'Monthly review framework',
      'Implementation support calls (weekly)',
      'Final handover documentation',
    ],
    color: EMERALD,
  },
  {
    id: 'advanced',
    tier: 'ADVANCED',
    name: 'Growth Alignment Program',
    price: 'AED 25,000 – 50,000+',
    duration: '3–6 months',
    description: 'A comprehensive engagement covering financial structuring, growth strategy, and operational reorganization. For businesses ready to scale.',
    deliverables: [
      'Full business audit and gap analysis',
      'Financial structuring and cash flow optimization',
      'Revenue model refinement',
      'CRM pipeline optimization',
      'Operational reorganization plan',
      'Partnership and growth strategy',
      'Hiring plan and org structure design',
      'Quarterly OKR framework',
      'Monthly strategic advisory sessions',
      'Ongoing implementation support',
      'Performance dashboard with real-time KPIs',
      'Exit/transition strategy planning',
    ],
    color: 'oklch(0.78 0.17 65)',
  },
];

export default function OfferFramework() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ entry: true, core: true, advanced: true });
  const [checked, setChecked] = useState<Record<string, Record<number, boolean>>>({});

  const toggleCheck = (offerId: string, idx: number) => {
    setChecked(prev => ({
      ...prev,
      [offerId]: { ...prev[offerId], [idx]: !prev[offerId]?.[idx] },
    }));
  };

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="mb-6">
        <div className="section-label mb-1" style={{ color: EMERALD }}>ENGINE 02 · ASSET</div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
          Offer Framework
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
          Three-tier consulting structure · Entry → Core → Advanced
        </p>
      </div>

      {/* Offer cards */}
      <div className="space-y-4">
        {offers.map((offer, offerIdx) => (
          <div
            key={offer.id}
            className="rounded-lg overflow-hidden card-enter"
            style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${offer.color}25`, animationDelay: `${offerIdx * 80}ms` }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 cursor-pointer"
              style={{ borderBottom: expanded[offer.id] ? '1px solid oklch(1 0 0 / 0.05)' : 'none' }}
              onClick={() => setExpanded(prev => ({ ...prev, [offer.id]: !prev[offer.id] }))}
            >
              <div className="flex items-center gap-5">
                <div className="w-0.5 h-12 rounded" style={{ background: offer.color }} />
                <div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.15em', color: offer.color, textTransform: 'uppercase', marginBottom: '2px' }}>
                    {offer.tier} TIER
                  </div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '16px', color: 'oklch(0.94 0.01 80)' }}>
                    {offer.name}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div style={{ fontFamily: 'DM Mono', fontSize: '13px', fontWeight: 500, color: offer.color }}>{offer.price}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)' }}>{offer.duration}</div>
                </div>
                {expanded[offer.id] ? <ChevronUp size={14} style={{ color: 'oklch(0.55 0.03 240)' }} /> : <ChevronDown size={14} style={{ color: 'oklch(0.55 0.03 240)' }} />}
              </div>
            </div>

            {expanded[offer.id] && (
              <div className="px-6 pb-6 pt-4">
                <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.72 0.01 80)', lineHeight: 1.7, marginBottom: '16px' }}>
                  {offer.description}
                </p>
                <div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', marginBottom: '10px' }}>
                    DELIVERABLES CHECKLIST
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {offer.deliverables.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded cursor-pointer transition-colors duration-100"
                        style={{ background: checked[offer.id]?.[i] ? `${offer.color}08` : 'transparent' }}
                        onClick={() => toggleCheck(offer.id, i)}
                      >
                        {checked[offer.id]?.[i]
                          ? <CheckCircle2 size={14} style={{ color: offer.color, flexShrink: 0, marginTop: '1px' }} />
                          : <Circle size={14} style={{ color: 'oklch(0.35 0.03 240)', flexShrink: 0, marginTop: '1px' }} />
                        }
                        <span style={{ fontFamily: 'DM Sans', fontSize: '12px', color: checked[offer.id]?.[i] ? 'oklch(0.55 0.03 240)' : 'oklch(0.78 0.01 80)', textDecoration: checked[offer.id]?.[i] ? 'line-through' : 'none', lineHeight: 1.5 }}>
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.45 0.03 240)', marginTop: '12px' }}>
                    {Object.values(checked[offer.id] || {}).filter(Boolean).length} / {offer.deliverables.length} completed
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Focus note */}
      <div className="mt-6 p-4 rounded-lg" style={{ background: 'oklch(0.72 0.17 160 / 0.06)', border: '1px solid oklch(0.72 0.17 160 / 0.15)' }}>
        <div className="section-label mb-2">CORE PRINCIPLE</div>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)', lineHeight: 1.7 }}>
          I focus on <strong style={{ color: EMERALD }}>implementation, not theory</strong>. Every engagement ends with the client having working systems, not just recommendations. The goal is to make their business easier to run and more profitable to operate.
        </p>
      </div>
    </div>
  );
}
