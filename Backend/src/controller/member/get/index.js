import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Get All Members
export const getAllStoreMembers = async (req, res) => {
  try {
    const allMembers = await prisma.user.findMany({});
    return ApiResponse(
      res,
      200,
      allMembers,
      "All Members Fetched Successfully"
    );
  } catch (error) {
    console.log("Error in getAllStoreMembers");
    return ApiError(res, 500, "Internal Server Error");
  }
};