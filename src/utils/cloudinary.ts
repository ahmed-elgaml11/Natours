import { v2 as cloudinary } from 'cloudinary'
export const cloCon = () => cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const cloudinaryUploadImage = async (filePath: string) => {

    const data = await cloudinary.uploader.upload(filePath, {
        resource_type: 'image'
    })
    return data;
}

export const cloudinaryRemoveImage = async (imageID: string) => {
        const data = await cloudinary.uploader.destroy(imageID, {
            resource_type: 'image'
        })
        return data;
}