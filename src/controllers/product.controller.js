import * as productSevice from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const product = JSON.parse(req.body.product);
    const productVariants = JSON.parse(req.body.productVariants);
    const files = req.files;

    const data = await productSevice.createProduct(
      files,
      product,
      productVariants,
    );

    return res.status(201).json({
      success: true,
      message: "created successfully",
      data,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await productSevice.gerProducts();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productSevice.gerProduct(id);

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await productSevice.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      imagesDeleteIds = "[]",
      product = "{}",
      productsVarintsIdsDelete = "[]",
      productsVarintsInsert = "[]",
    } = req.body;

    const parsedImagesDeleteIds = JSON.parse(imagesDeleteIds);
    const parsedProduct = JSON.parse(product);
    const parsedVariantsDeleteIds = JSON.parse(productsVarintsIdsDelete);
    const parsedVariantsInsert = JSON.parse(productsVarintsInsert);

    // التحقق من شكل البيانات
    if (
      !Array.isArray(parsedImagesDeleteIds) ||
      !Array.isArray(parsedVariantsDeleteIds) ||
      !Array.isArray(parsedVariantsInsert) ||
      parsedProduct === null ||
      typeof parsedProduct !== "object" ||
      Array.isArray(parsedProduct)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
      });
    }

    const { id } = req.params;
    const files = req.files || [];

    const result = await productSevice.updateProduct(
      id,
      parsedImagesDeleteIds,
      files,
      parsedProduct,
      parsedVariantsDeleteIds,
      parsedVariantsInsert,
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message:
        error instanceof SyntaxError
          ? "Invalid JSON format in form-data"
          : error.message,
    });
  }
};
