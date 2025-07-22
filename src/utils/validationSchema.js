import Joi from "joi";

export const registerValidation = Joi.object({
  fullname: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter valid email",
  }),
  password: Joi.string()
    .required()
    .min(6)
    .max(10)
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]{6,20}/
    ),
});
