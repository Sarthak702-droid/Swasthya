import { Button } from "@/components/ui/button";
import { Play, CheckCircle, RotateCcw, UserPlus, UserCog, ArrowRightLeft } from "lucide-react";
import type { WorkItem, TransitionAction } from "../types/work.types";

interface Props {
  item: WorkItem;
  onAction: (action: TransitionAction) => void;
  isPending?: boolean;
}

export function WorkItemActions({ item, onAction, isPending }: Props) {
  const allowed = item.allowedActions || [];
  if (allowed.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-4 border-b">
      {allowed.includes('accept') && (
        <Button size="sm" onClick={() => onAction('accept')} disabled={isPending} className="bg-green-600 hover:bg-green-700">
          <Play className="w-4 h-4 mr-2" /> Accept
        </Button>
      )}
      {allowed.includes('complete') && (
        <Button size="sm" onClick={() => onAction('complete')} disabled={isPending} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" /> Complete
        </Button>
      )}
      {allowed.includes('assign') && (
        <Button size="sm" onClick={() => onAction('assign')} disabled={isPending} variant="outline">
          <UserPlus className="w-4 h-4 mr-2" /> Assign
        </Button>
      )}
      {allowed.includes('reassign') && (
        <Button size="sm" onClick={() => onAction('reassign')} disabled={isPending} variant="outline">
          <UserCog className="w-4 h-4 mr-2" /> Reassign
        </Button>
      )}
      {allowed.includes('handoff') && (
        <Button size="sm" onClick={() => onAction('handoff')} disabled={isPending} className="bg-purple-600 hover:bg-purple-700 text-white">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Handoff
        </Button>
      )}
      {allowed.includes('return') && (
        <Button size="sm" onClick={() => onAction('return')} disabled={isPending} className="bg-orange-600 hover:bg-orange-700 text-white">
          <RotateCcw className="w-4 h-4 mr-2" /> Return
        </Button>
      )}
    </div>
  );
}