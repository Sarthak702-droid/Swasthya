import { apiFetch } from '@/lib/api-client';
import type { 
  WorkItem, WorkQueueResponse, TimelineEvent, WorkComment, 
  AssignRequest, AcceptRequest, ReassignRequest, CompleteRequest, 
  ReturnRequest, HandoffRequest, AddCommentRequest 
} from '../types/work.types';

export async function fetchWorkQueue(view: string, params?: Record<string, string>): Promise<WorkQueueResponse> {
  const query = new URLSearchParams({ view, ...params });
  return apiFetch(`/work/queue?${query}`);
}

export async function fetchWorkItem(id: string): Promise<{ data: WorkItem }> {
  return apiFetch(`/work/items/${id}`);
}

export async function fetchTimeline(id: string): Promise<{ data: TimelineEvent[] }> {
  return apiFetch(`/work/items/${id}/timeline`);
}

export async function fetchComments(id: string): Promise<{ data: WorkComment[] }> {
  return apiFetch(`/work/items/${id}/comments`);
}

export async function assignWorkItem(id: string, body: AssignRequest) {
  return apiFetch(`/work/items/${id}/transitions/assign`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function acceptWorkItem(id: string, body: AcceptRequest) {
  return apiFetch(`/work/items/${id}/transitions/accept`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function reassignWorkItem(id: string, body: ReassignRequest) {
  return apiFetch(`/work/items/${id}/transitions/reassign`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function completeWorkItem(id: string, body: CompleteRequest) {
  return apiFetch(`/work/items/${id}/transitions/complete`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function returnWorkItem(id: string, body: ReturnRequest) {
  return apiFetch(`/work/items/${id}/transitions/return`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function handoffWorkItem(id: string, body: HandoffRequest) {
  return apiFetch(`/work/items/${id}/transitions/handoff`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}

export async function addComment(id: string, body: AddCommentRequest) {
  return apiFetch(`/work/items/${id}/comments`, {
    method: 'POST', body: JSON.stringify(body), idempotencyKey: crypto.randomUUID(),
  });
}