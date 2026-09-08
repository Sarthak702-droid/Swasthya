import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/work-api';
import { workKeys } from '../api/work-query-keys';
import type {
  AssignRequest,
  AcceptRequest,
  ReassignRequest,
  CompleteRequest,
  ReturnRequest,
  HandoffRequest,
  AddCommentRequest,
} from '../types/work.types';

export function useAssignWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & AssignRequest) => api.assignWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useAcceptWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & AcceptRequest) => api.acceptWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useReassignWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & ReassignRequest) => api.reassignWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useCompleteWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & CompleteRequest) => api.completeWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useReturnWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & ReturnRequest) => api.returnWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useHandoffWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & HandoffRequest) => api.handoffWorkItem(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: workKeys.all }),
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & AddCommentRequest) => api.addComment(id, body),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: workKeys.comments(variables.id) });
      qc.invalidateQueries({ queryKey: workKeys.timeline(variables.id) });
    },
  });
}