import * as yup from 'yup';

export const validateSignUp = yup.object({
  name: yup.string()
    .required("Name is required")
    .min(1, "Name must be at least 1 character")
    .max(20, "Name must be at most 20 characters"),
  email: yup.string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  confirmPassword: yup.string()
    .required("Please confirm your password")
    .oneOf([yup.ref('password')], "Passwords do not match")
}).required();

export const validateSignIn = yup.object({
    email: yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
}).required();