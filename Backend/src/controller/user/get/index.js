import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Get all Users

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
      },
       orderBy: {
        createdAt: 'desc', // Newest first
      },
    });
    return ApiResponse(res, 200, users, "Users Fetched Successfully");
  } catch (error) {
    console.error("Error in getUsers:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};