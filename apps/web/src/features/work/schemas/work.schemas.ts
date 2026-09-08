import { z } from 'zod';

export const assignSchema = z.object({
  toUserId: z.string().uuid().optional(),
  toTeamId: z.string().uuid().optional(),
  reason: z.string().max(500).optional(),
}).refine(data => data.toUserId || data.toTeamId, {
  message: 'Either a user or team must be specified',
});

export const reassignSchema = z.object({
  toUserId: z.string().uuid('Invalid user ID'),
  reason: z.string().max(500).optional(),
});

export const completeSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const returnSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500),
});

export const handoffSchema = z.object({
  toTeamId: z.string().uuid('Invalid team ID'),
  toUserId: z.string().uuid().optional(),
  reason: z.string().min(1, 'Reason is required').max(500),
});

export const commentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(5000),
});