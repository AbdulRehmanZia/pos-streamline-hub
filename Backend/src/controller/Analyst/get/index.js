import prisma from "../../../db/db.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export const AllAnalyst = async (req, res) => {
  try {
    const totalMembers = await prisma.user.count();

    const totalProducts = await prisma.product.count();

    const totalSaleItems = await prisma.saleItem.count();

    const totalSalesAmount = await prisma.sale.aggregate({
      _sum: { totalAmount: true },
    });

    const categoryWiseProductCount = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    // Response object
    const Summary = {
      totalMembers,
      totalProducts,
      totalSaleItems,
      totalSalesAmount: totalSalesAmount._sum.totalAmount || 0,
      categoryWiseProductCount,
    };

    return ApiResponse(res, 200, Summary, "Summary Fetched Successfully");
  } catch (error) {
    console.log(error)
  }
}
