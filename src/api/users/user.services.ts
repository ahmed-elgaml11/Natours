import { IUserInput, User } from "./user.model"

export const createUser = async (body: IUserInput) => {
    return await User.create(body)
}
export const findUser = async (email: string) => {
    return await User.findOne({ email }).select('+password')
}

export const findUserById = async (id: string) => {
    return await User.findById(id)
}

export const findUserByToken = async (token: string) => {
    return User.findOne({ PasswordResetToken: token, passwordResetExpires: { $gt: new Date(Date.now()) } })
}

export const findUserWithPassById = async (id: string) => {
    return await User.findById(id).select('+password')
}
export const allowedObj = <T>(body: T, fields: (keyof T)[]) => {
    const allowed: Partial<T> = {}
    // Object.keys(body).forEach(ele => {
    //     if (fields.includes(ele as keyof T))
    //         allowed[ele as keyof T ] = body[ele as keyof T]
    // });
    for (const field of fields){
        if (body[field] !== undefined){
            allowed[field] = body[field]
        }
    }
    return allowed
}
export const updateData = async<T>(id: string, data: Partial<T>) => {
    const user = await  User.findOneAndUpdate({ _id: id }, data, {
        new: true,
        runValidators: true,
    });
    return user ?? undefined
};


export const inActiveUser = async (id: string) => {
    await User.findByIdAndUpdate({_id: id}, {isActive: false})
}