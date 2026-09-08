import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignSchema } from '../schemas/work.schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props {
  isOpen: boolean; onClose: () => void;
  onSubmit: (data: any) => void; isPending: boolean;
}

export function AssignDialog({ isOpen, onClose, onSubmit, isPending }: Props) {
  const form = useForm({ resolver: zodResolver(assignSchema), defaultValues: { toUserId: '', toTeamId: '', reason: '' } });
  
  const handleOpenChange = (open: boolean) => {
    if (!open) { form.reset(); onClose(); }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Assign Work Item</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label>User ID</Label><Input {...form.register('toUserId')} placeholder="UUID" /></div>
          <div className="space-y-2"><Label>Team ID</Label><Input {...form.register('toTeamId')} placeholder="UUID" /></div>
          <div className="space-y-2"><Label>Reason (Optional)</Label><Textarea {...form.register('reason')} /></div>
          {(form.formState.errors.toUserId || form.formState.errors.root) && <p className="text-red-500 text-sm">Please specify a valid user or team ID</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>Assign</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}