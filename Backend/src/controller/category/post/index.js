import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Add Category
export const addCategory = async (req, res) => {
  try {
    let { name } = req.body;
    if (!name) return ApiError(res, 400, "Name Is Required");

    name = name.trim().toLowerCase();

    const existingCategory = await prisma.category.findFirst({
      where: { name },
    });

    if (existingCategory) {
      if (!existingCategory.isDeleted) {
        return ApiError(res, 400, "This Category Already Exists");
      } else {

        const restoredCategory = await prisma.category.update({
          where: { id: existingCategory.id },
          data: { isDeleted: false },
        });
        return ApiResponse(res, 200, restoredCategory, "Category Restored Successfully");
      }
    }

    const newCategory = await prisma.category.create({
      data: { name },
    });

    return ApiResponse(res, 201, newCategory, "Category Created Successfully");
  } catch (error) {
    console.error("Error in addCategory:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

