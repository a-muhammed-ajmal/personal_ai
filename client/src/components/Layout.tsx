/**
 * LAYOUT COMPONENT — Ajmal Personal OS v2.0
 * Design: The Architect's Notebook — Swiss Modernism meets Dark Productivity
 * Fixed asymmetric sidebar (280px) + wide content area
 * Signature: Thin vertical teal accent bars, uppercase dot-separated labels
 */

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Landmark,
  Briefcase,
  Shield,
  BookOpen,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Target,
  TrendingUp,
  Users,
  FileText,
  Brain,
  Wallet,
  Activity,
  ClipboardList,
  Database,
  Lightbulb,
  Wrench,
  RefreshCw,
  Layers,
} from 'lucide-react';

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type NavSection = {
  id: string;
  label: string;
  engine?: 'banking' | 'consulting' | 'stability' | 'control' | 'core';
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    id: 'home',
    label: 'COMMAND',
    items: [
      { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={15} /> },
      { label: 'Strategic Core', path: '/strategic-core', icon: <Target size={15} /> },
      { label: 'Daily Workflow', path: '/daily-workflow', icon: <Calendar size={15} /> },
    ],
  },
  {
    id: 'banking',
    label: 'ENGINE 01 · CASH FLOW',
    engine: 'banking',
    items: [
      { label: 'Banking CRM', path: '/banking/crm', icon: <Users size={15} /> },
      { label: 'Activity Tracker', path: '/banking/activity', icon: <BarChart3 size={15} /> },
      { label: 'Product Vault', path: '/banking/products', icon: <Database size={15} /> },
      { label: 'Market Intelligence', path: '/banking/market-intel', icon: <Brain size={15} /> },
    ],
  },
  {
    id: 'consulting',
    label: 'ENGINE 02 · ASSET',
    engine: 'consulting',
    items: [
      { label: 'Consulting CRM', path: '/consulting/crm', icon: <Briefcase size={15} /> },
      { label: 'Offer Framework', path: '/consulting/offers', icon: <Layers size={15} /> },
      { label: 'Content System', path: '/consulting/content', icon: <Lightbulb size={15} /> },
      { label: 'Toolkit Vault', path: '/consulting/toolkit', icon: <Wrench size={15} /> },
    ],
  },
  {
    id: 'stability',
    label: 'ENGINE 03 · STABILITY',
    engine: 'stability',
    items: [
      { label: 'Finance Panel', path: '/stability/finance', icon: <Wallet size={15} /> },
      { label: 'Habit Tracker', path: '/stability/habits', icon: <Activity size={15} /> },
      { label: 'Burnout Monitor', path: '/stability/burnout', icon: <Shield size={15} /> },
    ],
  },
  {
    id: 'control',
    label: 'CONTROL SYSTEM',
    engine: 'control',
    items: [
      { label: 'Weekly Review', path: '/control/weekly', icon: <RefreshCw size={15} /> },
      { label: 'Quarterly Review', path: '/control/quarterly', icon: <Calendar size={15} /> },
    ],
  },
];

const engineColors: Record<string, string> = {
  banking: 'oklch(0.78 0.17 65)',
  consulting: 'oklch(0.72 0.17 160)',
  stability: 'oklch(0.65 0.2 290)',
  control: 'oklch(0.78 0.16 175)',
  core: 'oklch(0.78 0.16 175)',
};

const engineBgColors: Record<string, string> = {
  banking: 'oklch(0.78 0.17 65 / 0.08)',
  consulting: 'oklch(0.72 0.17 160 / 0.08)',
  stability: 'oklch(0.65 0.2 290 / 0.08)',
  control: 'oklch(0.78 0.16 175 / 0.08)',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-AE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: 'oklch(0.78 0.16 175 / 0.15)', border: '1px solid oklch(0.78 0.16 175 / 0.3)' }}
          >
            <span style={{ fontFamily: 'DM Mono', fontSize: '12px', color: 'oklch(0.78 0.16 175)', fontWeight: 500 }}>AJ</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '13px', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.01em' }}>
                AJMAL OS
              </div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.78 0.16 175)', letterSpacing: '0.12em', opacity: 0.7 }}>
                v2.0 · PERSONAL
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map((section) => {
          const engineColor = section.engine ? engineColors[section.engine] : 'oklch(0.78 0.16 175)';
          return (
            <div key={section.id} className="mb-5">
              {!collapsed && (
                <div
                  className="px-3 mb-1.5"
                  style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: engineColor, opacity: 0.7 }}
                >
                  {section.label}
                </div>
              )}
              {section.items.map((item) => {
                const isActive = location === item.path || (item.path !== '/' && location.startsWith(item.path));
                const engineBg = section.engine ? engineBgColors[section.engine] : 'oklch(0.78 0.16 175 / 0.08)';
                return (
                  <Link key={item.path} href={item.path}>
                    <div
                      className="relative flex items-center gap-2.5 px-3 py-2 rounded transition-all duration-150 mb-0.5 group"
                      style={{
                        background: isActive ? engineBg : 'transparent',
                        color: isActive ? 'oklch(0.94 0.01 80)' : 'oklch(0.65 0.03 240)',
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r"
                          style={{ background: engineColor }}
                        />
                      )}
                      <span style={{ color: isActive ? engineColor : 'oklch(0.55 0.03 240)', flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: isActive ? 500 : 400 }}>
                          {item.label}
                        </span>
                      )}
                      {/* Hover effect */}
                      {!isActive && (
                        <div
                          className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                          style={{ background: 'oklch(1 0 0 / 0.03)' }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-white/5">
          <div style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.45 0.03 240)', letterSpacing: '0.08em' }}>
            {today}
          </div>
          <div className="mt-1" style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.35 0.03 240)', letterSpacing: '0.05em' }}>
            CLARITY → STRUCTURE → SCALE
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'oklch(0.18 0.055 240)' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'oklch(0 0 0 / 0.6)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-200 border-r"
        style={{
          width: collapsed ? '60px' : '260px',
          background: 'oklch(0.16 0.055 240)',
          borderColor: 'oklch(1 0 0 / 0.06)',
        }}
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-16 -right-3 w-6 h-6 rounded-full flex items-center justify-center border transition-colors z-10"
          style={{
            background: 'oklch(0.22 0.05 240)',
            borderColor: 'oklch(1 0 0 / 0.1)',
            color: 'oklch(0.65 0.03 240)',
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Sidebar — mobile */}
      <aside
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col lg:hidden transition-transform duration-200"
        style={{
          width: '260px',
          background: 'oklch(0.16 0.055 240)',
          borderRight: '1px solid oklch(1 0 0 / 0.06)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar — mobile only */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ background: 'oklch(0.16 0.055 240)', borderColor: 'oklch(1 0 0 / 0.06)' }}
        >
          <button onClick={() => setMobileOpen(true)} style={{ color: 'oklch(0.65 0.03 240)' }}>
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '13px', color: 'oklch(0.94 0.01 80)' }}>
            AJMAL OS
          </span>
          <div className="w-5" />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
