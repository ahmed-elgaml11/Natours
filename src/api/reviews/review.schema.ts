import z from 'zod'
import { Types } from 'mongoose'

const objectIdString = z.string().refine(val => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId for tour or user',
});

export const reviewBodySchema = z.object({
  review: z.string().min(1, 'Review cannot be empty'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  tour: objectIdString,
  user: objectIdString
}).strict();

export const createReviewBodySchema = z.object({
  body: reviewBodySchema,
  params: z.object({})
}).strict();
export const getReviewSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: objectIdString
  })
}).strict();


export const updateReviewShema = z.object({
  body: reviewBodySchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field is required for update',
    }
  ),
  params: z.object({
    id: objectIdString
  })
}).strict();


export const updateTourSchema = reviewBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required for update'
})
export type UpdatedReviewType = z.infer<typeof updateTourSchema>

