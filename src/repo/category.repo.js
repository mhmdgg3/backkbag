import mongoose from "mongoose";
import Category from "../model/category.model.js";
import CategoryImage from "../model/categoryImage.model.js";
import { Product } from "../model/product.model.js";

export const createCategory = async (name, image) => {
  const session = await mongoose.startSession();
  try {
    const newCategory = new Category();

    await session.withTransaction(async () => {
      newCategory.name = name;
      await newCategory.save({ session });

      const newCategoryImage = new CategoryImage();

      newCategoryImage.categoryId = newCategory._id;
      newCategoryImage.imageUrl = image.secure_url;
      newCategoryImage.publicId = image.public_id;
      await newCategoryImage.save({ session });
    });
    return newCategory;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};

export const categories = async () => {
  try {
    const categories = await Category.find().populate("categoryImage");
    return categories;
  } catch (error) {}
};

export const category = async (id) => {
  const category = await Category.findById(id)
    .populate({
      path: "products",
      populate: [
        {
          path: "productVariants",
        },
        {
          path: "images",
        },
      ],
    })
    .populate("categoryImage");
  return category;
};

export const updateCategory = async (id, name, imageDeletId, image) => {
  let publicId;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const category = await Category.findById(id)
        .select("_id")
        .session(session);

      if (!category) {
        const error = new Error("category not found");
        error.status = 400;
        throw error;
      }

      if (name) {
        category.name = name;
        await category.save({ session });
      }
      if (imageDeletId) {
        const deletedImage =
          await CategoryImage.findById(imageDeletId).session(session);

        if (!deletedImage) {
          const error = new Error("Image not found");
          error.status = 404;
          throw error;
        }

        publicId = deletedImage.publicId;
        console.log("publicId", publicId);

        await CategoryImage.findByIdAndDelete(imageDeletId).session(session);
      }
      if (image) {
        const newImage = new CategoryImage();

        ((newImage.imageUrl = image.secure_url),
          (newImage.publicId = image.public_id),
          (newImage.categoryId = category._id),
          await newImage.save({ session }));
      }
    });
    return {
      publicId,
    };
  } finally {
    await session.endSession();
  }
};

export const deleteCategory = async (id) => {
  let deleteImage = null;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const category = await Category.findById(id)
        .select("_id")
        .session(session);

      if (!category) {
        const error = new Error("Category not found");
        error.status = 404;
        throw error;
      }

      console.log("category", category);

      const hasProducts = await Product.exists({
        categoryId: category._id,
      }).session(session);

      if (hasProducts) {
        const error = new Error(
          "Cannot delete category because it has products",
        );
        error.status = 400;
        throw error;
      }

      const image = await CategoryImage.findOne({
        categoryId: category._id,
      })
        .select("_id publicId")
        .session(session);

      if (image) {
        deleteImage = image.publicId;
        await CategoryImage.findByIdAndDelete(image._id).session(session);
      }

      await Category.findByIdAndDelete(category._id).session(session);
    });

    return deleteImage;
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
};
