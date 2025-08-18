import prisma from "../../../db/db.js";
import ApiError from "../../../utils/ApiError.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { sendEmail } from "../../../services/email.service.js";
import { generateEmailTemplate } from "../../../services/email.service.js";
import { registerMemberValidation } from "../../../utils/validationSchema.js";

//register Store Member
export const addStoreMember = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return ApiError(res, 403, "Only Admin Can Add Store Members");
    }
    const { error } = registerMemberValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);
    const { fullname, email, password } = req.body;
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
        role: "cashier",
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
