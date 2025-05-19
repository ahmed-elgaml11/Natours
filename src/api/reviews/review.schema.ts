import z from 'zod'
import { Types } from 'mongoose'

const objectIdString = z.string().refine(val => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId for tour or user',
});

export const reviewBodySchema = z.object({
  review: z.string().min(1, 'Review cannot be empty'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  tour: objectIdString.optional(),
  user: objectIdString.optional(),
}).strict();

export const createReviewBodySchema = z.object({
  body: reviewBodySchema,
  params: z.object({})
}).strict();

