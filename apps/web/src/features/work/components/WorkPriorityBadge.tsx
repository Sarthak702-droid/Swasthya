import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from "lucide-react";
import type { Priority } from "../types/work.types";

export function WorkPriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive" className="animate-pulse"><AlertTriangle className="w-3 h-3 mr-1" /> Critical</Badge>;
    case 'urgent':
      return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertTriangle className="w-3 h-3 mr-1" /> Urgent</Badge>;
    case 'high':
      return <Badge className="bg-amber-500 hover:bg-amber-600"><ArrowUp className="w-3 h-3 mr-1" /> High</Badge>;
    case 'normal':
      return <Badge className="bg-blue-500 hover:bg-blue-600"><Minus className="w-3 h-3 mr-1" /> Normal</Badge>;
    case 'low':
      return <Badge className="bg-gray-500 hover:bg-gray-600"><ArrowDown className="w-3 h-3 mr-1" /> Low</Badge>;
    default:
      return null;
  }
}