import { DashboardData } from "../models/dashboard.models";

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const DUMMY_DASHBOARD: DashboardData = {
  summary: {
    securityScore: 71,
    health: { weak: 6, reused: 12, compromised: 1, old: 8, total: 250 },
    lastBackup: new Date().toISOString(),
    pendingAlerts: 3,
  },
  alerts: [
    { id: 'a1', type: 'breach', severity: 'critical', summary: 'Password for example-bank.com found in breach', createdAt: isoDaysAgo(0), acknowledged: false },
    { id: 'a2', type: 'reuse', severity: 'medium', summary: '3 accounts using same password', createdAt: isoDaysAgo(1), acknowledged: false },
    { id: 'a3', type: 'weak', severity: 'low', summary: 'Weak password detected for example-forum', createdAt: isoDaysAgo(2), acknowledged: true }
  ],
  trends: Array.from({length: 14}).map((_,i)=>{
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    return {
      date: date.toISOString().slice(0,10),
      score: 60 + Math.round(Math.sin(i/3) * 8),
      compromised_count: Math.max(0, Math.round(Math.random()*2))
    };
  }),
  recentActivity: [
    { id: 'r1', action: 'Login', detail: 'Unlocked vault on macbook-pro', time: isoDaysAgo(0) },
    { id: 'r2', action: 'Change', detail: 'Rotated password for example-bank.com', time: isoDaysAgo(1) },
    { id: 'r3', action: 'Share', detail: 'Shared "work-email" with alice@company.com', time: isoDaysAgo(2) }
  ],
  sessions: [
    { id: 's1', device: 'macbook-pro', ip: '10.0.0.12', lastSeen: isoDaysAgo(0) },
    { id: 's2', device: 'iPhone 13', ip: '10.0.0.45', lastSeen: isoDaysAgo(1) }
  ]
};
