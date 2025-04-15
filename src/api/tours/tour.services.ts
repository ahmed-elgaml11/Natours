import mongoose from "mongoose"
import { Tour } from "./tour.model"
import { ITour } from "./tour.model"
import { updatedTourType } from './tour.schema'
import { z } from 'zod';
import { updateTourSchema } from "./tour.schema";

export const getAllTours = async () => {
    return Tour.find()
}
export const addTour = async (body: ITour) => {
    return Tour.create(body)
}
export const getTour = async (name: string) => {
    return Tour.findOne({name})
}
export const getTourbyId = async (id: string) => {
    return Tour.findById(id)
}
export const updateTour = async (id: string, body: updatedTourType ) => {
    return await Tour.findByIdAndUpdate(id, body, {
        new: true,
    })
}
export const deletedTour = async (id: string ) => {
    return await Tour.findByIdAndDelete(id)
}

