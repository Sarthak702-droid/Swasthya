import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reassignSchema } from '../schemas/work.schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean; }

export function ReassignDialog({ isOpen, onClose, onSubmit, isPending }: Props) {
  const form = useForm({ resolver: zodResolver(reassignSchema), defaultValues: { toUserId: '', reason: '' } });
  const handleOpenChange = (open: boolean) => { if (!open) { form.reset(); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reassign Work Item</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label>User ID</Label><Input {...form.register('toUserId')} /></div>
          <div className="space-y-2"><Label>Reason</Label><Textarea {...form.register('reason')} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>Reassign</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}