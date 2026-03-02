/**
 * HOME DASHBOARD — Ajmal Personal OS v2.0
 * Design: The Architect's Notebook — Swiss Modernism meets Dark Productivity
 * Root command center with three engine cards, quick stats, and daily workflow
 */

import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Briefcase, Shield, Target, ArrowRight,
  Zap, BarChart3, Activity, Wallet, RefreshCw, Calendar,
  CheckCircle2, Circle, ChevronRight
} from 'lucide-react';
import { bankingStore, consultingStore, stabilityStore, controlStore, formatCurrency } from '@/lib/store';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663395439961/VZH9qyjrM5eNkfpexQNJPn/hero-bg-bzdQEhMXjToMPRaGvj6eAW.webp';
const BANKING_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663395439961/VZH9qyjrM5eNkfpexQNJPn/engine-banking-Vn7zBunsVcGyBtrDitUH3Y.webp';
const CONSULTING_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663395439961/VZH9qyjrM5eNkfpexQNJPn/engine-consulting-aRrkUhYJLRzR8QkeZ34Wxd.webp';
const STABILITY_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663395439961/VZH9qyjrM5eNkfpexQNJPn/engine-stability-HRyK69aPcWCQPrsjr8nyLz.webp';

const dailyChecklist = [
  { id: 'morning', time: 'Morning', task: 'Open Command Center → Check Top 3 priorities', duration: '5 min' },
  { id: 'after-sales', time: 'After Sales', task: 'Update Banking CRM immediately', duration: 'Immediate' },
  { id: 'evening', time: 'Evening', task: 'Log numbers — activity, finance, habits', duration: '10 min' },
  { id: 'sunday', time: 'Sunday', task: 'Full weekly review — all engines', duration: '30 min' },
];

