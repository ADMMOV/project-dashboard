export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'developer' | 'client';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  lastUpdated: string;
  budget: {
    allocated: number;
    used: number;
    currency: string;
  };
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: User;
  dueDate: string;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[];
  blockers: Blocker[];
  updates: TaskUpdate[];
}

export interface Blocker {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  assignedTo?: User;
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  author: User;
  content: string;
  timestamp: string;
  type: 'comment' | 'status-change' | 'blocker' | 'progress';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  tasks: Task[];
  progress: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  daysRemaining: number;
  budgetUsed: number;
  teamVelocity: number;
} 