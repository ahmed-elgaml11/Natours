import { Booking, IBooking } from "./booking.model"


export const getAll =  (filter: Object) => {
    return Booking.find(filter)
}

export const createOne = async (body: IBooking) => {
    return Booking.create(body)
}

export const getOneById = async (id: string ) => {
    return Booking.findById(id)
}


export const deleteOne = async (id: string ) => {
    return await Booking.findByIdAndDelete(id)
}

export const updateOne = async (id: string, body: Partial<IBooking> ) => {
    return await Booking.findByIdAndUpdate(id, body, {
        new: true,
    })
}
