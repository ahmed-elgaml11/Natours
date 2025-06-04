import mongoose from 'mongoose';
import { Tour } from '../api/tours/tour.model'
import { Review } from '../api/reviews/review.model'
import { User } from '../api/users/user.model'
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.join(__dirname, '..', '../config.env')});

const { DATABASE } = process.env
async function main() {
    if (!DATABASE) {
        console.error('Error: MONGO_URI is not defined in the environment variables.');
        process.exit(1); 
    }
    await mongoose.connect(DATABASE);
}

main()
.then(() => {
    console.log('connected to db');
})
.catch((err) => {
    console.log(err);
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const addData = async () => {
    try{
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded!');    
    }
    catch (err) {
        console.log(err);
    }

    process.exit();
}

const deleteData = async () => {
try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
} catch (err) {
    console.log(err);
}
process.exit();
};

console.log(process.argv)

if (process.argv[2] === '--import') {
    addData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
