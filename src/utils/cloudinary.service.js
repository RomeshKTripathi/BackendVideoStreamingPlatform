import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // auto : upload any type of file i.e Audio, video, Image, PDF etc.
    });
    // file has been uploaded
    console.log("File uploaded successfully");
    return response;
  } catch (error) {
    console.log("cloudinary file upload error :: ", error.error);
  } finally {
    if (localFilePath) fs.unlinkSync(localFilePath);
  }
};
