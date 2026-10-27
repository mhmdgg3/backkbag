import * as categoryServices from "../services/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    const category = await categoryServices.createCategory(name, file);

    return res.status(201).json({
      success: true,
      message: "created successfully",
      category,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
export const categories = async (req, res) => {
  try {
    const categories = await categoryServices.categories();

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const category = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryServices.category(id);

    return res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, imageDeletId } = req.body;
    const file = req.file;
    const { id } = req.params;

    const catDelet = await categoryServices.updateCategory(
      id,
      name,
      imageDeletId,
      file,
    );

    res.status(200).json({
      success: true,
      message: "success update",
      catDelet,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryServices.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "success delete",
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
