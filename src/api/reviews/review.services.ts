import { IReview, Review } from "./review.model"

export const getAllReviews = async (filter: object) => {
    return Review.find(filter);
}

export const addReview = async (body: IReview) => {
    return Review.create(body)
}