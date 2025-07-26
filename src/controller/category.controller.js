import prisma from "../db/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({include: {
    _count: {
      select: {
        products: true,
      },
    },
  },});
    if (!categories) return ApiError(res, 404, "Categories Not Found");
    return ApiResponse(res, 200, categories, "Categories Fetched Successfully");
  } catch (error) {
    console.error("Error in getCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//add Category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return ApiError(res, 400, "Name Is Required");

    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory)
      return ApiError(res, 400, "This Category Already Exists");

    const newCategory = await prisma.category.create({
      data: { name },
    });
    return ApiResponse(res, 201, newCategory, "Category Created Successfully");
  } catch (error) {
    console.error("Error in addCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//update category
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    if (!name) return ApiError(res, 400, "Name Is Required");
    const updatedCategory = await prisma.category.update({
      where: { id: Number(categoryId) },
      data: { name },
    });
    return ApiResponse(
      res,
      200,
      updatedCategory,
      "Category Updated Successfully"
    );
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//delete category
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await prisma.category.delete({
      where: { id: Number(categoryId) },
    });
    return ApiResponse(res, 200, null, "Category Deleted Successfully");
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
