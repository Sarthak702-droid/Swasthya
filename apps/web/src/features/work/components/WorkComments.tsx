import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { commentSchema } from '../schemas/work.schemas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { WorkComment } from '../types/work.types';
import { formatDistanceToNow } from 'date-fns';
import { useAddComment } from '../hooks/useWorkMutations';

export function WorkComments({ itemId, comments = [] }: { itemId: string, comments: WorkComment[] }) {
  const addComment = useAddComment();
  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: '' }
  });

  const onSubmit = (data: { body: string }) => {
    addComment.mutate({ id: itemId, ...data }, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : comments.map(c => (
          <div key={c.id} className="p-4 bg-gray-50 rounded-lg text-sm">
            <div className="flex justify-between text-gray-500 mb-2">
              <span className="font-medium text-gray-900">{c.authorName || c.authorUserId}</span>
              <span>{formatDistanceToNow(new Date(c.createdAt), {addSuffix: true})}</span>
            </div>
            <p className="whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Textarea 
          placeholder="Add a comment..." 
          {...form.register('body')}
          className="resize-none"
        />
        {form.formState.errors.body && <p className="text-red-500 text-xs">{form.formState.errors.body.message}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={addComment.isPending || !form.formState.isValid}>Post Comment</Button>
        </div>
      </form>
    </div>
  );
}