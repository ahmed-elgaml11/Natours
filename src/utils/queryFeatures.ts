import { Query } from "mongoose"
import { ParsedQs } from 'qs'

export class APIFeatures {
    public query: Query<any, any>
    public queryStr: ParsedQs
    constructor(query: Query<any, any>, queryStr: ParsedQs) {
        this.query = query
        this.queryStr = queryStr
    }
    filter() {
        const queryObj = { ...this.queryStr }
        const excludedFields = ['sort', 'page', 'limit', 'fields']
        excludedFields.forEach((ele) => delete queryObj[ele])

        //        ?age[gte]=10
        let queryString = JSON.stringify(queryObj)
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)

        this.query.find(JSON.parse(queryString))

        return this

    }
    sort() {
        //sort ('name age')                              ?sort=duration,name
        if (this.queryStr.sort && typeof this.queryStr.sort === 'string') {
            const sortedBy = this.queryStr.sort.split(',').join(' ')
            this.query = this.query.sort(sortedBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }

        return this
    }
    limitFields() {
        // fields limiting: select(-name age)              ?fields=duration,name
        if (this.queryStr.fields && typeof this.queryStr.fields === 'string') {
            const fields = this.queryStr.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            this.query = this.query.select('-__v')
        }

        return this

    }
    paginate() {
        //pagination               ?page=3&limit=3
        const page: number = Number(this.queryStr.page) || 1;
        const limit: number = Number(this.queryStr.limit) || 100;
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)


        return this

    }

}