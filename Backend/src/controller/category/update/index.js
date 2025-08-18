import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//update category
export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    if (!name) return ApiError(res, 400, "Name Is Required");
    const normalizedName = name.trim().toLowerCase();
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: normalizedName,
        NOT: { id: Number(req.params.id) },
      },
    });

    if (existingCategory)
      return ApiError(res, 400, "This Category Already Exists");
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
