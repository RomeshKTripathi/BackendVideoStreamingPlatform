import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

const api_key = process.env.CLOUDINARY_API_KEY;

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

export const deleteFromCloudinary = async (asset) => {
  // delete from cloudinary

  // cloudinary.api
  //   .delete_resources(IDs, { resource_type: "video" })
  //   .then((res) => {
  //     console.log("Assets deleted:", res);
  //   })
  //   .catch((err) => {
  //     throw new ApiError(
  //       500,
  //       "Unable to delete file from cloudinary : ",
  //       err.message,
  //       "ERR_CLOUDINARY_DELETE_FAILED",
  //       err
  //     );
  //   });
  try {
    if (!asset) return null;
    const response = await cloudinary.api.delete_resources(asset["public_id"], {
      resource_type: asset.resource_type,
    });
    return response;
  } catch (error) {
    throw new ApiError(
      500,
      "Unable to delete file from cloudinary " + error.message,
      "ERR_CLOUDINARY_DELETE_FAILED",
      error
    );
  }
};
