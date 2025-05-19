import { IReview } from '../api/reviews/review.model'
export interface reviewResponse {
    status?: string,
    results?: number,
    message?: string
    data?: {
        review?: IReview ,
        reviews?: IReview[]
    }
}

