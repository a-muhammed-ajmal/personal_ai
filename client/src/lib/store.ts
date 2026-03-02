/**
 * AJMAL PERSONAL OS — Data Store
 * Uses localStorage for persistence. All data is stored per-key.
 * Design: The Architect's Notebook — Swiss Modernism meets Dark Productivity
 */

// ============================================================
// TYPES
// ============================================================

export type BankingLead = {
  id: string;
  name: string;
  company: string;
  phone: string;
  product: string;
  stage: 'Lead' | 'Contacted' | 'Interested' | 'Docs Pending' | 'Submitted' | 'Approved' | 'Commission Received';
  nextFollowUp: string;
  commissionValue: number;
  status: 'Active' | 'On Hold' | 'Lost';
  notes?: string;
  createdAt: string;
};

export type WeeklyActivity = {
  id: string;
  weekNumber: number;
  weekLabel: string;
  callsMade: number;
  visitsDone: number;
  submissions: number;
  approvals: number;
  commissionEarned: number;
  notes?: string;
  createdAt: string;
};

export type ProductNote = {
  id: string;
  product: string;
  category: 'Eligibility' | 'Objection Handling' | 'Profit Structure' | 'Rejection Reasons' | 'Compliance';
  content: string;
  updatedAt: string;
};

export type MarketIntelLog = {
  id: string;
  businessName: string;
  industry: string;
  businessSize: string;
  cashFlowCondition: 'Strong' | 'Stable' | 'Tight' | 'Critical';
  ownerMindset: string;
  operationalIssues: string;
  consultingAngle: string;
  date: string;
  createdAt: string;
};

export type ConsultingLead = {
  id: string;
  businessName: string;
  owner: string;
  industry: string;
  observedProblem: string;
  leadSource: string;
  sessionDate: string;
  proposalSent: boolean;
  status: 'New' | 'Contacted' | 'Session Done' | 'Proposal Sent' | 'Negotiating' | 'Active Client' | 'Closed';
  estimatedProjectValue: number;
  notes?: string;
  createdAt: string;
};

export type ContentItem = {
  id: string;
  topicIdea: string;
  pillar: 'Finance' | 'Systems' | 'AI' | 'Growth';
  draftStatus: 'Idea' | 'Drafting' | 'Ready' | 'Posted';
  postedDate?: string;
  engagementNotes?: string;
  createdAt: string;
};

export type ToolkitItem = {
  id: string;
  name: string;
  category: 'SOP Template' | 'KPI Dashboard' | 'CRM Structure' | 'Audit Checklist' | 'Discovery Questions' | 'Other';
  description: string;
  content: string;
  updatedAt: string;
};

export type MonthlyFinance = {
  id: string;
  month: string;
  year: number;
  salary: number;
  commission: number;
  consultingIncome: number;
  expenses: number;
  savingsPercent: number;
  emergencyFund: number;
  notes?: string;
};

