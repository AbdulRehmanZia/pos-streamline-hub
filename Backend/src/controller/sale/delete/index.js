import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Delete Sales
export const deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const saleExist = await prisma.sale.findUnique({
      where: { id: Number(saleId) },
    });

    if (!saleExist) {
      return ApiError(res, 404, null, "Sale not found");
    }

    // Use transaction to delete related records first
    await prisma.$transaction(async (tx) => {
      // First delete all related SaleItems
      await tx.saleItem.deleteMany({
        where: {
          saleId: Number(saleId)
        }
      });

      // Then delete the sale
      await tx.sale.delete({
        where: { 
          id: Number(saleId) 
        }
      });
    });

    return ApiResponse(res, 200, null, "Sale successfully deleted");
  } catch (error) {
    console.error("Sale Delete Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};