import mongoose, { Query } from "mongoose";
import { Tour } from "../tours/tour.model";
const schema = mongoose.Schema
export interface IReview extends Document {
    review: string;
    rating: number;
    createdAt: Date;
    tour: mongoose.Types.ObjectId ;
    user: mongoose.Types.ObjectId ;
}
type ReviewModel = mongoose.Model<IReview> & {
    calculateAvgRatings: (tourId: mongoose.Types.ObjectId ) => Promise<void>;
};

interface QueryWithDoc extends Query<any, any> {
    doc?: IReview | null;
}
const reiewSchema = new schema<IReview>({
    review: {
        type: String,
        required: [true, 'Review can not be empty!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

reiewSchema.index({ tour: 1, user: 1 }, { unique: true })


reiewSchema.pre(/^find/, function (this: Query<any, any>, next) {
    this.populate({
        path: 'tour',
        select: 'name summary '
    }).populate({
        path: 'user',
        select: 'name'
    });
    next()
})


reiewSchema.statics.calculateAvgRatings = async function (tourId: mongoose.Types.ObjectId ) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                numRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }

        }
    ])
    console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].numRating
        })

    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage: 4,
            ratingsQuantity: 0
        })

    }

}

reiewSchema.post('save', function () {
    const model = this.constructor as ReviewModel

    model.calculateAvgRatings(this.tour);
})

reiewSchema.pre(/^findOneAnd/, async function (this: QueryWithDoc, next) {
    this.doc = await this.model.findOne();
    next();
});

reiewSchema.post(/^findOneAnd/, async function (this: QueryWithDoc) {
    const doc = this.doc;
    if (!doc) return;

    const model = doc.constructor as ReviewModel

    await model.calculateAvgRatings(doc.tour?._id);
});


export const Review = mongoose.model<IReview>('Review', reiewSchema)
