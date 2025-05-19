import { IReview, Review } from "./review.model"

export const getAllReviews = async () => {
    return Review.find();
}

export const addReview = async (body: IReview) => {
    return Review.create(body)
}