import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

// //Create Sale
// export const addSale = async (req, res) => {
//   try {
//     const { paymentType, items, customerName, customerEmail, customerPhone } =
//       req.body;

//     if (!paymentType || !items || items.length === 0) {
//       return ApiError(res, 400, "Invalid Sale Data");
//     }

//     // const userId = req.user.id;
//     // if (!userId) return ApiError(res, 401, "Unauthorized");

//     let totalAmount = 0;

//     const sale = await prisma.$transaction(async (tx) => {
//       const saleItemData = await Promise.all(
//         items.map(async (item) => {
//           const product = await tx.product.findUnique({
//             where: { id: item.productId },
//           });

//           if (!product)
//             throw new Error(`Product not found with ID ${item.productId}`);
//           if (product.stockQuantity < item.quantity)
//             throw new Error(`Insufficient stock for ${product.name}`);

//           const subTotal = product.price * item.quantity;
//           totalAmount += subTotal;

//           await tx.product.update({
//             where: { id: item.productId },
//             data: {
//               stockQuantity: {
//                 decrement: item.quantity,
//               },
//             },
//           });

//           return {
//             productId: item.productId,
//             quantity: item.quantity,
//             priceAtSale: product.price,
//           };
//         })
//       );

//       return await tx.sale.create({
//         data: {
//           // userId,
//           paymentType,
//           totalAmount,
//           customerName,
//           customerEmail,
//           customerPhone,
//           saleItems: {
//             create: saleItemData,
//           },
//         },
//         include: {
//           saleItems: {
//             include: {
//               product: true,
//             },
//           },
//         },
//       });
//     });

//     return ApiResponse(res, 201, sale, "Sale Generated Successfully");
//   } catch (error) {
//     console.error("Sale creation error:", error);
//     return ApiError(res, 500, error.message || "Internal Server Error");
//   }
// };

export const addSale = async (req, res) => {
  try {
    const { paymentType, items, customerName, customerEmail, customerPhone } =
      req.body;

    //  Basic in-memory validation (cheap)
    if (!paymentType || !Array.isArray(items) || items.length === 0) {
      return ApiError(res, 400, "Invalid Sale Data");
    }

    for (const i of items) {
      if (!i.productId || i.quantity <= 0) {
        return ApiError(res, 400, "Invalid product data in items");
      }
    }

    const productIds = items.map((i) => i.productId);

    const sale = await prisma.$transaction(async (tx) => {
      // Fetch all products in one query
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true, stockQuantity: true, name: true },
      });

      if (products.length !== productIds.length) {
        throw new Error("Some products are missing or deleted");
      }

      //  Validate stock and prepare data
      const productMap = new Map(products.map((p) => [p.id, p]));
      let totalAmount = 0;
      const saleItemData = [];

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
        totalAmount += product.price * item.quantity;
        saleItemData.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtSale: product.price,
        });
      }

      //  Bulk stock update — all in one query
      await Promise.all(
        items.map((item) =>
          tx.product.updateMany({
            where: {
              id: item.productId,
              stockQuantity: { gte: item.quantity },
            },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          })
        )
      );

      //  Create sale & items in one go
      return await tx.sale.create({
        data: {
          paymentType,
          totalAmount,
          customerName,
          customerEmail,
          customerPhone,
          saleItems: { create: saleItemData },
          user: {
            connect: {
              id: req.user.id, // Assuming you have user info in request
            },
          },
        },
        include: {
          saleItems: { include: { product: true } },
        },
      });
    });

    return ApiResponse(res, 201, sale, "Sale Generated Successfully");
  } catch (error) {
    console.error("Sale creation error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};
