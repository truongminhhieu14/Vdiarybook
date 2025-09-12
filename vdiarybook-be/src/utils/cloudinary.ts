import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload an image
export const uploadImage = async (filePath: string, type: 'image' | 'video', folder: string) => {
    const uploadResult = await cloudinary.uploader
        .upload(filePath, {
            resource_type: type, // 'image' or 'raw'
            folder: folder
        })
        .catch((error) => {
            console.log(error)
        })
    return uploadResult;
        
}