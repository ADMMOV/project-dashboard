export interface FiveDaysTask {
  id: string;
  name: string;
  status: 'done' | 'in-progress' | 'blocked' | 'not-started' | 'planned';
  assignee: string;
  notes: string;
  estimatedTime?: string;
  dueDate?: string;
  progress?: number;
  isBlocker: boolean;
  blockerReason?: string;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  source: 'sprint-planning' | 'daily-scrum' | 'weekly-email';
  mondayItemId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIUpdate {
  id: string;
  source: 'daily-scrum' | 'weekly-email' | 'sprint-planning';
  sourceDate: string;
  sourceFileName?: string;
  taskName: string;
  proposedStatus: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  proposedAssignee: string;
  aiNotes: string;
  pmNotes: string;
  isNewTask: boolean;
  linkedMondayItemId?: string;
  isBlocker: boolean;
  blockerReason?: string;
  isApproved: boolean;
  isRejected: boolean;
  createdAt: string;
  processedAt?: string;
}

export interface AIProcessingState {
  isProcessing: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface MondayItem {
  id: string;
  name: string;
  status: string;
  assignee: string;
  dueDate?: string;
}

export interface FiveDaysProject {
  id: string;
  name: string;
  clientName: string;
  startDate: string;
  endDate: string;
  currentWeek: string;
}

export interface FiveDaysStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  plannedTasks: number;
  daysRemaining: number;
}

export interface FileUpload {
  file: File;
  type: 'audio' | 'email';
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
}

export type UserRole = 'pm' | 'client';
export type DashboardView = 'ai-updates' | 'pending-review' | 'five-days'; 