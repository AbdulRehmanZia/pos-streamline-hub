import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Add Category
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
