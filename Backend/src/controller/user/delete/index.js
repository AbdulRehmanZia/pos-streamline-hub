import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Delete User

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    ApiResponse(res, 200, null, "User Deleted Successfully");
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
