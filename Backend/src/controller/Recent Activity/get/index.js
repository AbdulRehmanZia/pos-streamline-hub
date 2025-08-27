//  All Recent Activities Queries
import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
export const RecentActivity = async (req, res) => {
  try {
    const fifteenMinuteAgo = new Date(Date.now() - 15 * 60 * 1000);
    // const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    // const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [users, sales, categories] = await Promise.all([
      //  User Recent Activity
      prisma.user.findMany({
        where: {
          OR: [
            { createdAt: { gte: fifteenMinuteAgo } },
            { updatedAt: { gte: fifteenMinuteAgo } },
          ],
        },
        select: {
          fullname: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),

      // Sales Recent Activity
      prisma.sale.findMany({
        where: {
          OR: [
            { createdAt: { gte: fifteenMinuteAgo } },
            { updatedAt: { gte: fifteenMinuteAgo } },
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
        orderBy: {
          createdAt: "desc",
        },
      }),

      // Categor Recent Activity
      prisma.category.findMany({
        where: {
          isDeleted: false, // works only if Boolean field hai
          OR: [
            { createdAt: { gte: fifteenMinuteAgo } },
            { updatedAt: { gte: fifteenMinuteAgo  } },
          ],
        },
        include: {
          products: true,
        },
      }),
    ]);

    const AllActivitie = { users, sales, categories };
    ApiResponse(res, 200, AllActivitie, "All Activities fetch successfuly");
  } catch (error) {
    console.error(error);
    ApiError(res, 500, error.messege, "Fetching Error");
  }
};