export type HabitEntry = {
  id: string;
  date: string;
  exercise: boolean;
  study: boolean;
  followUps: boolean;
  linkedIn: boolean;
  noTimeWaste: boolean;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export type HabitLog = {
  id: string;
  date: string;
  habit: string;
  completed: boolean;
};

export type BurnoutEntry = {
  id: string;
  weekLabel: string;
  energy: number;
  focus: number;
  stress: number;
  notes?: string;
  createdAt: string;
};

export type WeeklyReview = {
  id: string;
  weekLabel: string;
  date: string;
  banking: {
    activityScore: string;
    pipelineGrowth: string;
    conversionRate: string;
    lessons: string;
  };
  consulting: {
    newLeads: string;
    authorityGrowth: string;
    conversations: string;
    improvements: string;
  };
  finance: {
    income: string;
    savings: string;
    expenseControl: string;
  };
  personal: {
    disciplineScore: string;
    energyLevel: string;
    relationshipHealth: string;
  };
  nextWeekFocus: {
    banking: string;
    consulting: string;
    personal: string;
  };
  createdAt: string;
};

export type QuarterlyReview = {
  id: string;
  quarter: string;
  year: number;
  commissionGrowing: string;
  consultingClients: string;
  runwayImproving: string;
  stillAligned: string;
  mustChange: string;
  createdAt: string;
};

// ============================================================
// STORAGE HELPERS
// ============================================================

function getStore<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function setStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ============================================================
// BANKING ENGINE
// ============================================================

const BANKING_LEADS_KEY = 'ajmal_banking_leads';
const WEEKLY_ACTIVITY_KEY = 'ajmal_weekly_activity';
const PRODUCT_NOTES_KEY = 'ajmal_product_notes';
const MARKET_INTEL_KEY = 'ajmal_market_intel';

export const bankingStore = {
  getLeads: () => getStore<BankingLead[]>(BANKING_LEADS_KEY, []),
  saveLeads: (leads: BankingLead[]) => setStore(BANKING_LEADS_KEY, leads),
  addLead: (lead: BankingLead) => {
    const leads = bankingStore.getLeads();
    bankingStore.saveLeads([...leads, lead]);
  },
  updateLead: (id: string, updates: Partial<BankingLead>) => {
    const leads = bankingStore.getLeads().map(l => l.id === id ? { ...l, ...updates } : l);
    bankingStore.saveLeads(leads);
  },
  deleteLead: (id: string) => {
    bankingStore.saveLeads(bankingStore.getLeads().filter(l => l.id !== id));
  },

  getActivities: () => getStore<WeeklyActivity[]>(WEEKLY_ACTIVITY_KEY, []),
  saveActivities: (activities: WeeklyActivity[]) => setStore(WEEKLY_ACTIVITY_KEY, activities),
  addActivity: (activity: WeeklyActivity) => {
    const activities = bankingStore.getActivities();
    bankingStore.saveActivities([...activities, activity]);
  },
  updateActivity: (id: string, updates: Partial<WeeklyActivity>) => {
    const activities = bankingStore.getActivities().map(a => a.id === id ? { ...a, ...updates } : a);
    bankingStore.saveActivities(activities);
  },
  deleteActivity: (id: string) => {
    bankingStore.saveActivities(bankingStore.getActivities().filter(a => a.id !== id));
  },

  getProductNotes: () => getStore<ProductNote[]>(PRODUCT_NOTES_KEY, defaultProductNotes),
  saveProductNotes: (notes: ProductNote[]) => setStore(PRODUCT_NOTES_KEY, notes),
  addProductNote: (note: ProductNote) => {
    const notes = bankingStore.getProductNotes();
    bankingStore.saveProductNotes([...notes, note]);
  },
  updateProductNote: (id: string, updates: Partial<ProductNote>) => {
    const notes = bankingStore.getProductNotes().map(n => n.id === id ? { ...n, ...updates } : n);
    bankingStore.saveProductNotes(notes);
  },
  deleteProductNote: (id: string) => {
    bankingStore.saveProductNotes(bankingStore.getProductNotes().filter(n => n.id !== id));
  },

  getMarketIntel: () => getStore<MarketIntelLog[]>(MARKET_INTEL_KEY, []),
  saveMarketIntel: (logs: MarketIntelLog[]) => setStore(MARKET_INTEL_KEY, logs),
  addMarketIntel: (log: MarketIntelLog) => {
    const logs = bankingStore.getMarketIntel();
    bankingStore.saveMarketIntel([...logs, log]);
  },
  updateMarketIntel: (id: string, updates: Partial<MarketIntelLog>) => {
    const logs = bankingStore.getMarketIntel().map(l => l.id === id ? { ...l, ...updates } : l);
    bankingStore.saveMarketIntel(logs);
  },
  deleteMarketIntel: (id: string) => {
    bankingStore.saveMarketIntel(bankingStore.getMarketIntel().filter(l => l.id !== id));
  },
};

// ============================================================
// CONSULTING ENGINE
// ============================================================

const CONSULTING_LEADS_KEY = 'ajmal_consulting_leads';
const CONTENT_ITEMS_KEY = 'ajmal_content_items';
const TOOLKIT_ITEMS_KEY = 'ajmal_toolkit_items';

export const consultingStore = {
  getLeads: () => getStore<ConsultingLead[]>(CONSULTING_LEADS_KEY, []),
  saveLeads: (leads: ConsultingLead[]) => setStore(CONSULTING_LEADS_KEY, leads),
  addLead: (lead: ConsultingLead) => {
    const leads = consultingStore.getLeads();
    consultingStore.saveLeads([...leads, lead]);
  },
  updateLead: (id: string, updates: Partial<ConsultingLead>) => {
    const leads = consultingStore.getLeads().map(l => l.id === id ? { ...l, ...updates } : l);
    consultingStore.saveLeads(leads);
  },
  deleteLead: (id: string) => {
    consultingStore.saveLeads(consultingStore.getLeads().filter(l => l.id !== id));
  },

  getContent: () => getStore<ContentItem[]>(CONTENT_ITEMS_KEY, []),
  saveContent: (items: ContentItem[]) => setStore(CONTENT_ITEMS_KEY, items),
  addContent: (item: ContentItem) => {
    const items = consultingStore.getContent();
    consultingStore.saveContent([...items, item]);
  },
  updateContent: (id: string, updates: Partial<ContentItem>) => {
    const items = consultingStore.getContent().map(i => i.id === id ? { ...i, ...updates } : i);
    consultingStore.saveContent(items);
  },
  deleteContent: (id: string) => {
    consultingStore.saveContent(consultingStore.getContent().filter(i => i.id !== id));
  },

  getToolkit: () => getStore<ToolkitItem[]>(TOOLKIT_ITEMS_KEY, defaultToolkitItems),
  saveToolkit: (items: ToolkitItem[]) => setStore(TOOLKIT_ITEMS_KEY, items),
  addToolkitItem: (item: ToolkitItem) => {
    const items = consultingStore.getToolkit();
    consultingStore.saveToolkit([...items, item]);
  },
  updateToolkitItem: (id: string, updates: Partial<ToolkitItem>) => {
    const items = consultingStore.getToolkit().map(i => i.id === id ? { ...i, ...updates } : i);
    consultingStore.saveToolkit(items);
  },
  deleteToolkitItem: (id: string) => {
    consultingStore.saveToolkit(consultingStore.getToolkit().filter(i => i.id !== id));
  },
};

// ============================================================
// STABILITY ENGINE
// ============================================================

const MONTHLY_FINANCE_KEY = 'ajmal_monthly_finance';
const HABIT_ENTRIES_KEY = 'ajmal_habit_entries';
const HABIT_LOG_KEY = 'ajmal_habit_log';
const HABIT_LIST_KEY = 'ajmal_habit_list';
const BURNOUT_ENTRIES_KEY = 'ajmal_burnout_entries';

export const stabilityStore = {
  getFinance: () => getStore<MonthlyFinance[]>(MONTHLY_FINANCE_KEY, []),
  saveFinance: (records: MonthlyFinance[]) => setStore(MONTHLY_FINANCE_KEY, records),
  addFinance: (record: MonthlyFinance) => {
    const records = stabilityStore.getFinance();
    stabilityStore.saveFinance([...records, record]);
  },
  updateFinance: (id: string, updates: Partial<MonthlyFinance>) => {
    const records = stabilityStore.getFinance().map(r => r.id === id ? { ...r, ...updates } : r);
    stabilityStore.saveFinance(records);
  },
  deleteFinance: (id: string) => {
    stabilityStore.saveFinance(stabilityStore.getFinance().filter(r => r.id !== id));
  },

  getHabits: () => getStore<HabitEntry[]>(HABIT_ENTRIES_KEY, []),
  saveHabits: (entries: HabitEntry[]) => setStore(HABIT_ENTRIES_KEY, entries),
  addHabit: (entry: HabitEntry) => {
    const entries = stabilityStore.getHabits();
    stabilityStore.saveHabits([...entries, entry]);
  },
  updateHabit: (id: string, updates: Partial<HabitEntry>) => {
    const entries = stabilityStore.getHabits().map(e => e.id === id ? { ...e, ...updates } : e);
    stabilityStore.saveHabits(entries);
  },
  deleteHabit: (id: string) => {
    stabilityStore.saveHabits(stabilityStore.getHabits().filter(e => e.id !== id));
  },

  getHabitLogs: () => getStore<HabitLog[]>(HABIT_LOG_KEY, []),
  saveHabitLogs: (logs: HabitLog[]) => setStore(HABIT_LOG_KEY, logs),
  addHabitLog: (log: HabitLog) => {
    const logs = stabilityStore.getHabitLogs();
    stabilityStore.saveHabitLogs([...logs, log]);
  },
  updateHabitLog: (id: string, updates: Partial<HabitLog>) => {
    const logs = stabilityStore.getHabitLogs().map(l => l.id === id ? { ...l, ...updates } : l);
    stabilityStore.saveHabitLogs(logs);
  },
  deleteHabitLog: (id: string) => {
    stabilityStore.saveHabitLogs(stabilityStore.getHabitLogs().filter(l => l.id !== id));
  },

  getHabitList: () => getStore<string[]>(HABIT_LIST_KEY, []),
  saveHabitList: (list: string[]) => setStore(HABIT_LIST_KEY, list),

  getBurnout: () => getStore<BurnoutEntry[]>(BURNOUT_ENTRIES_KEY, []),
  saveBurnout: (entries: BurnoutEntry[]) => setStore(BURNOUT_ENTRIES_KEY, entries),
  addBurnout: (entry: BurnoutEntry) => {
    const entries = stabilityStore.getBurnout();
    stabilityStore.saveBurnout([...entries, entry]);
  },
  updateBurnout: (id: string, updates: Partial<BurnoutEntry>) => {
    const entries = stabilityStore.getBurnout().map(e => e.id === id ? { ...e, ...updates } : e);
    stabilityStore.saveBurnout(entries);
  },
  deleteBurnout: (id: string) => {
    stabilityStore.saveBurnout(stabilityStore.getBurnout().filter(e => e.id !== id));
  },
};

// ============================================================
// CONTROL SYSTEM
// ============================================================

const WEEKLY_REVIEWS_KEY = 'ajmal_weekly_reviews';
const QUARTERLY_REVIEWS_KEY = 'ajmal_quarterly_reviews';

export const controlStore = {
  getWeeklyReviews: () => getStore<WeeklyReview[]>(WEEKLY_REVIEWS_KEY, []),
  saveWeeklyReviews: (reviews: WeeklyReview[]) => setStore(WEEKLY_REVIEWS_KEY, reviews),
  addWeeklyReview: (review: WeeklyReview) => {
    const reviews = controlStore.getWeeklyReviews();
    controlStore.saveWeeklyReviews([...reviews, review]);
  },
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => {
    const reviews = controlStore.getWeeklyReviews().map(r => r.id === id ? { ...r, ...updates } : r);
    controlStore.saveWeeklyReviews(reviews);
  },
  deleteWeeklyReview: (id: string) => {
    controlStore.saveWeeklyReviews(controlStore.getWeeklyReviews().filter(r => r.id !== id));
  },

  getQuarterlyReviews: () => getStore<QuarterlyReview[]>(QUARTERLY_REVIEWS_KEY, []),
  saveQuarterlyReviews: (reviews: QuarterlyReview[]) => setStore(QUARTERLY_REVIEWS_KEY, reviews),
  addQuarterlyReview: (review: QuarterlyReview) => {
    const reviews = controlStore.getQuarterlyReviews();
    controlStore.saveQuarterlyReviews([...reviews, review]);
  },
  updateQuarterlyReview: (id: string, updates: Partial<QuarterlyReview>) => {
    const reviews = controlStore.getQuarterlyReviews().map(r => r.id === id ? { ...r, ...updates } : r);
    controlStore.saveQuarterlyReviews(reviews);
  },
  deleteQuarterlyReview: (id: string) => {
    controlStore.saveQuarterlyReviews(controlStore.getQuarterlyReviews().filter(r => r.id !== id));
  },
};

// ============================================================
// DEFAULT DATA
// ============================================================

const defaultProductNotes: ProductNote[] = [
  {
    id: 'pn1',
    product: 'Personal Loan',
    category: 'Eligibility',
    content: `• Minimum salary: AED 5,000/month\n• Employment: Minimum 6 months with current employer\n• Age: 21–65 years\n• Valid UAE residence visa\n• Active UAE bank account`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pn2',
    product: 'Credit Card',
    category: 'Eligibility',
    content: `• Minimum salary: AED 5,000/month\n• Employment: Minimum 3 months with current employer\n• Age: 21–65 years\n• Valid UAE residence visa\n• Clean credit history`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pn3',
    product: 'Personal Loan',
    category: 'Objection Handling',
    content: `"I already have a loan elsewhere"\n→ "We can consolidate and reduce your monthly payment."\n\n"The interest is too high"\n→ "Let me show you the total cost comparison — our flat rate is competitive."\n\n"I need to think about it"\n→ "What specific concern can I address right now to help you decide?"`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pn4',
    product: 'General',
    category: 'Compliance',
    content: `• Never promise guaranteed approval\n• Always disclose all fees upfront\n• Do not process applications without complete documentation\n• Maintain client confidentiality at all times\n• Follow CBUAE guidelines on responsible lending`,
    updatedAt: new Date().toISOString(),
  },
];

const defaultToolkitItems: ToolkitItem[] = [
  {
    id: 'tk1',
    name: 'Business Discovery Questions',
    category: 'Discovery Questions',
    description: 'Standard discovery questions for first client meeting',
    content: `1. How long have you been in business?\n2. How many employees do you have?\n3. What does your current revenue look like?\n4. What is your biggest operational challenge right now?\n5. Do you have documented processes (SOPs)?\n6. How do you currently track performance (KPIs)?\n7. What does your cash flow cycle look like?\n8. Where do you see the business in 2 years?\n9. What has prevented you from solving this problem before?\n10. What would success look like for you in 6 months?`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tk2',
    name: 'Business Audit Checklist',
    category: 'Audit Checklist',
    description: 'Initial business health audit framework',
    content: `OPERATIONS\n□ Are core processes documented?\n□ Is there a clear org chart?\n□ Are roles and responsibilities defined?\n□ Is there a quality control process?\n\nFINANCE\n□ Are monthly P&L statements prepared?\n□ Is cash flow tracked weekly?\n□ Are expenses categorized?\n□ Is there a budget vs actual review?\n\nSALES & MARKETING\n□ Is there a defined sales process?\n□ Is there a CRM in use?\n□ Are leads tracked and followed up?\n□ Is there a content/marketing strategy?\n\nTEAM\n□ Are KPIs set for each role?\n□ Is there a performance review process?\n□ Is onboarding documented?\n□ Is training provided regularly?`,
    updatedAt: new Date().toISOString(),
  },
];

// ============================================================
// UTILITY
// ============================================================

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-AE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const BANKING_STAGES = [
  'Lead', 'Contacted', 'Interested', 'Docs Pending', 'Submitted', 'Approved', 'Commission Received'
] as const;

export const CONSULTING_STAGES = [
  'New', 'Contacted', 'Session Done', 'Proposal Sent', 'Negotiating', 'Active Client', 'Closed'
] as const;
