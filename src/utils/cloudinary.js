import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload file on cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // console.log("file has been uploaded on cloudinary: ", uploadResult);
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removes the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (resourceUrl) => {
  try {
    cloudinary.v2.api
      .delete_resources([resourceUrl], {
        type: "upload",
        resource_type: "image",
      })
      .then(console.log);
  } catch (error) {
    console.log("Failed to delete the old file");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
