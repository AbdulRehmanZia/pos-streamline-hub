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

// Query - Search Sales
export const saleSearch = async (req, res) => {
  try {
    const { q: name, startDate, endDate, customerName, paymentType, category } = req.query;

    // At least one filter is required
    if (!name && (!startDate || !endDate) && !customerName && !paymentType && !category) {
      return ApiError(res, 400, null, "Provide at least one filter");
    }

    let whereClause = {};

    // Product Name
    if (name) {
      whereClause.product = {
        ...whereClause.product,
        name: {
          contains: name,
          mode: "insensitive",
        }
      };
    }

    // Date Range
    if (startDate && endDate) {
      if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
        return ApiError(res, 400, null, "Invalid date format");
      }

      whereClause.sale = {
        ...whereClause.sale,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
        }
      };
    }

    // Customer Name
    if (customerName) {
      whereClause.sale = {
        ...whereClause.sale,
        customerName: {
          contains: customerName,
          mode: "insensitive"
        }
      };
    }

    // Payment Type
    if (paymentType) {
      whereClause.sale = {
        ...whereClause.sale,
        paymentType
      };
    }

    //  Product Category 
    if (category) {
      whereClause.product = {
        ...whereClause.product,
        category: {
          equals: category,
          mode: "insensitive"
        }
      };
    }

    //Execute Query
    const sales = await prisma.saleItem.findMany({
      where: whereClause,
      include: {
        sale: true,
        product: true // include full product info
      }
    });

    return ApiResponse(res, 200, sales, "Search successful");

  } catch (error) {
    console.error("Search error:", error);
    return ApiError(res, 500, null, "Internal server error");
  }
};
