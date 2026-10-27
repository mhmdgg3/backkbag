import cloudinary from "../config/cloudinary.js";

export function uploadImageToCloudinary(Buffer, folder = "product") {
  return new Promise((res, rej) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, result) => {
        if (err) {
          return rej(err);
        }
        res(result);
      },
    );

    stream.end(Buffer);
  });
}

export const deletImageFromCloudinary = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch  {
    const error = new Error("cloudinary error" , publicIds);
    error.status = 400;
    throw error;
  }
};
