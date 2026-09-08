import { Badge } from "@/components/ui/badge";
import { Clock, UserCheck, Play, CheckCircle, RotateCcw } from "lucide-react";
import type { Status } from "../types/work.types";

export function WorkStatusBadge({ status }: { status: Status }) {
  switch (status) {
    case 'waiting':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Waiting</Badge>;
    case 'assigned':
      return <Badge className="bg-blue-500 hover:bg-blue-600"><UserCheck className="w-3 h-3 mr-1" /> Assigned</Badge>;
    case 'in_progress':
      return <Badge className="bg-indigo-500 hover:bg-indigo-600"><Play className="w-3 h-3 mr-1" /> In Progress</Badge>;
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
    case 'returned':
      return <Badge className="bg-orange-500 hover:bg-orange-600"><RotateCcw className="w-3 h-3 mr-1" /> Returned</Badge>;
    default:
      return null;
  }
}