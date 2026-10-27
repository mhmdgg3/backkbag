import { Product } from "../model/product.model.js";
import { ProductImage } from "../model/productImage.model.js";
import { ProductVariant } from "../model/productVariant.model.js";
import mongoose from "mongoose";

export const createProduct = async (
  name,
  description,
  isActive,
  categoryId,
) => {
  try {
    const newProduct = new Product();

    newProduct.name = name;
    newProduct.description = description;
    newProduct.isActive = isActive;
    newProduct.categoryId = categoryId;

    newProduct.save();
    return newProduct;
  } catch (error) {
    new Error(error.message);
  }
};

export const createProductVariant = async (productVariantsValues) => {
  const result = await ProductVariant.insertMany(productVariantsValues);
  return result;
};

export const createProductImage = async (images) => {
  const result = await ProductImage.insertMany(images);

  return result;
};

export const getProducts = async () => {
  const products = await Product.find()
    .populate("productVariants")
    .populate("images");

  return products;
};

export const getProduct = async (id) => {
  const product = await Product.findById(id)
    .populate("productVariants")
    .populate("images");

  return product;
};

export const deleteProduct = async (productId) => {
  let deletedImagesPublicIds = [];

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const product = await Product.findById(productId).session(session);

      if (!product) {
        const error = new Error("product not fount");
        error.status = 401;
        throw error;
      }

      const images = await ProductImage.find({
        productId: { $in: product._id },
      })
        .select("publicId")
        .session(session);

      deletedImagesPublicIds = images.map((image) => image.publicId);

      await ProductImage.deleteMany(
        { productId: { $in: product._id } },
        { session },
      );

      await ProductVariant.deleteMany({ productId: product._id }, { session });

      await Product.deleteOne({ _id: productId }, { session });
    });
    return deletedImagesPublicIds;
  } finally {
    await session.endSession();
  }
};

export const updateImage = async (
  id,
  imagesDeleteIds = [],
  images = [],
  product = {},
  productsVarintsIdsDelete = [],
  productsVarintsInsert = [],
) => {
  const session = await mongoose.startSession();

  try {
    let imageDeletePublicIds = [];

    await session.withTransaction(async () => {
      const existingProduct = await Product.findById(id).session(session);

      if (!existingProduct) {
        const error = new Error("Product not found");
        error.status = 404;
        throw error;
      }

      if (Array.isArray(imagesDeleteIds) && imagesDeleteIds.length > 0) {
        const imagesToDelete = await ProductImage.find({
          _id: { $in: imagesDeleteIds },
          productId: id,
        })
          .select("publicId")
          .session(session)
          .lean();

        imageDeletePublicIds = imagesToDelete.map((image) => image.publicId);

        await ProductImage.deleteMany(
          {
            _id: { $in: imagesDeleteIds },
            productId: id,
          },
          { session },
        );
      }

      if (images.length > 0) {
        await ProductImage.insertMany(images, { session });
      }

      const productUpdates = {};
      const { name, description, isActive } = product;

      if (name !== undefined) productUpdates.name = name;
      if (description !== undefined) {
        productUpdates.description = description;
      }
      if (isActive !== undefined) {
        productUpdates.isActive = isActive;
      }

      if (Object.keys(productUpdates).length > 0) {
        await Product.findByIdAndUpdate(
          id,
          { $set: productUpdates },
          {
            new: true,
            runValidators: true,
            session,
          },
        );
      }

      if (productsVarintsIdsDelete.length > 0) {
        await ProductVariant.deleteMany(
          {
            _id: { $in: productsVarintsIdsDelete },
            productId: id,
          },
          { session },
        );
      }

      if (productsVarintsInsert.length > 0) {
        const variants = productsVarintsInsert.map((variant) => ({
          ...variant,
          productId: id,
        }));

        await ProductVariant.insertMany(variants, { session });
      }
    });

    return imageDeletePublicIds;
  } finally {
    await session.endSession();
  }
};
