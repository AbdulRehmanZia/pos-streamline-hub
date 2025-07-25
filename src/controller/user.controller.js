import prisma from "../db/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginValidation,
  registerValidation,
} from "../utils/validationSchema.js";
import {
  generateRefreshToken,
  generateAccessToken,
} from "../services/jwt.service.js";
import { sendEmail,generateEmailTemplate } from "../services/email.service.js";

//Get Users

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    return ApiResponse(res, 200, users, "Users Fetched Successfully");
  } catch (error) {
    console.error("Error in getUsers:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//Create User
export const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);

    const { fullname, email, password, role } = req.body;
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser)
      return ApiError(res, 400, "User With This Email Already Exists");

    const newUser = await prisma.user.create({
      data: { fullname, email, password, role },
    });

    const createdUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      select: { id: true, fullname: true, email: true, role: true },
    });

    if (!createdUser)
      return ApiError(
        res,
        500,
        "Something Went Wrong While Registering The User"
      );
    console.log("Calling sendEmail...");

    //   await sendEmail(
    //     email,
    //     "Welcome to POS 🎉",
    //     `
    //   <div style="font-family: sans-serif; line-height: 1.5">
    //     <h2>Hi ${fullname},</h2>
    //     <p>Your account has been created successfully.</p>
    //     <h4>🔐 Login Credentials:</h4>
    //     <p><strong>Email:</strong> ${email}<br/>
    //     <strong>Password:</strong> ${password}</p>
    //     <p>Please keep this information safe.</p>
    //     <br/>
    //     <p>Thanks,<br/>POS Team</p>
    //   </div>
    // `
    //   );

    // await sendMail({
    //   to: email,
    //   subject: "🎉 Welcome to POS",
    //   message: `
    //     <p>Hi <strong>${fullname}</strong>,</p>
    //     <p>Your account has been created successfully.</p>
    //     <p><strong>Email:</strong> ${email}<br/>
    //     <strong>Password:</strong> ${password}</p>
    //     <p>Keep your credentials secure!</p>
    //     <p>Thanks,<br/>POS Team</p>
    //   `,
    // });

    await sendEmail(
  email,
  "🎉 Welcome to SnapFreez!",
  generateEmailTemplate({
    message: `
      <p>Hi <strong>${fullname}</strong>,</p>
      <p>Welcome to SnapFreez! Your account has been created successfully.</p>
      <p><strong>Email:</strong> ${email}<br/>
      <strong>Password:</strong> ${password}</p>
      <p>We're glad to have you on board! 🚀</p>
    `,
  })
);

    return ApiResponse(res, 201, createdUser, "User Created Successfully");
  } catch (error) {
    console.error("Error in registerUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//Login User

export const loginUser = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);

    const { email, password } = req.body;
    if (!email && !password) {
      return ApiError(res, 400, "Please Enter Both Email and Password");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return ApiError(res, 404, "User Does Not Exist");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return ApiError(res, 401, "In-valid Credentials");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const loggedInUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        fullname: true,
        email: true,
      },
    });

    if (!loggedInUser)
      return ApiError(res, 500, "Something Went Wrong While Logging The User");

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);
    return ApiResponse(
      res,
      201,
      { user: loggedInUser, accessToken, refreshToken },
      "User Logged In Successfully"
    );
  } catch (error) {
    console.error("Error in loginUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

//Logout User

export const logoutUser = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
    return ApiResponse(res, 200, null, "User Logged Out Successfully");
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

// Update User
export const updateUser = async (req, res) => {
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
    console.error("Error in updateUser:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};

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

//Refresh Access Token

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken)
      return ApiError(res, 401, "Unauthorized Request");

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
    });
    if (!user) return ApiError(res, 401, "Invalid Refresh Token");

    if (incomingRefreshToken !== user.refreshToken)
      return ApiError(res, 401, "Refresh Token Is Expired Or Used");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", newRefreshToken, options);
    return ApiResponse(
      res,
      201,
      { accessToken, newRefreshToken },
      "Access Refreshed Token"
    );
  } catch (error) {
    console.error("Error in New Refresh Token:", error);
    return ApiError(res, 500, "Internal Server Error", error);
  }
};
