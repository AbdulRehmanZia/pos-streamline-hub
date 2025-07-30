import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";

//Delete Store Member

export const deleteStoreMember = async (req, res) => {
  try {
    const userId = req.params.id;
    await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    return ApiResponse(res, 200, null, "Member Deleted Successfully");
  } catch (error) {
    console.error("Error in deleteStoreMember:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
