import * as productRepo from "../repo/product.repo.js";
import { uploadImageToCloudinary } from "./cloudinary.service.js";
import { deletImageFromCloudinary } from "./cloudinary.service.js";

export const createProduct = async (files, product, productVariants) => {
  try {
    const cludinaryImages = await Promise.all(
      files.map((file) => {
        return uploadImageToCloudinary(file.buffer, "products");
      }),
    );

    const { name, description, isActive, categoryId } = product;
    const productResult = await productRepo.createProduct(
      name,
      description,
      isActive,
      categoryId
    );

    const productVariantsValues = productVariants.map((pv) => {
      return {
        productId: productResult._id,
        quantity: pv.quantity,
        minQuantity: pv.minQuantity,
        price: pv.price,
        discoundPrice: pv.discoundPrice,
        color: pv.color,
        variantIsActive: pv.variantIsActive,
        productMain: pv.productMain,
      };
    });

    const productVariantResult = await productRepo.createProductVariant(
      productVariantsValues,
    );
    const images = cludinaryImages.map((image, i) => {
      return {
        productId: productResult._id,
        imageUrl: image.secure_url,
        publicId: image.public_id,
        isCover: i === 0,
      };
    });

    const result = await productRepo.createProductImage(images);

    return {
      product: productResult,
      productVariant: productVariantResult,
      images: result,
    };
  } catch (error) {
    new Error(error.message);
  }
};

export const gerProducts = async () => {
  const products = await productRepo.getProducts();
  return products;
};
export const gerProduct = async (id) => {
  const product = await productRepo.getProduct(id);
  return product;
};

export const deleteProduct = async (productId) => {
  const deletedImagesPublicIds = await productRepo.deleteProduct(productId);
  await deletImageFromCloudinary(deletedImagesPublicIds);
};

export const updateProduct = async (
  id,
  imagesDeleteIds = [],
  files = [],
  product = {},
  productsVarintsIdsDelete = [],
  productsVarintsInsert = [],
) => {
  const images = [];

  if (Array.isArray(files) && files.length > 0) {
    const cloudinaryImages = await Promise.all(
      files.map((file) => uploadImageToCloudinary(file.buffer, "products")),
    );

    cloudinaryImages.forEach((image, index) => {
      images.push({
        productId: id,
        imageUrl: image.secure_url,
        publicId: image.public_id,
        isCover: index === 0,
      });
    });
  }

  const imageDeletePublicIds = await productRepo.updateImage(
    id,
    imagesDeleteIds,
    images,
    product,
    productsVarintsIdsDelete,
    productsVarintsInsert,
  );

  if (imageDeletePublicIds.length > 0) {
    await deletImageFromCloudinary(imageDeletePublicIds);
  }

  return {
    message: "Product updated successfully",
    deletedImages: imageDeletePublicIds.length,
    addedImages: images.length,
  };
};
