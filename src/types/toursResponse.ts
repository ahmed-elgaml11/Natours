import {ITour} from '../api/tours/tour.model'
export interface toursResponse {
    status?: string,
    results?: number,
    data?: {
        tours?: ITour[],
        tour?: ITour,
    } 
}