import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkItem, useWorkTimeline, useWorkComments } from '../hooks/useWorkItem';
import { useAcceptWorkItem, useAssignWorkItem, useCompleteWorkItem, useHandoffWorkItem, useReassignWorkItem, useReturnWorkItem } from '../hooks/useWorkMutations';
import { WorkItemHeader } from './WorkItemHeader';
import { WorkItemActions } from './WorkItemActions';
import { WorkTimeline } from './WorkTimeline';
import { WorkComments } from './WorkComments';
import { AssignDialog } from './AssignDialog';
import { ReassignDialog } from './ReassignDialog';
import { HandoffDialog } from './HandoffDialog';
import { ReturnDialog } from './ReturnDialog';
import { CompleteDialog } from './CompleteDialog';
import type { TransitionAction } from '../types/work.types';

export function WorkItemPanel({ itemId, isOpen, onClose }: { itemId: string | null; isOpen: boolean; onClose: () => void; }) {
  const { data: itemData, isLoading } = useWorkItem(itemId);
  const { data: timelineData } = useWorkTimeline(itemId);
  const { data: commentsData } = useWorkComments(itemId);
  const [activeDialog, setActiveDialog] = useState<TransitionAction | null>(null);

  const accept = useAcceptWorkItem();
  const assign = useAssignWorkItem();
  const reassign = useReassignWorkItem();
  const complete = useCompleteWorkItem();
  const returnItem = useReturnWorkItem();
  const handoff = useHandoffWorkItem();

  const handleAction = (action: TransitionAction) => {
    if (action === 'accept') {
      accept.mutate({ id: itemId!, version: itemData?.data.version || 1 });
    } else {
      setActiveDialog(action);
    }
  };

  const closeDialogs = () => setActiveDialog(null);
  
  const withVersion = (data: any) => ({ ...data, version: itemData?.data.version || 1 });

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col h-full bg-white">
          {isLoading || !itemData?.data ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : (
            <>
              <div className="p-6 pb-0 shrink-0">
                <WorkItemHeader item={itemData.data} />
                {itemData.data.description && <div className="py-4 text-sm text-gray-700 border-b">{itemData.data.description}</div>}
                <WorkItemActions item={itemData.data} onAction={handleAction} isPending={accept.isPending} />
              </div>
              <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs defaultValue="timeline" className="flex-1 flex flex-col w-full">
                  <div className="px-6 border-b">
                    <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-6">
                      <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2 pt-2 px-0">Timeline</TabsTrigger>
                      <TabsTrigger value="comments" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none pb-2 pt-2 px-0">Comments</TabsTrigger>
                    </TabsList>
                  </div>
                  <ScrollArea className="flex-1 p-6">
                    <TabsContent value="timeline" className="m-0"><WorkTimeline events={timelineData?.data || []} /></TabsContent>
                    <TabsContent value="comments" className="m-0"><WorkComments itemId={itemId!} comments={commentsData?.data || []} /></TabsContent>
                  </ScrollArea>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AssignDialog isOpen={activeDialog === 'assign'} onClose={closeDialogs} isPending={assign.isPending} onSubmit={(d) => assign.mutate({ id: itemId!, ...withVersion(d) }, { onSuccess: closeDialogs })} />
      <ReassignDialog isOpen={activeDialog === 'reassign'} onClose={closeDialogs} isPending={reassign.isPending} onSubmit={(d) => reassign.mutate({ id: itemId!, ...withVersion(d) }, { onSuccess: closeDialogs })} />
      <HandoffDialog isOpen={activeDialog === 'handoff'} onClose={closeDialogs} isPending={handoff.isPending} onSubmit={(d) => handoff.mutate({ id: itemId!, ...withVersion(d) }, { onSuccess: closeDialogs })} />
      <ReturnDialog isOpen={activeDialog === 'return'} onClose={closeDialogs} isPending={returnItem.isPending} onSubmit={(d) => returnItem.mutate({ id: itemId!, ...withVersion(d) }, { onSuccess: closeDialogs })} />
      <CompleteDialog isOpen={activeDialog === 'complete'} onClose={closeDialogs} isPending={complete.isPending} onSubmit={(d) => complete.mutate({ id: itemId!, ...withVersion(d) }, { onSuccess: closeDialogs })} />
    </>
  );
}