export const workKeys = {
  all: ['work'] as const,
  queue: (view: string, filters?: Record<string, unknown>) => ['work', 'queue', view, filters] as const,
  item: (id: string) => ['work', 'item', id] as const,
  timeline: (id: string) => ['work', 'timeline', id] as const,
  comments: (id: string) => ['work', 'comments', id] as const,
  history: (id: string) => ['work', 'history', id] as const,
};