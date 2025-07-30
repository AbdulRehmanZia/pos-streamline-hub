import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Delete category
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
