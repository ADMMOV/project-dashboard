export interface AIUpdate {
  id: string;
  source: 'daily-scrum' | 'weekly-email';
  sourceDate: string;
  sourceFileName?: string;
  taskName: string;
  proposedStatus: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  proposedAssignee: string;
  aiNotes: string;
  isNewTask: boolean;
  linkedTaskId?: string;
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

export interface AIUpdatesState {
  pendingUpdates: AIUpdate[];
  processingState: AIProcessingState;
  selectedUpdates: string[];
}

export interface FileUpload {
  file: File;
  type: 'audio' | 'email';
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  errorMessage?: string;
} 