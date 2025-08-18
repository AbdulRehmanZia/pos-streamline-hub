import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

// Delete Sale (soft delete)
export const deleteSale = async (req, res) => {
  try {
    const saleId = req.params.id;
    const saleExist = await prisma.sale.findUnique({
      where: { id: Number(saleId) },
    });

    if (!saleExist) {
      return ApiError(res, 404, null, "Sale not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.saleItem.updateMany({
        where: { saleId: Number(saleId) },
        data: { isDeleted: true },
      });

      await tx.sale.update({
        where: { id: Number(saleId) },
        data: { isDeleted: true },
      });
    });

    return ApiResponse(res, 200, null, "Sale successfully deleted (soft)");
  } catch (error) {
    console.error("Sale Delete Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};
