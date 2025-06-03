import * as factory from '../../utils/handlerFactory'

export const getAllReviews = factory.getAll('review')

export const addReview = factory.createOne('review')

export const getReview = factory.getOne('review')

export const updateReview = factory.updateOne('review')

export const deleteReview = factory.deleteOne('review')

