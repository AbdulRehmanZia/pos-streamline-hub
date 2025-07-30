import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//get All Sales
export const getAllSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return ApiResponse(res, 200, sales, "Sales Fetched Successfully");
  } catch (error) {
    console.error("Error in getAllSales", error);
    return ApiError(res, 500, "Internal Server Error");
  }
};
