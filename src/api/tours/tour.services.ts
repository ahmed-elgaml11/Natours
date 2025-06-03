import { Tour } from "./tour.model"
import { ITour } from "./tour.model"
import { UpdatedTourType } from './tour.schema'

export const getAll =  (filter: object) => {
    return Tour.find(filter)
}
export const createOne = async (body: ITour) => {
    return Tour.create(body)
}
export const getTour = async (name: string) => {
    return Tour.findOne({name})
}
export const getOneById = async (id: string) => {
    return Tour.findById(id).populate('reviews')
}
export const updateOne = async (id: string, body: Partial<ITour> ) => {
    return await Tour.findByIdAndUpdate(id, body, {
        new: true,
    })
}
export const deleteOne = async (id: string ) => {
    return await Tour.findByIdAndDelete(id)
}

export const tourStats = async () => {          //  //aggredation pipeline
    const stats = Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4} }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { minPrice: 1 }
        }
    ])
    return stats
}
// here i want informatin for each month to get the best month has tours so i want a field has a month to group by it but startingDates field is array so there is '$unwind' stage it deconstruct the array and output document for each element in the array
export const monthlyPlan = async (year: number) => {
    const plan = Tour.aggregate([
        {
            $unwind: '$startDates' 
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                tours: { $push: '$name' }
            }

        },
        {
            $addFields: { month: '$_id' }
        }, 
        {
            $project: { _id: 0 }
        },
        {
            $sort: { numTours: -1 }
        },
        {
            $limit:  12 
        }
    ])
    return plan
}