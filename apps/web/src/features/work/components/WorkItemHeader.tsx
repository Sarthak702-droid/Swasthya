import { WorkPriorityBadge } from './WorkPriorityBadge';
import { WorkStatusBadge } from './WorkStatusBadge';
import type { WorkItem } from '../types/work.types';
import { formatDistanceToNow } from 'date-fns';

export function WorkItemHeader({ item }: { item: WorkItem }) {
  const formatType = (t: string) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  return (
    <div className="space-y-4 border-b pb-4">
      <div className="flex justify-between items-start gap-4">
        <h2 className="text-xl font-bold">{item.title}</h2>
        <div className="flex gap-2 shrink-0">
          <WorkPriorityBadge priority={item.priority} />
          <WorkStatusBadge status={item.status} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-gray-500">Type</div><div>{formatType(item.type)}</div>
        <div className="text-gray-500">Facility</div><div>{item.facilityName || '-'} {item.district ? `(${item.district})` : ''}</div>
        <div className="text-gray-500">Assigned To</div><div>{item.assignedUserName || item.assignedUserId || '-'}</div>
        <div className="text-gray-500">Due</div>
        <div className={item.dueAt && new Date(item.dueAt) < new Date() ? 'text-red-500' : ''}>
          {item.dueAt ? formatDistanceToNow(new Date(item.dueAt), { addSuffix: true }) : '-'}
        </div>
        {item.entity && (
          <>
            <div className="text-gray-500">Related</div>
            <div><a href={item.entity.href} className="text-blue-600 hover:underline">{item.entity.label}</a></div>
          </>
        )}
      </div>
    </div>
  );
}