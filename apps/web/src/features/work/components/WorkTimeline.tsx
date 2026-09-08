import { formatDistanceToNow } from 'date-fns';
import { Plus, ArrowRight, Repeat, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import type { TimelineEvent } from '../types/work.types';

export function WorkTimeline({ events }: { events: TimelineEvent[] }) {
  if (!events || events.length === 0) return <div className="text-gray-500 text-sm py-4">No events recorded.</div>;
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'created': return <Plus className="w-4 h-4 text-blue-500" />;
      case 'assignment': return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'handoff': return <Repeat className="w-4 h-4 text-purple-500" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-gray-500" />;
      case 'status_change': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'due_date_change': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Plus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4 py-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {events.map((ev) => (
        <div key={ev.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {getIcon(ev.type)}
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow-sm bg-white">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-900 text-sm">{ev.actor || 'System'}</div>
              <time className="text-xs text-slate-500">{formatDistanceToNow(new Date(ev.createdAt), {addSuffix: true})}</time>
            </div>
            <div className="text-slate-500 text-sm">{ev.summary}</div>
            {ev.detail && <div className="text-slate-400 text-xs mt-2 p-2 bg-slate-50 rounded">{ev.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}