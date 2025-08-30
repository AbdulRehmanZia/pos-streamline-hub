import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

export const createStore = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return ApiError(res, 400, "Store name is required");
    }

    const store = await prisma.store.create({
      data: {
        name,
        ownerId: userId,
        members: {
          connect: { id: userId }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    return ApiResponse(res, 201, store, "Store created successfully");
  } catch (error) {
    console.error("Error in createStore:", error);
    return ApiError(res, 500, "Internal Server Error");
  }
};