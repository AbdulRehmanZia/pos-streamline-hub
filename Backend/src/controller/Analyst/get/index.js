import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//   All Analyst Query

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
    console.log(error);
  }
};

//  All Recent Activities Queries

export const RecentActivity = async (req, res) => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const [users, sales, categories] = await Promise.all([
      //  User Recent Activity
      prisma.user.findMany({
        where: {
          OR: [
            { createdAt: { gte: fifteenMinutesAgo } },
            { updatedAt: { gte: fifteenMinutesAgo } },
          ],
        },
        select: {
          fullname: true,
          email: true,
          role: true,
        },
      }),

      // Sales Recent Activity
      prisma.sale.findMany({
        where: {
          OR: [
            { createdAt: { gte: fifteenMinutesAgo } },
            { updatedAt: { gte: fifteenMinutesAgo } },
          ],
        },
        include: {
          saleItems: {
            select: {
              quantity: true,
               product: {
                 select: {
                  name: true,
                  price: true,
                  stockQuantity: true,
                },
              },
            },
          },
        },
        orderBy:{
          createdAt:'desc'
        }
      }),

      // Categor Recent Activity
      prisma.category.findMany({
        where: {
          OR: [
            { createdAt: { gte: fifteenMinutesAgo } },
            { updatedAt: { gte: fifteenMinutesAgo } },
          ],
        },
        include: { products:true
          // {select:{name:true}}
         }
          ,
      }),
    ]);

    const AllActivitie = { users, sales, categories };
    ApiResponse(res, 200, AllActivitie, "All Activities fetch successfuly");
  } catch (error) {
    console.error(error);
    ApiError(res, 500, error.messege, "Fetching Error");
  }
};
