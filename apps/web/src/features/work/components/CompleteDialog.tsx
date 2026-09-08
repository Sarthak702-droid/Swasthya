import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeSchema } from '../schemas/work.schemas';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface Props { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; isPending: boolean; }

export function CompleteDialog({ isOpen, onClose, onSubmit, isPending }: Props) {
  const form = useForm({ resolver: zodResolver(completeSchema), defaultValues: { reason: '' } });
  const handleOpenChange = (open: boolean) => { if (!open) { form.reset(); onClose(); } };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Complete Work Item</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2"><Label>Notes (Optional)</Label><Textarea {...form.register('reason')} /></div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isPending}>Complete</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}