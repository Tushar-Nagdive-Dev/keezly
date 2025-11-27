export interface HealthCounts {
  weak: number;
  reused: number;
  compromised: number;
  old: number;
  total: number;
}

export interface AlertItem {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  createdAt: string; // ISO
  acknowledged: boolean;
}

export interface TrendPoint {
  date: string; // ISO date (YYYY-MM-DD)
  score: number;
  compromised_count: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  detail: string;
  time: string; // ISO
}

export interface SessionItem {
  id: string;
  device: string;
  ip: string;
  lastSeen: string; // ISO
}

export interface DashboardSummary {
  securityScore: number;
  health: HealthCounts;
  lastBackup: string; // ISO
  pendingAlerts: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  alerts: AlertItem[];
  trends: TrendPoint[];
  recentActivity: RecentActivity[];
  sessions: SessionItem[];
}
