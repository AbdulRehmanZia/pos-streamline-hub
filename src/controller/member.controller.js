import prisma from "../db/db.js";
import { generateEmailTemplate, sendEmail } from "../services/email.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerMemberValidation } from "../utils/validationSchema.js";

//get All Store Members

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

//register Store Member
export const addStoreMember = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return ApiError(res, 403, "Only Admin Can Add Store Members");
    }
    const { error } = registerMemberValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);
    const { fullname, email, password, role } = req.body;
    const findMember = await prisma.user.findUnique({
      where: { email },
    });
    if (findMember)
      return ApiError(res, 400, "User With This Email Already Exists");
    const newMember = await prisma.user.create({
      data: {
        fullname,
        email,
        password,
        role,
      },
    });
    const createdMember = await prisma.user.findUnique({
      where: { id: newMember.id },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
      },
    });

    if (!createdMember)
      return ApiError(
        res,
        400,
        null,
        "Something Went Wrong While Registering The User"
      );

    await sendEmail({
  to: email,
  subject: "🎉 Welcome to POS!",
  message: generateEmailTemplate({
    message: `
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Welcome to our POS system! Your account has been successfully created.</p>
      <p><strong>Email:</strong> ${email}<br />
      <strong>Password:</strong> ${password}</p>
      <p>Please keep this information safe.</p>
    `,
  }),
});


    return ApiResponse(
      res,
      201,
      createdMember,
      "Store Member Added Successfully"
    );
  } catch (error) {
    console.log("Error in registerTeamMember", error);
    return ApiError(res, 500, "Internal Server Error");
  }
};

//update Store Member

export const updateStoreMember = async (req, res) => {
  try {
    const userId = req.params.id;

    const { fullname, email, password, role } = req.body;
    const updatedData = {};
    if (fullname !== undefined) updatedData.fullname = fullname;
    if (email !== undefined) updatedData.email = email;
    if (password !== undefined) updatedData.password = password;
    if (role != undefined) updatedData.role = role;

    if (Object.keys(updatedData).length === 0) {
      return ApiError(res, 400, "No valid fields provided for update");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: updatedData,
      select: {
        fullname: true,
        email: true,
        role: true,
      },
    });

    return ApiResponse(res, 200, updatedUser, "User Updated Successfully");
  } catch (error) {
    console.error("Error in updateMember:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

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
