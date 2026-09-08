import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, AlertTriangle, Clock, Hourglass, CheckCircle2 } from "lucide-react";
import type { QueueView, QueueCounts } from "../types/work.types";
import { Badge } from "@/components/ui/badge";

interface Props {
  activeView: QueueView;
  onViewChange: (v: QueueView) => void;
  counts?: QueueCounts;
}

export function WorkQueueTabs({ activeView, onViewChange, counts }: Props) {
  return (
    <Tabs value={activeView} onValueChange={(v) => onViewChange(v as QueueView)} className="w-full">
      <TabsList className="flex flex-wrap h-auto gap-2 p-2">
        <TabsTrigger value="my" className="flex items-center gap-2">
          <User className="w-4 h-4" /> My Work {counts && <Badge variant="secondary">{counts.myWork}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="team" className="flex items-center gap-2">
          <Users className="w-4 h-4" /> Team {counts && <Badge variant="secondary">{counts.team}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="urgent" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" /> Urgent {counts && <Badge variant="secondary">{counts.urgent}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="overdue" className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500" /> Overdue {counts && <Badge variant="secondary">{counts.overdue}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="waiting" className="flex items-center gap-2">
          <Hourglass className="w-4 h-4" /> Waiting {counts && <Badge variant="secondary">{counts.waiting}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" /> Completed {counts && <Badge variant="secondary">{counts.completed}</Badge>}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}