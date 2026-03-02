/**
 * HABIT TRACKER — Engine 03: Stability Engine
 * Design: The Architect's Notebook — Violet accent
 * Daily habits: Fajr, gym, reading, reflection, no-scroll
 */

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, CheckCircle2, Circle } from 'lucide-react';
import { stabilityStore, generateId, type HabitLog } from '@/lib/store';
import { toast } from 'sonner';

const VIOLET = 'oklch(0.65 0.2 290)';

const DEFAULT_HABITS = [
  { name: 'Fajr on time', category: 'Spiritual' },
  { name: 'Gym / Physical training', category: 'Health' },
  { name: 'Read 20 minutes', category: 'Growth' },
  { name: 'Daily reflection / journaling', category: 'Mental' },
  { name: 'No mindless scrolling', category: 'Mental' },
  { name: 'Review daily goals', category: 'Productivity' },
  { name: 'Drink 2L water', category: 'Health' },
  { name: 'Sleep by 11pm', category: 'Health' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Spiritual': 'oklch(0.78 0.17 65)',
  'Health': 'oklch(0.72 0.17 160)',
  'Growth': 'oklch(0.78 0.16 175)',
  'Mental': VIOLET,
  'Productivity': 'oklch(0.65 0.12 200)',
};

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

export default function HabitTracker() {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [habits, setHabits] = useState<string[]>(DEFAULT_HABITS.map(h => h.name));
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const todayKey = getTodayKey();
  const last7 = getLast7Days();

  useEffect(() => {
    setLogs(stabilityStore.getHabitLogs());
    const stored = stabilityStore.getHabitList();
    if (stored.length > 0) setHabits(stored);
  }, []);

  const reload = () => setLogs(stabilityStore.getHabitLogs());

  const isChecked = (date: string, habit: string) => {
    return logs.some(l => l.date === date && l.habit === habit && l.completed);
  };

  const toggleHabit = (date: string, habit: string) => {
    const existing = logs.find(l => l.date === date && l.habit === habit);
    if (existing) {
      stabilityStore.updateHabitLog(existing.id, { completed: !existing.completed });
    } else {
      stabilityStore.addHabitLog({ id: generateId(), date, habit, completed: true });
    }
    reload();
  };

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    const updated = [...habits, newHabit.trim()];
    setHabits(updated);
    stabilityStore.saveHabitList(updated);
    setNewHabit('');
    setShowAddHabit(false);
    toast.success('Habit added');
  };

  const handleRemoveHabit = (habit: string) => {
    const updated = habits.filter(h => h !== habit);
    setHabits(updated);
    stabilityStore.saveHabitList(updated);
    toast.success('Habit removed');
  };

  const todayScore = habits.filter(h => isChecked(todayKey, h)).length;
  const todayPercent = habits.length > 0 ? Math.round((todayScore / habits.length) * 100) : 0;

  const weeklyScores = last7.map(date => ({
    date,
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-AE', { weekday: 'short' }),
    score: habits.filter(h => isChecked(date, h)).length,
    percent: habits.length > 0 ? Math.round((habits.filter(h => isChecked(date, h)).length / habits.length) * 100) : 0,
  }));

  return (
    <div className="min-h-screen px-8 py-8 page-enter">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="section-label mb-1" style={{ color: VIOLET }}>ENGINE 03 · STABILITY</div>
          <h1 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.6rem', color: 'oklch(0.94 0.01 80)', letterSpacing: '-0.03em' }}>
            Daily Habit Tracker
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.55 0.03 240)', marginTop: '3px' }}>
            Fajr · Gym · Reading · Reflection · Discipline
          </p>
        </div>
        <button
          onClick={() => setShowAddHabit(true)}
          className="flex items-center gap-2 px-4 py-2 rounded"
          style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}
        >
          <Plus size={14} /> Add Habit
        </button>
      </div>

      {/* Today's score */}
      <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="section-label mb-1">TODAY'S SCORE</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'oklch(0.75 0.01 80)' }}>
              {new Date().toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div style={{ fontFamily: 'DM Mono', fontSize: '2rem', fontWeight: 500, color: todayPercent >= 80 ? 'oklch(0.72 0.17 160)' : todayPercent >= 50 ? VIOLET : 'oklch(0.78 0.17 65)' }}>
            {todayScore}/{habits.length}
          </div>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: '6px', background: 'oklch(1 0 0 / 0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${todayPercent}%`, background: todayPercent >= 80 ? 'oklch(0.72 0.17 160)' : todayPercent >= 50 ? VIOLET : 'oklch(0.78 0.17 65)' }}
          />
        </div>
      </div>

      {/* 7-day heatmap */}
      <div className="rounded-lg p-5 mb-5" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="section-label mb-4">7-DAY OVERVIEW</div>
        <div className="grid grid-cols-7 gap-2">
          {weeklyScores.map(({ date, label, score, percent }) => (
            <div key={date} className="text-center">
              <div style={{ fontFamily: 'DM Mono', fontSize: '9px', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</div>
              <div
                className="rounded flex items-center justify-center mx-auto"
                style={{
                  width: '40px', height: '40px',
                  background: percent >= 80 ? 'oklch(0.72 0.17 160 / 0.3)' : percent >= 50 ? 'oklch(0.65 0.2 290 / 0.2)' : percent > 0 ? 'oklch(0.78 0.17 65 / 0.15)' : 'oklch(1 0 0 / 0.04)',
                  border: `1px solid ${date === todayKey ? VIOLET : 'oklch(1 0 0 / 0.06)'}`,
                }}
              >
                <span style={{ fontFamily: 'DM Mono', fontSize: '11px', color: percent >= 80 ? 'oklch(0.72 0.17 160)' : percent >= 50 ? VIOLET : percent > 0 ? 'oklch(0.78 0.17 65)' : 'oklch(0.35 0.03 240)' }}>
                  {score}
                </span>
              </div>
              <div style={{ fontFamily: 'DM Mono', fontSize: '8px', color: 'oklch(0.4 0.03 240)', marginTop: '4px' }}>{percent}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's habit checklist */}
      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(1 0 0 / 0.06)' }}>
        <div className="px-5 py-3" style={{ background: 'oklch(0.19 0.055 240)', borderBottom: '1px solid oklch(1 0 0 / 0.06)' }}>
          <div style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.12em', color: 'oklch(0.45 0.03 240)', textTransform: 'uppercase' }}>
            TODAY'S HABITS · CLICK TO TOGGLE
          </div>
        </div>
        {habits.map((habit, idx) => {
          const checked = isChecked(todayKey, habit);
          const defaultHabitData = DEFAULT_HABITS.find(h => h.name === habit);
          const category = defaultHabitData?.category || 'Productivity';
          return (
            <div
              key={habit}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition-colors duration-100 group"
              style={{
                background: checked ? 'oklch(0.72 0.17 160 / 0.05)' : idx % 2 === 0 ? 'oklch(0.22 0.05 240)' : 'oklch(0.21 0.05 240)',
                borderBottom: '1px solid oklch(1 0 0 / 0.04)',
              }}
              onClick={() => toggleHabit(todayKey, habit)}
            >
              <div className="flex items-center gap-3">
                {checked
                  ? <CheckCircle2 size={18} style={{ color: 'oklch(0.72 0.17 160)', flexShrink: 0 }} />
                  : <Circle size={18} style={{ color: 'oklch(0.35 0.03 240)', flexShrink: 0 }} />
                }
                <span style={{ fontFamily: 'DM Sans', fontSize: '13px', color: checked ? 'oklch(0.55 0.03 240)' : 'oklch(0.85 0.01 80)', textDecoration: checked ? 'line-through' : 'none' }}>
                  {habit}
                </span>
                <span
                  className="status-badge"
                  style={{ background: `${CATEGORY_COLORS[category] || VIOLET}15`, color: CATEGORY_COLORS[category] || VIOLET }}
                >
                  {category}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveHabit(habit); }}
                className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'oklch(0.45 0.03 240)' }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add habit modal */}
      {showAddHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 0.7)' }}>
          <div className="w-full max-w-sm rounded-xl overflow-hidden" style={{ background: 'oklch(0.22 0.05 240)', border: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '15px', color: 'oklch(0.94 0.01 80)' }}>Add New Habit</div>
              <button onClick={() => setShowAddHabit(false)} style={{ color: 'oklch(0.55 0.03 240)' }}><X size={16} /></button>
            </div>
            <div className="p-6">
              <label style={{ fontFamily: 'DM Mono', fontSize: '9px', letterSpacing: '0.1em', color: 'oklch(0.55 0.03 240)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Habit Name</label>
              <input
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
                placeholder="e.g. Meditate 10 minutes"
                className="w-full px-3 py-2 rounded"
                style={{ background: 'oklch(0.18 0.055 240)', border: '1px solid oklch(1 0 0 / 0.1)', color: 'oklch(0.85 0.01 80)', fontFamily: 'DM Sans', fontSize: '13px' }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'oklch(1 0 0 / 0.06)' }}>
              <button onClick={() => setShowAddHabit(false)} style={{ color: 'oklch(0.55 0.03 240)', fontFamily: 'DM Sans', fontSize: '13px' }} className="px-4 py-2 rounded">Cancel</button>
              <button onClick={handleAddHabit} className="flex items-center gap-2 px-5 py-2 rounded" style={{ background: 'oklch(0.65 0.2 290 / 0.15)', color: VIOLET, border: '1px solid oklch(0.65 0.2 290 / 0.3)', fontFamily: 'DM Sans', fontSize: '13px' }}>
                <Save size={13} /> Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
