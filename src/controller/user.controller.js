import prisma from "../db/db.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerValidation } from "../utils/validationSchema.js";

//Get Users

export const getUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({});
    return res.json({ status: 200, data: users });
  } catch (error) {
    console.log("Error: ", error);
  }
};

//Create User
export const registerUser = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);

    const { fullname, email, password } = req.body;
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (findUser) return ApiError(res, 400, "User with this email already exists");

    const newUser = await prisma.user.create({
      data: { fullname, email, password },
    });

    const createdUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      select: { id: true, fullname: true, email: true },
    });

    if (!createdUser)
      return ApiError(
        res,
        500,
        "Something went wrong while registering the user"
      );
    return ApiResponse(res, 201, createdUser, "User created successfully");
  } catch (error) {
    console.log("Error: ", error);
  }
};

//Update User

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { error } = registerValidation.validate(req.body);
    if (error) return ApiError(res, 400, error.details[0].message);
    const { fullname, email, password } = req.body;
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        fullname, email, password
      },
    });

    return ApiResponse(res, 200, "User updated successfully")
  } catch (error) {
    console.log("Error: ", error);
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
    await ApiResponse(res, 200, "User Deleted Successfully")
  } catch (error) {
    console.log("Error: ", error);
  }
};
