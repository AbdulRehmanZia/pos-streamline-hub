import prisma from "../db/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

//Create Sale
export const addSale = async (req, res) => {
  try {
    const { paymentType, items, customerName, customerEmail, customerPhone } =
      req.body;

    if (!paymentType || !items || items.length === 0) {
      return ApiError(res, 400, "Invalid Sale Data");
    }

    const userId = req.user.id;
    if (!userId) return ApiError(res, 401, "Unauthorized");

    let totalAmount = 0;

    const sale = await prisma.$transaction(async (tx) => {
      const saleItemData = await Promise.all(
        items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product)
            throw new Error(`Product not found with ID ${item.productId}`);
          if (product.stockQuantity < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);

          const subTotal = product.price * item.quantity;
          totalAmount += subTotal;

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });

          return {
            productId: item.productId,
            quantity: item.quantity,
            priceAtSale: product.price,
          };
        })
      );

      return await tx.sale.create({
        data: {
          userId,
          paymentType,
          totalAmount,
          customerName,
          customerEmail,
          customerPhone,
          saleItems: {
            create: saleItemData,
          },
        },
        include: {
          saleItems: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    return ApiResponse(res, 201, sale, "Sale Generated Successfully");
  } catch (error) {
    console.error("Sale creation error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};

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

    await prisma.sale.delete({
      where: { id: Number(saleId) },
    });

    return ApiResponse(res, 200, null, "Sale successfully deleted");
  } catch (error) {
    console.error("Sale Delete Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};
