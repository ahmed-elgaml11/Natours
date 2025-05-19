import mongoose from "mongoose";
import { Query } from "mongoose";
import slugify from "slugify";


type Location = {
    type: 'Point';
    coordinates: number[];
    address: string;
    description: string;
    day?: string;
}
export interface ITour {
    name: string;
    slug?: string;
    duration: number;
    maxGroupSize: number;
    difficulty: 'easy' | 'medium' | 'difficult';
    ratingsAverage: number;
    ratingsQuantity: number;
    price: number;
    priceDiscount?: number;
    summary: string;
    description?: string;
    imageCover: string;
    images?: string[];
    createdAt: Date;
    startDates?: Date[];
    secretTour: boolean;
    startLocation: Location,
    locations: Location[],
    guides?: mongoose.Types.ObjectId[]
}
const tourSchema = new mongoose.Schema<ITour>({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price
            },
            message: 'Discount price should be lower than regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    // Geospatial Data >>> GeoJSON
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: String
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);
tourSchema.virtual('weekDuration').get(function () {
    return this.duration / 7;
})

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})
// document middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})


//query middleware
tourSchema.pre(/^find/, function (this: Query<any, any>, next) {
    this.find({ secretTour: { $ne: true } });
    this.setOptions({ start: Date.now() });
    next();
});
tourSchema.post(/^find/, function (this: Query<any, any>, docs, next) {
    const start = this.getOptions().start
    if (start) {
        console.log(`This query took ${Date.now() - start} milliseconds`);
    }
    next();
})
tourSchema.pre(/^find/, function (this: Query<any, any>, next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })
    next()
})


// aggregate middleware

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { secretTour: { $ne: true } }
    })
    next()
})


export const Tour = mongoose.model<ITour>('Tour', tourSchema)
