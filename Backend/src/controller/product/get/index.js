import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Get All Products
export const getAllProducts = async (req, res) => {
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  
  if (page < 1) page = 1;
  if (limit <= 0 || limit > 100) limit = 10;
  const skip = (page - 1) * limit;

  try {
    const whereClause = {
      isDeleted: false, 
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    const allProduct = await prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    const totalProducts = await prisma.product.count({ where: whereClause });
    const totalPages = Math.ceil(totalProducts / limit);

    return ApiResponse(
      res,
      200,
      allProduct,
      "All Products retrieved successfully",
      { totalPages, currentPage: page, limit }
    );
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
