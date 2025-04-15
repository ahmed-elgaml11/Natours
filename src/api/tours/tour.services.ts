import { Tour } from "./tour.model"
import { tourType } from "./tour.schema"

export const getAllTours = async () => {
    return Tour.find()
}
export const addTour = async (body: tourType) => {
    return Tour.create(body)
}