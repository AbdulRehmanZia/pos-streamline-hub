import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

// Delete Store Member
export const deleteStoreMember = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const userExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExist) {
      return ApiError(res, 404, null, "User not found");
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    });

    return ApiResponse(res, 200, null, "Member Deleted Successfully");
  } catch (error) {
    console.error("Error in deleteStoreMember:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
