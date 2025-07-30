import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

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