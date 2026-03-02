/**
 * DAILY WORKFLOW — Control System
 * Design: The Architect's Notebook — Teal accent
 * The structured daily schedule and operating rhythm
 */

import { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const TEAL = 'oklch(0.72 0.14 195)';

const SCHEDULE = [
  {
    time: '5:00 AM',
    block: 'MORNING FOUNDATION',
    color: 'oklch(0.78 0.17 65)',
    tasks: [
      { task: 'Fajr prayer', duration: '15 min', category: 'Spiritual' },
      { task: 'Physical training / gym', duration: '45 min', category: 'Health' },
      { task: 'Cold shower + grooming', duration: '15 min', category: 'Health' },
      { task: 'Review daily goals + priorities', duration: '10 min', category: 'Productivity' },
    ],
  },
  {
    time: '7:00 AM',
    block: 'BANKING WORK',
    color: 'oklch(0.78 0.17 65)',
    tasks: [
      { task: 'Morning calls — follow-ups and new leads', duration: '60 min', category: 'Banking' },
      { task: 'Client visits and document collection', duration: '120 min', category: 'Banking' },
      { task: 'Pipeline review and CRM update', duration: '20 min', category: 'Banking' },
      { task: 'Market intelligence — observe businesses', duration: '30 min', category: 'Banking' },
    ],
  },
  {
    time: '1:00 PM',
    block: 'MIDDAY RESET',
    color: TEAL,
    tasks: [
      { task: 'Dhuhr prayer', duration: '10 min', category: 'Spiritual' },
      { task: 'Lunch — no screens, mindful eating', duration: '30 min', category: 'Health' },
      { task: 'Short walk or rest', duration: '20 min', category: 'Health' },
    ],
  },
  {
    time: '2:00 PM',
    block: 'BANKING AFTERNOON',
    color: 'oklch(0.78 0.17 65)',
    tasks: [
      { task: 'Afternoon client visits', duration: '120 min', category: 'Banking' },
      { task: 'Application submissions and follow-ups', duration: '60 min', category: 'Banking' },
      { task: 'Asr prayer', duration: '10 min', category: 'Spiritual' },
    ],
  },
  {
    time: '6:00 PM',
    block: 'CONSULTING & GROWTH',
    color: 'oklch(0.72 0.17 160)',
    tasks: [
      { task: 'Consulting work — client projects or proposals', duration: '60 min', category: 'Consulting' },
      { task: 'Content creation — LinkedIn post or draft', duration: '30 min', category: 'Consulting' },
      { task: 'Learning — books, courses, podcasts', duration: '30 min', category: 'Growth' },
    ],
  },
  {
    time: '8:00 PM',
    block: 'FAMILY & RECOVERY',
    color: 'oklch(0.65 0.2 290)',
    tasks: [
      { task: 'Family time — fully present, no work', duration: '60 min', category: 'Personal' },
      { task: 'Maghrib + Isha prayers', duration: '20 min', category: 'Spiritual' },
      { task: 'Daily reflection — journal 3 wins + 1 lesson', duration: '15 min', category: 'Mental' },
      { task: 'Read 20 minutes', duration: '20 min', category: 'Growth' },
    ],
  },
  {
    time: '10:30 PM',
    block: 'WIND DOWN',
    color: 'oklch(0.55 0.03 240)',
    tasks: [
      { task: 'Prepare tomorrow\'s priorities', duration: '10 min', category: 'Productivity' },
      { task: 'No screens — phone on silent', duration: '', category: 'Mental' },
      { task: 'Sleep by 11:00 PM', duration: '', category: 'Health' },
    ],
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Spiritual': 'oklch(0.78 0.17 65)',
  'Health': 'oklch(0.72 0.17 160)',
  'Banking': 'oklch(0.78 0.17 65)',
  'Consulting': 'oklch(0.72 0.17 160)',
  'Growth': 'oklch(0.78 0.16 175)',
  'Mental': 'oklch(0.65 0.2 290)',
  'Personal': TEAL,
  'Productivity': 'oklch(0.65 0.12 200)',
};

export default function DailyWorkflow() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const todayKey = new Date().toISOString().split('T')[0];

  const totalTasks = SCHEDULE.reduce((s, b) => s + b.tasks.length, 0);
  const completedTasks = Object.values(checked).filter(Boolean).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="mb-6">
        <div className="section-label mb-1" style={{ color: TEAL }}>CONTROL SYSTEM</div>
        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
          Daily Operating Rhythm
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
          {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Daily progress */}
      <div className="rounded-lg p-5 mb-6" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="section-label mb-1">TODAY'S COMPLETION</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)' }}>
              {completedTasks} of {totalTasks} tasks done
            </div>
          </div>
          <div style={{ fontFamily: 'DM Mono', fontSize: '2rem', fontWeight: 500, color: completionPercent >= 80 ? 'oklch(0.72 0.17 160)' : completionPercent >= 50 ? TEAL : 'oklch(0.78 0.17 65)' }}>
            {completionPercent}%
          </div>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'oklch(1 0 0 / 0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%`, background: completionPercent >= 80 ? 'oklch(0.72 0.17 160)' : completionPercent >= 50 ? TEAL : 'oklch(0.78 0.17 65)' }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setChecked({})}
            style={{ fontFamily: 'DM Sans', fontSize: '11px', color: 'oklch(0.45 0.03 240)' }}
          >
            Reset for today
          </button>
        </div>
      </div>

      {/* Schedule blocks */}
      <div className="space-y-4">
        {SCHEDULE.map((block, blockIdx) => (
          <div key={blockIdx} className="rounded-lg overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: `1px solid ${block.color}15` }}>
            <div className="flex items-center gap-4 px-5 py-3" style={{ background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.05)' }}>
              <div className="flex items-center gap-2">
                <Clock size={12} style={{ color: block.color }} />
                <span style={{ fontFamily: 'DM Mono', fontSize: '11px', color: block.color, fontWeight: 500 }}>{block.time}</span>
              </div>
              <div className="w-0.5 h-4" style={{ background: 'oklch(1 0 0 / 0.1)' }} />
              <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '12px', color: 'oklch(0.85 0.01 80)', letterSpacing: '0.05em' }}>{block.block}</span>
            </div>
            <div>
              {block.tasks.map((task, taskIdx) => {
                const key = `${blockIdx}-${taskIdx}`;
                const isDone = checked[key];
                return (
                  <div
                    key={taskIdx}
                    className="flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors duration-100"
                    style={{
                      background: isDone ? 'oklch(0.72 0.17 160 / 0.04)' : taskIdx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.215 0.05 240)',
                      borderBottom: taskIdx < block.tasks.length - 1 ? '1px solid oklch(1 0 0 / 0.03)' : 'none',
                    }}
                    onClick={() => setChecked(prev => ({ ...prev, [key]: !prev[key] }))}
                  >
                    {isDone
                      ? <CheckCircle2 size={15} style={{ color: 'oklch(0.72 0.17 160)', flexShrink: 0 }} />
                      : <Circle size={15} style={{ color: 'oklch(0.3 0.03 240)', flexShrink: 0 }} />
                    }
                    <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: isDone ? 'oklch(0.5 0.03 240)' : 'oklch(0.82 0.01 80)', textDecoration: isDone ? 'line-through' : 'none', flex: 1 }}>
                      {task.task}
                    </span>
                    <div className="flex items-center gap-2">
                      {task.duration && (
                        <span style={{ fontFamily: 'DM Mono', fontSize: '10px', color: 'oklch(0.4 0.03 240)' }}>{task.duration}</span>
                      )}
                      <span
                        className="status-badge"
                        style={{ background: `${CATEGORY_COLORS[task.category] || TEAL}12`, color: CATEGORY_COLORS[task.category] || TEAL }}
                      >
                        {task.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* The rule */}
      <div className="mt-6 p-4 rounded-lg" style={{ background: 'oklch(0.72 0.14 195 / 0.06)', border: '1px solid oklch(0.72 0.14 195 / 0.15)' }}>
        <div className="section-label mb-2">THE RULE</div>
        <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)', lineHeight: 1.7 }}>
          <strong style={{ color: TEAL }}>Discipline is not restriction — it is freedom.</strong> Every hour I protect is an hour that compounds. The man who controls his time controls his life. This schedule is not a prison; it is the architecture of the life I am building.
        </p>
      </div>
    </div>
  );
}
