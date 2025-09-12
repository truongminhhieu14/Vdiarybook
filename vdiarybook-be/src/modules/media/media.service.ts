import { Request } from "express";
import path from "path";
import sharp from "sharp";
import { upload_dir } from "~/constants/dir";
import { uploadImage } from "~/utils/cloudinary";
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from "~/utils/file";
import fs from "fs/promises";

// Helper function to safely delete files with retry
const safeDeleteFile = async (
  filePath: string,
  maxRetries = 5,
  delay = 200
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error: any) {
      if (error.code === "EBUSY" || error.code === "ENOENT") {
        if (i < maxRetries - 1) {
          const waitTime = delay * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
      }
      console.warn(`Không thể xoá file ${filePath}:`, error.message);
      return false;
    }
  }
  return false;
};

export const uploadImageService = async (req: Request) => {
  const files = await handleUploadImage(req);

  const result = await Promise.all(
    files.map(async (file: any) => {
      const newName = getNameFromFullName(file.newFilename);
      const newPath = path.resolve(upload_dir, `${newName}.jpg`);
      
      // Đọc file vào buffer để tránh file handle issues
      const imageBuffer = await fs.readFile(file.filepath);
      
      // Resize và convert ảnh sang JPG từ buffer
      const processedBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();

      await fs.writeFile(newPath, processedBuffer);

      const uploadResult = await uploadImage(newPath, "image", "images");

      await safeDeleteFile(file.filepath);
      await safeDeleteFile(newPath);

      return uploadResult;
    })
  );
  return result;
};

export const uploadVideoService = async (req: Request) => {
  const files = await handleUploadVideo(req); 
  const result = await Promise.all(
    files.map(async (file: any) => {
      const newName = getNameFromFullName(file.newFilename);
      const newPath = path.resolve(upload_dir, `${newName}${path.extname(file.originalFilename)}`);

      // Đọc file vào buffer (nếu cần) hoặc dùng lại đường dẫn gốc
      await fs.copyFile(file.filepath, newPath);

      const uploadResult = await uploadImage(newPath, "video", "videos");

      await safeDeleteFile(file.filepath);
      await safeDeleteFile(newPath);

      return uploadResult;
    })
  );

  return result;
};
