import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await prisma.product.findMany({
      include: { category: true },
    });

    return ApiResponse(
      res,
      200,
      allProduct,
      "All Products retrieved successfully"
    );
  } catch (error) {
    return ApiError(res, 500, error, "Internal Server Error");
  }
};
