import { IReview, Review } from "./review.model"

export const getAll =  (filter: object) => {
    return Review.find(filter);
}

export const createOne = async (body: IReview) => {
    return Review.create(body)
}

export const getOneById = async (id: string ) => {
    return Review.findById(id)
}


export const deleteOne = async (id: string ) => {
    return await Review.findByIdAndDelete(id)
}

export const updateOne = async (id: string, body: Partial<IReview> ) => {
    return await Review.findByIdAndUpdate(id, body, {
        new: true,
    })
}
