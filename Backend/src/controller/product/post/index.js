import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    let { name, price, costPrice, stockQuantity, unit, categoryId, barcode } = req.body;

    if (!name || !price || !costPrice || !stockQuantity || !unit || !categoryId) {
      return ApiError(res, 400, null, "Please Fill The Required Fields");
    }

    // Normalize product name
    let productName = name.trim().toLowerCase().replace(/\s+/g, " ");

    // Check category exists & is active
    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category || category.isDeleted) {
      return ApiError(res, 404, null, "Category not found or deleted");
    }

    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { name: productName },
    });

    if (existingProduct) {
      if (!existingProduct.isDeleted) {
        return ApiError(res, 400, "This Product Already Exists");
      } else {
        // Restore product
        const restoredProduct = await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            isDeleted: false,
            price: parseFloat(price),
            costPrice: parseFloat(costPrice),
            stockQuantity: parseInt(stockQuantity),
            unit,
            category: { connect: { id: Number(categoryId) } },
          },
        });
        return ApiResponse(res, 200, restoredProduct, "Product Restored Successfully");
      }
    }

    // Otherwise, create new product
    const newProduct = await prisma.product.create({
      data: {
        name: productName,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stockQuantity: parseInt(stockQuantity),
        unit,
        category: { connect: { id: Number(categoryId) } },
      },
    });

    return ApiResponse(res, 201, newProduct, "Product added successfully");
  } catch (error) {
    console.error("Error in addProduct:", error);
    return ApiError(res, 500, null, "Internal Server Error");
  }
};
