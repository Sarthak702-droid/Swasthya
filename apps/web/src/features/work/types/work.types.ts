export type WorkItemType = 
  | 'STOCK_SHORTAGE_REVIEW'
  | 'TRANSFER_RECOMMENDATION_APPROVAL'
  | 'TRANSFER_DISPATCH'
  | 'TRANSFER_RECEIPT'
  | 'INVENTORY_DISCREPANCY'
  | 'EXPIRY_RISK'
  | 'CAPACITY_OVERLOAD'
  | 'FORECAST_ANOMALY_REVIEW'
  | 'DATA_QUALITY_ISSUE'
  | 'CRITICAL_ALERT_ACKNOWLEDGEMENT';

export type Priority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';
export type Status = 'waiting' | 'assigned' | 'in_progress' | 'completed' | 'returned';
export type TransitionAction = 'assign' | 'accept' | 'reassign' | 'complete' | 'return' | 'handoff';

export interface LinkedEntity {
  kind: string;
  id: string;
  label: string;
  href: string;
}

export interface WorkItem {
  id: string;
  type: WorkItemType;
  priority: Priority;
  title: string;
  description?: string;
  status: Status;
  currentTeamId?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  facilityId?: string;
  facilityName?: string;
  district?: string;
  source: string;
  entity?: LinkedEntity;
  parentWorkItemId?: string;
  dueAt?: string;
  createdBySystem: boolean;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  returnedAt?: string;
  allowedActions: TransitionAction[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueueCounts {
  myWork: number;
  team: number;
  urgent: number;
  overdue: number;
  waiting: number;
  completed: number;
}

export interface PaginationMeta {
  nextCursor?: string;
  hasMore: boolean;
}

export interface WorkQueueResponse {
  data: WorkItem[];
  meta: PaginationMeta;
  counts?: QueueCounts;
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'assignment' | 'handoff' | 'comment' | 'due_date_change' | 'created';
  actor?: string;
  summary: string;
  detail?: string;
  createdAt: string;
}

export interface WorkComment {
  id: string;
  authorUserId: string;
  authorName: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export type QueueView = 'my' | 'team' | 'urgent' | 'overdue' | 'waiting' | 'completed';

export interface AssignRequest { toUserId?: string; toTeamId?: string; reason?: string; version: number; }
export interface AcceptRequest { version: number; }
export interface ReassignRequest { toUserId?: string; reason?: string; version: number; }
export interface CompleteRequest { reason?: string; version: number; }
export interface ReturnRequest { reason?: string; version: number; }
export interface HandoffRequest { toTeamId: string; toUserId?: string; reason: string; version: number; }
export interface AddCommentRequest { body: string; }