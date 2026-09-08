import { formatDistanceToNow } from 'date-fns';
import { WorkPriorityBadge } from './WorkPriorityBadge';
import { WorkStatusBadge } from './WorkStatusBadge';
import type { WorkItem } from '../types/work.types';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Props {
  items: WorkItem[];
  isLoading: boolean;
  onSelectItem: (id: string) => void;
}

export const getWorkItemEpic = (type: string): { name: string; member: string; color: string } => {
  switch (type) {
    case 'STOCK_SHORTAGE_REVIEW':
      return { name: 'Epic 3: Shortage Reviews', member: 'Riya', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'TRANSFER_RECOMMENDATION_APPROVAL':
      return { name: 'Epic 2: Transfer Approvals', member: 'Vaishnavi', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'TRANSFER_DISPATCH':
      return { name: 'Epic 4: Dispatch Operations', member: 'Shneanjali', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case 'TRANSFER_RECEIPT':
      return { name: 'Epic 3: Supply Receipt', member: 'Riya', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'CAPACITY_OVERLOAD':
      return { name: 'Epic 1: Emergency Response', member: 'Sarthak', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'EXPIRY_RISK':
      return { name: 'Epic 3: Expiry Risk Control', member: 'Riya', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'INVENTORY_DISCREPANCY':
      return { name: 'Epic 2: Inventory Auditing', member: 'Vaishnavi', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'DATA_QUALITY_ISSUE':
      return { name: 'Epic 5: Data Integration', member: 'Sarthak', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    default:
      return { name: 'Epic 1: Platform Core', member: 'Sarthak', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

const getMemberBadgeColor = (name?: string | null) => {
  if (!name) return 'bg-gray-100 text-gray-600 border-gray-300';
  if (name.includes('Sarthak')) return 'bg-rose-100 text-rose-800 border-rose-300';
  if (name.includes('Vaishnavi')) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (name.includes('Riya')) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (name.includes('Shneanjali')) return 'bg-purple-100 text-purple-800 border-purple-300';
  return 'bg-gray-100 text-gray-800 border-gray-300';
};

export function WorkQueueTable({ items, isLoading, onSelectItem }: Props) {
  if (isLoading) {
    return <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>;
  }
  
  if (!items.length) {
    return (
      <div className="p-12 text-center bg-white rounded-lg border border-dashed text-gray-500">
        <p className="text-base font-medium text-gray-700">No work items matching current filters.</p>
        <p className="text-sm text-gray-400 mt-1">Try resetting the member or epic filters above.</p>
      </div>
    );
  }

  const formatType = (t: string) => t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="border rounded-lg overflow-x-auto bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
          <tr>
            <th className="px-4 py-3.5">Priority</th>
            <th className="px-4 py-3.5">Title</th>
            <th className="px-4 py-3.5">Epic</th>
            <th className="px-4 py-3.5">Type</th>
            <th className="px-4 py-3.5">Assigned Member</th>
            <th className="px-4 py-3.5">Facility</th>
            <th className="px-4 py-3.5">Status</th>
            <th className="px-4 py-3.5">Due / SLA</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => {
            const epic = getWorkItemEpic(item.type);
            const memberName = item.assignedUserName || (item.assignedUserId ? 'Assigned' : 'Unassigned');

            return (
              <tr 
                key={item.id} 
                onClick={() => onSelectItem(item.id)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3.5"><WorkPriorityBadge priority={item.priority} /></td>
                <td className="px-4 py-3.5">
                  <div className="font-medium text-slate-900">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.description}</div>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${epic.color}`}>
                    {epic.name}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">{formatType(item.type)}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getMemberBadgeColor(item.assignedUserName)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {memberName}
                  </span>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">{item.facilityName || 'District Pool'}</td>
                <td className="px-4 py-3.5 whitespace-nowrap"><WorkStatusBadge status={item.status} /></td>
                <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                  {item.dueAt ? (
                    <span className={new Date(item.dueAt) < new Date() ? 'text-red-600 font-semibold' : ''}>
                      {formatDistanceToNow(new Date(item.dueAt), { addSuffix: true })}
                    </span>
                  ) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}