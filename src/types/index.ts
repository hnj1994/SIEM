export interface WazuhAlert {
  id: string;
  timestamp: string;
  rule: {
    id: string;
    level: number;
    description: string;
    groups: string[];
    mitre?: {
      id: string[];
      tactic: string[];
      technique: string[];
    };
  };
  agent: {
    id: string;
    name: string;
    ip: string;
  };
  manager: {
    name: string;
  };
  data?: Record<string, unknown>;
  full_log?: string;
  location?: string;
  decoder?: {
    name: string;
  };
  syscheck?: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  ip: string;
  os: {
    name: string;
    version: string;
    platform: string;
  };
  status: 'active' | 'disconnected' | 'pending' | 'never_connected';
  version: string;
  lastKeepAlive: string;
  registerIP: string;
  group: string[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  alerts: string[];
  mitreTactics: string[];
  aiSummary?: string;
  timeline: IncidentEvent[];
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  type: 'alert' | 'action' | 'note' | 'escalation';
  description: string;
  actor?: string;
}

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  count: number;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
}

export interface MitreTactic {
  id: string;
  name: string;
  techniques: MitreTechnique[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  loading?: boolean;
  context?: WazuhAlert;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  tenant: string;
  avatar?: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalAlerts: number;
  criticalAlerts: number;
  highAlerts: number;
  activeAgents: number;
  totalAgents: number;
  failedLogins: number;
  malwareDetections: number;
  openIncidents: number;
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export function getRuleLevel(level: number): SeverityLevel {
  if (level >= 13) return 'critical';
  if (level >= 10) return 'high';
  if (level >= 7) return 'medium';
  if (level >= 4) return 'low';
  return 'info';
}

export function getSeverityColor(severity: SeverityLevel): string {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
    info: '#3b82f6',
  };
  return colors[severity];
}
