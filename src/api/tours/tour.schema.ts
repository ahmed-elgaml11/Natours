import { z } from 'zod';

export const tourSchema = z.object({
  name: z
    .string({ required_error: 'A tour must have a name' })
    .trim()
    .min(10, 'A tour name must have more or equal then 10 characters')
    .max(40, 'A tour name must have less or equal then 40 characters'),
  slug: z.string().optional(),
  duration: z
    .number({ required_error: 'A tour must have a duration' })
    .positive('Duration must be a positive number'),
  maxGroupSize: z
    .number({ required_error: 'A tour must have a group size' })
    .positive('Group size must be a positive number'),
  difficulty: z.enum(['easy', 'medium', 'difficult'], {
    errorMap: () => ({ message: 'Difficulty is either: easy, medium, difficult' }),
  }),
  ratingsAverage: z
    .number()
    .min(1, 'Rating must be above 1.0')
    .max(5, 'Rating must be below 5.0')
    .default(4),
  ratingsQuantity: z.number().default(0),
  price: z
    .number({ required_error: 'A tour must have a price' })
    .positive('Price must be a positive number'),
  priceDiscount: z.number().positive('Price discount must be a positive number').optional(),
  summary: z
    .string({ required_error: 'A tour must have a summary' })
    .trim()
    .min(1, 'Summary cannot be empty'),
  description: z.string().trim().optional(),
  imageCover: z.string({ required_error: 'A tour must have a cover image' }).min(1, 'Cover image cannot be empty'),
  images: z.array(z.string()).optional(),
  startDates: z.array(z.coerce.date()).optional(),
  secretTour: z.boolean().default(false),
});

export type tourType = z.infer<typeof tourSchema >