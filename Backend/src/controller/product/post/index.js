import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, costPrice, stockQuantity, unit, categoryId } =
      req.body;

    if (
      !name ||
      !price ||
      !costPrice ||
      !stockQuantity ||
      !unit ||
      !categoryId
    ) {
      return ApiError(res, 400, null, "Please Fill The Required Fields");
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category) {
      return ApiError(res, 404, null, "Category not found");
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
        stockQuantity: parseInt(stockQuantity),
        unit,
        category: {
          connect: { id: Number(categoryId) },
        },
      },
    });

    return ApiResponse(res, 201, newProduct, "Product added successfully");
  } catch (error) {
    console.error("Error:", error);
    return ApiError(res, 403, null, "Product isn't added");
  }
};
