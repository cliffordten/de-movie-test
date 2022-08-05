import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "username is too short!")
    .max(15, "username is too long!")
    .required("username is equired"),
  password: Yup.string()
    .min(8, "password should be atlease 8 characters!")
    .required("password is required"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "passwords must match"
  ),
  email: Yup.string().email("invalid email").required("email is required"),
});

export const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "password should be atlease 8 characters!")
    .required("password is required"),
  email: Yup.string().email("invalid email").required("email is required"),
});
