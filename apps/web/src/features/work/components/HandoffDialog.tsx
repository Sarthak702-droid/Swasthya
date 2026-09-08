import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handoffSchema } from '../schemas/work.schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean; }

export function HandoffDialog({ isOpen, onClose, onSubmit, isPending }: Props) {
  const form = useForm({ resolver: zodResolver(handoffSchema), defaultValues: { toTeamId: '', toUserId: '', reason: '' } });
  const handleOpenChange = (open: boolean) => { if (!open) { form.reset(); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Handoff Work Item</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label>Target Team ID</Label><Input {...form.register('toTeamId')} /></div>
          <div className="space-y-2"><Label>Target User ID (Optional)</Label><Input {...form.register('toUserId')} /></div>
          <div className="space-y-2"><Label>Reason</Label><Textarea {...form.register('reason')} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>Handoff</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}