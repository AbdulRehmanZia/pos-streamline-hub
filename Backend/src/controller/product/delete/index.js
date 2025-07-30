import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const productExist = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!productExist) {
      return ApiError(res, 404, null, "Product not found");
    }

    await prisma.product.delete({
      where: { id: Number(productId) },
    });

    return ApiResponse(res, 200, null, "Product successfully deleted");
  } catch (error) {
    console.error("Product Delete Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};
