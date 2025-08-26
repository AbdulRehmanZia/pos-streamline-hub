import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import moment from "moment"; 


//   All Analyst Query

export const AllAnalyst = async (req, res) => {
  try {
    const totalMembers = await prisma.user.count();

    const totalProducts = await prisma.product.count();

    const totalSaleItems = await prisma.saleItem.count()
    const totalSalesAmount =await prisma.sale.aggregate({
      _sum:{totalAmount:true}
    })
    const categoryWiseProductCount = await prisma.category.findMany({
      where:{
        isDeleted:false
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

  
    
    const groupedSales = await prisma.sale.groupBy({
      by:["createdAt"],
      _sum:{totalAmount:true},
      orderBy:{createdAt:"asc"}
    })

    const dailySales = groupedSales.reduce((acc, item) => {
  const dateOnly = moment(item.createdAt).format("DD-MM-YYYY");
  if (!acc[dateOnly]) {
    acc[dateOnly] = 0;
  }
  acc[dateOnly] += item._sum.totalAmount || 0;
  return acc;
}, {});
    // Response object
    const Summary = {
      totalMembers,
      totalProducts,
      totalSaleItems,
      totalSalesAmount:totalSalesAmount._sum.totalAmount || 0,
      dailySales,
      categoryWiseProductCount,
    };

    return ApiResponse(res, 200, Summary, "Summary Fetched Successfully");
  } catch (error) {
        ApiError(res, 500, error.messege, "Fetching Error");
    console.log(error);
  }
};

