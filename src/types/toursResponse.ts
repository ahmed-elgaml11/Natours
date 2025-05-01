import {ITour} from '../api/tours/tour.model'
import mongoose from 'mongoose'
export interface toursResponse {
    status?: string,
    results?: number,
    data?: {
        tours?: ITour[],
        tour?: ITour,
        stats?: any[]
    } 
}