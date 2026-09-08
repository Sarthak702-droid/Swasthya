import { useQuery } from '@tanstack/react-query';
import { workKeys } from '../api/work-query-keys';
import { fetchWorkQueue } from '../api/work-api';
import type { QueueView } from '../types/work.types';

export function useWorkQueue(view: QueueView, filters?: Record<string, string>) {
  return useQuery({
    queryKey: workKeys.queue(view, filters),
    queryFn: () => fetchWorkQueue(view, filters),
  });
}