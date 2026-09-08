import { useQuery } from '@tanstack/react-query';
import { workKeys } from '../api/work-query-keys';
import { fetchWorkItem, fetchTimeline, fetchComments } from '../api/work-api';

export function useWorkItem(id: string | null) {
  return useQuery({
    queryKey: workKeys.item(id!),
    queryFn: () => fetchWorkItem(id!),
    enabled: !!id,
  });
}

export function useWorkTimeline(id: string | null) {
  return useQuery({
    queryKey: workKeys.timeline(id!),
    queryFn: () => fetchTimeline(id!),
    enabled: !!id,
  });
}

export function useWorkComments(id: string | null) {
  return useQuery({
    queryKey: workKeys.comments(id!),
    queryFn: () => fetchComments(id!),
    enabled: !!id,
  });
}