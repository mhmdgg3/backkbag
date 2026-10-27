import * as categoryRepo from "../repo/category.repo.js";
import {
  deletImageFromCloudinary,
  uploadImageToCloudinary,
} from "./cloudinary.service.js";

export const createCategory = async (name, file) => {
  const image = await uploadImageToCloudinary(file.buffer, "category");
  const category = await categoryRepo.createCategory(name, image);

  return category;
};

export const categories = async () => {
  const categories = await categoryRepo.categories();
  return categories;
};

export const category = async (id) => {
  const category = await categoryRepo.category(id);

  return category;
};
export const updateCategory = async (id, name, imageDeletId, file) => {
  try {
    let image;
    if (file) {
      image = await uploadImageToCloudinary(file.buffer, "category");
    }

    const result = await categoryRepo.updateCategory(
      id,
      name,
      imageDeletId,
      image,
    );

    if (result.publicId) {
      await deletImageFromCloudinary(result.publicId);
    }
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const deleteImage = await categoryRepo.deleteCategory(id);

    if (deleteImage) {
      await deletImageFromCloudinary(deleteImage);
    }
  } catch (error) {
    throw error;
  }
};
