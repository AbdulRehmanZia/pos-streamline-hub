import prisma from "../db/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//Add Product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      costPrice,
      stockQuantity,
      unit,
      categoryId,
    } = req.body;

    if (!name || !price || !costPrice || !stockQuantity || !unit || !categoryId) {
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

//Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const allProduct = await prisma.product.findMany({
      include: { category: true }, // Include category info
    });

    return ApiResponse(res, 200, allProduct, "All Products retrieved successfully");
  } catch (error) {
    return ApiError(res, 400, error, "Internal Server Error");
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const productExist = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!productExist) {
      return ApiError(res, 404, null, "Product not found");
    }

    await prisma.product.delete({
      where: { id: Number(productId) },
    });

    return ApiResponse(res, 200, null, "Product successfully deleted");
  } catch (error) {
    console.error("Delete Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};

//Update Product
export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      costPrice,
      stockQuantity,
      unit,
      categoryId,
    } = req.body;

    const productId = req.params.id;

    const productExist = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });

    if (!productExist) {
      return ApiError(res, 404, null, "Product not found");
    }

    const updatedData = {
      name,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      stockQuantity: parseInt(stockQuantity),
      unit,
    };

    
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
      });

      if (!category) {
        return ApiError(res, 404, null, "Category not found");
      }

      updatedData.category = {
        connect: { id: Number(categoryId) },
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: updatedData,
    });

    return ApiResponse(res, 200, updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Update Error:", error);
    return ApiError(res, 500, error.message || "Internal Server Error");
  }
};
