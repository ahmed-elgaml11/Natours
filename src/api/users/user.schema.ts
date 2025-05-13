import z, { object } from 'zod'
const userBodySchema = z.object({
    name: z.string().min(3, { message: 'Please tell us your name!' }),
    email: z
        .string()
        .min(1, { message: 'Please provide your email' })
        .email({ message: 'Please provide a valid email' }),
    photo: z.string().optional(),
    role: z.enum(['user', 'guide', 'lead-guide', 'admin']).default('user'),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirm: z.string().min(8, { message: 'Please confirm your password' }),
    passwordChangedAt: z.preprocess((arg) => {
        if (typeof arg === 'string' || typeof arg === 'number') {
            const date = new Date(arg)
            return isNaN(date.getTime()) ? 'undefined' : date
        }
        return arg;
    },
        z.date().optional()
    )
}).strict()
const userIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB ObjectId' })
}).strict();;


const userEmaildSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please provide a valid email' }),
}).strict()

export type Email = z.infer<typeof userEmaildSchema>
export const userForgetPasswordSchema = z.object({
    body: userEmaildSchema,
    params: z.object({})
}).strict()



export const createUserSchema = z.object({
    body: userBodySchema.refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    }).transform((val) => ({
        ...val,
        email: val.email ? val.email.toLowerCase() : undefined
    })),
    params: z.object({}),
}).strict();

export const getUserSchema = z.object({
    body: z.object({}),
    params: userIdSchema
}).strict();

const updateUserBodySchema = userBodySchema.partial()
    .transform((val) => ({
        ...val,
        email: val.email ? val.email.toLowerCase() : undefined,
    })).refine(
        (data) => Object.keys(data).length > 0,
        {
            message: 'At least one field is required for update',
        }
    ).refine(
        (data) => !data.password || (data.password && data.password === data.passwordConfirm),
        {
            message: 'Passwords do not match',
            path: ['passwordConfirm'],
        }
    );

export const updateUserSchema = z.object({
    body: updateUserBodySchema,
    params: userIdSchema,
}).strict();

export const loginUserSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Please provide your email' })
        .email({ message: 'Please provide a valid email' }),
    password: z.string()
}).strict()

export type LoginType = z.infer<typeof loginUserSchema>

export const createUserLoginSchema = z.object({
    body: loginUserSchema,
    params: z.object({})
}).strict()



const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirm: z.string().min(8, { message: 'Please confirm your password' }),
})
export type ResetPassword = z.infer<typeof resetPasswordSchema>
const tokenQuerySchema = z.object({
    token: z
        .string()
        .regex(/^[a-f0-9]{64}$/, 'Invalid token format'),
});

export const createResetPasswordSchema = z.object({
    body: resetPasswordSchema.refine(
        (data) => data.password === data.passwordConfirm,
        {
            message: 'Passwords do not match',
            path: ['passwordConfirm'],
        }
    ),
    params: tokenQuerySchema
})

const updatePasswordSchema = z.object({
    currentPassword: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirm: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
})
export const createUpdatePasswordSchema = z.object({
    body: updatePasswordSchema.refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    }),
    params: z.object({})
})

// const updateMedSchema = z.object({
//     email: 

// })
// export const = createUpdateMedSchema = z

export const updateMeSchema = z.object({
    body: userBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required for update'
    }),
    params: z.object({})
})


export type UpdateMeBody = z.infer<typeof updateMeSchema.shape.body>