export default function Home() {
  const [stats, setStats] = useState({
    bankingLeads: 0,
    activeLeads: 0,
    consultingLeads: 0,
    activeClients: 0,
    totalCommission: 0,
    totalConsultingValue: 0,
    todayHabit: null as any,
    latestBurnout: null as any,
    latestFinance: null as any,
  });
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const bankingLeads = bankingStore.getLeads();
    const consultingLeads = consultingStore.getLeads();
    const habits = stabilityStore.getHabits();
    const burnout = stabilityStore.getBurnout();
    const finance = stabilityStore.getFinance();

    const today = new Date().toISOString().split('T')[0];
    const todayHabit = habits.find(h => h.date === today) || null;
    const latestBurnout = burnout.length > 0 ? burnout[burnout.length - 1] : null;
    const latestFinance = finance.length > 0 ? finance[finance.length - 1] : null;

    setStats({
      bankingLeads: bankingLeads.length,
      activeLeads: bankingLeads.filter(l => l.status === 'Active').length,
      consultingLeads: consultingLeads.length,
      activeClients: consultingLeads.filter(l => l.status === 'Active Client').length,
      totalCommission: bankingLeads.reduce((sum, l) => sum + (l.commissionValue || 0), 0),
      totalConsultingValue: consultingLeads.reduce((sum, l) => sum + (l.estimatedProjectValue || 0), 0),
      todayHabit,
      latestBurnout,
      latestFinance,
    });

    // Load checked items from localStorage
    const saved = localStorage.getItem('ajmal_daily_checklist_' + today);
    if (saved) setCheckedItems(JSON.parse(saved));
  }, []);

  const toggleCheck = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    localStorage.setItem('ajmal_daily_checklist_' + today, JSON.stringify(updated));
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen page-enter">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          minHeight: '280px',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, oklch(0.18 0.055 240 / 0.7) 0%, oklch(0.18 0.055 240) 100%)' }}
        />
        <div className="relative z-10 px-8 pt-10 pb-8">
          <div className="section-label mb-3">COMMAND CENTER · AJMAL PERSONAL OS v2.0</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '2.2rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {greeting}, Ajmal.
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'oklch(0.65 0.03 240)', marginTop: '6px' }}>
            {dateStr} — Clarity creates control. Control creates confidence.
          </p>

          {/* Quick KPI Strip */}
          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: 'BANKING PIPELINE', value: stats.activeLeads, unit: 'active leads', color: 'oklch(0.78 0.17 65)' },
              { label: 'CONSULTING PIPELINE', value: stats.consultingLeads, unit: 'prospects', color: 'oklch(0.72 0.17 160)' },
              { label: 'ACTIVE CLIENTS', value: stats.activeClients, unit: 'clients', color: 'oklch(0.72 0.17 160)' },
              { label: 'COMMISSION PIPELINE', value: formatCurrency(stats.totalCommission), unit: 'potential', color: 'oklch(0.78 0.17 65)' },
            ].map((kpi, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: kpi.color, opacity: 0.8, textTransform: 'uppercase' }}>
                  {kpi.label}
                </div>
                <div style={{ fontFamily: 'DM Mono', fontSize: '1.4rem', fontWeight: 500, color: 'oklch(0.94 0.01 80)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  {kpi.value}
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)' }}>
                  {kpi.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        {/* Three Engines */}
        <div className="mb-2">
          <div className="section-label mb-4">THE THREE ENGINES</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Engine 1 — Banking */}
          <Link href="/banking/crm">
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 card-enter card-enter-1"
              style={{ border: '1px solid oklch(0.78 0.17 65 / 0.2)', background: 'oklch(0.22 0.05 240)' }}
            >
              <div
                className="h-28 relative overflow-hidden"
                style={{ backgroundImage: `url(${BANKING_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0" style={{ background: 'oklch(0.22 0.05 240 / 0.5)' }} />
                <div className="absolute top-3 left-3">
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.15em', color: 'oklch(0.78 0.17 65)', textTransform: 'uppercase', opacity: 0.9 }}>
                    ENGINE 01
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'oklch(0.78 0.17 65 / 0.15)', border: '1px solid oklch(0.78 0.17 65 / 0.3)' }}
                  >
                    <TrendingUp size={14} style={{ color: 'oklch(0.78 0.17 65)' }} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)', marginBottom: '4px' }}>
                  Cash Flow Engine
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.55 0.03 240)', marginBottom: '12px' }}>
                  Banking sales · CRM · Activity tracking
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '18px', fontWeight: 500, color: 'oklch(0.78 0.17 65)' }}>
                      {stats.bankingLeads}
                    </span>
                    <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)', marginLeft: '4px' }}>
                      total leads
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'oklch(0.78 0.17 65)', opacity: 0.6 }} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'oklch(0.78 0.17 65)' }} />
            </div>
          </Link>

          {/* Engine 2 — Consulting */}
          <Link href="/consulting/crm">
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 card-enter card-enter-2"
              style={{ border: '1px solid oklch(0.72 0.17 160 / 0.2)', background: 'oklch(0.22 0.05 240)' }}
            >
              <div
                className="h-28 relative overflow-hidden"
                style={{ backgroundImage: `url(${CONSULTING_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0" style={{ background: 'oklch(0.22 0.05 240 / 0.5)' }} />
                <div className="absolute top-3 left-3">
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.15em', color: 'oklch(0.72 0.17 160)', textTransform: 'uppercase', opacity: 0.9 }}>
                    ENGINE 02
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'oklch(0.72 0.17 160 / 0.15)', border: '1px solid oklch(0.72 0.17 160 / 0.3)' }}
                  >
                    <Briefcase size={14} style={{ color: 'oklch(0.72 0.17 160)' }} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)', marginBottom: '4px' }}>
                  Asset Engine
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.55 0.03 240)', marginBottom: '12px' }}>
                  Consulting brand · CRM · Content system
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '18px', fontWeight: 500, color: 'oklch(0.72 0.17 160)' }}>
                      {stats.activeClients}
                    </span>
                    <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)', marginLeft: '4px' }}>
                      active clients
                    </span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'oklch(0.72 0.17 160)', opacity: 0.6 }} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'oklch(0.72 0.17 160)' }} />
            </div>
          </Link>

          {/* Engine 3 — Stability */}
          <Link href="/stability/finance">
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 card-enter card-enter-3"
              style={{ border: '1px solid oklch(0.65 0.2 290 / 0.2)', background: 'oklch(0.22 0.05 240)' }}
            >
              <div
                className="h-28 relative overflow-hidden"
                style={{ backgroundImage: `url(${STABILITY_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="absolute inset-0" style={{ background: 'oklch(0.22 0.05 240 / 0.5)' }} />
                <div className="absolute top-3 left-3">
                  <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.15em', color: 'oklch(0.65 0.2 290)', textTransform: 'uppercase', opacity: 0.9 }}>
                    ENGINE 03
                  </div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'oklch(0.65 0.2 290 / 0.15)', border: '1px solid oklch(0.65 0.2 290 / 0.3)' }}
                  >
                    <Shield size={14} style={{ color: 'oklch(0.65 0.2 290)' }} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)', marginBottom: '4px' }}>
                  Stability Engine
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.55 0.03 240)', marginBottom: '12px' }}>
                  Finance · Habits · Burnout prevention
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {stats.latestBurnout ? (
                      <>
                        <span style={{ fontFamily: 'DM Mono', fontSize: '18px', fontWeight: 500, color: 'oklch(0.65 0.2 290)' }}>
                          {Math.round((stats.latestBurnout.energy + stats.latestBurnout.focus + (10 - stats.latestBurnout.stress)) / 3)}/10
                        </span>
                        <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.55 0.03 240)', marginLeft: '4px' }}>
                          wellness score
                        </span>
                      </>
                    ) : (
                      <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.45 0.03 240)' }}>
                        No data yet
                      </span>
                    )}
                  </div>
                  <ChevronRight size={14} style={{ color: 'oklch(0.65 0.2 290)', opacity: 0.6 }} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'oklch(0.65 0.2 290)' }} />
            </div>
          </Link>
        </div>

        {/* Bottom row: Daily Workflow + Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Daily Workflow */}
          <div
            className="lg:col-span-3 rounded-lg p-5 card-enter card-enter-4"
            style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="section-label">DAILY WORKFLOW</div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '14px', color: 'oklch(0.94 0.01 80)', marginTop: '2px' }}>
                  Today's Operating Rhythm
                </div>
              </div>
              <Zap size={16} style={{ color: 'oklch(0.78 0.16 175)', opacity: 0.6 }} />
            </div>
            <div className="space-y-2">
              {dailyChecklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded cursor-pointer transition-colors duration-150"
                  style={{ background: checkedItems[item.id] ? 'oklch(0.78 0.16 175 / 0.05)' : 'oklch(0.18 0.055 240 / 0.5)' }}
                  onClick={() => toggleCheck(item.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {checkedItems[item.id]
                      ? <CheckCircle2 size={15} style={{ color: 'oklch(0.78 0.16 175)' }} />
                      : <Circle size={15} style={{ color: 'oklch(0.4 0.03 240)' }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.78 0.16 175)', textTransform: 'uppercase' }}>
                        {item.time}
                      </span>
                      <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.4 0.03 240)' }}>
                        · {item.duration}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: checkedItems[item.id] ? 'oklch(0.55 0.03 240)' : 'oklch(0.85 0.01 80)', textDecoration: checkedItems[item.id] ? 'line-through' : 'none' }}>
                      {item.task}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links + Master Map */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Strategic Core link */}
            <Link href="/strategic-core">
              <div
                className="rounded-lg p-4 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 card-enter card-enter-5 teal-bar"
                style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(0.78 0.16 175 / 0.15)' }}
              >
                <div className="pl-3">
                  <div className="section-label mb-1">STRATEGIC CORE</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '13px', color: 'oklch(0.94 0.01 80)', marginBottom: '4px' }}>
                    Identity & Blueprint
                  </div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.55 0.03 240)', marginBottom: '8px' }}>
                    Read monthly. Stay aligned.
                  </div>
                  <div className="flex items-center gap-1" style={{ color: 'oklch(0.78 0.16 175)', fontSize: '12px', fontFamily: 'DM Sans' }}>
                    Open <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Weekly Review link */}
            <Link href="/control/weekly">
              <div
                className="rounded-lg p-4 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 card-enter card-enter-6"
                style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="section-label">SUNDAY RITUAL</div>
                  <RefreshCw size={13} style={{ color: 'oklch(0.55 0.03 240)' }} />
                </div>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '13px', color: 'oklch(0.94 0.01 80)', marginBottom: '4px' }}>
                  Weekly Review
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '12px', color: 'oklch(0.55 0.03 240)' }}>
                  All engines · Finance · Personal
                </div>
              </div>
            </Link>

            {/* Master Connection Map */}
            <div
              className="rounded-lg p-4 card-enter card-enter-6"
              style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}
            >
              <div className="section-label mb-3">MASTER CONNECTION MAP</div>
              <div className="space-y-1.5">
                {[
                  { label: 'Strategic Blueprint', desc: 'Defines Direction', color: 'oklch(0.78 0.16 175)' },
                  { label: 'Banking Engine', desc: 'Generates Capital', color: 'oklch(0.78 0.17 65)' },
                  { label: 'Consulting Engine', desc: 'Builds Identity', color: 'oklch(0.72 0.17 160)' },
                  { label: 'Finance Panel', desc: 'Secures Stability', color: 'oklch(0.65 0.2 290)' },
                  { label: 'Weekly Review', desc: 'Maintains Control', color: 'oklch(0.78 0.16 175)' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.75 0.01 80)', fontWeight: 500 }}>
                      {item.label}
                    </span>
                    <span style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.45 0.03 240)', letterSpacing: '0.05em' }}>
                      → {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
