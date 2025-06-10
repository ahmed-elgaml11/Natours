import { v2 as cloudinary } from 'cloudinary' 
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const cloudinaryUploadImage = async (filePath: string) => {
    try{

        const data =  await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto'
        })
        return data;    
    }
    catch(err){
         throw err
    }
}

export const cloudinaryRemoveImage = async (imageID: string) => {
    try{
        const data =  await cloudinary.uploader.destroy(imageID, {
            resource_type: 'auto'
        })
        return data;    
    }
    catch(err){
        return err
    }
}