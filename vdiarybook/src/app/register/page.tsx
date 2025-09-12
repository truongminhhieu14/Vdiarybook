"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { IRegister } from "@/types/auth.type";
import authApi from "@/services/auth.service";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { isUnprocessableEntity } from "@/utils/checkAxiosError";
import { ErrorResponse } from "@/types/response";
import { validateSignUp } from "../../validations/auth.validation"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IRegister>({
    resolver: yupResolver(validateSignUp), mode: 'onChange'
  });

  const onSubmit = async (data: IRegister) => {
    try {
      const res = await authApi.signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

        toast.success(res.data.message);
        router.push("/login");
    } catch (error: unknown) {
      if (isUnprocessableEntity<ErrorResponse>(error)) {
      const formError = error.response?.data;
      if (formError?.errors) {
        Object.keys(formError.errors).forEach((key) => {
          const message = (formError.errors![key] as any).msg;
          setError(key as keyof IRegister, { message });
        });
      } else {
        toast.error(formError?.message);
      }
    } else {
      toast.error("Register error");
    }
    }
  };

  return (
    <section className="bg-slate-100" id="register">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <img src="/assets/img/signin.gif" alt="login icon" />
          </div>

          <form
            className="pt-6 flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >

            <div className="grid">
              <label>Name:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  {...register("name")}
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="grid">
              <label>Email:</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  {...register("email")}
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid">
              <label>Password:</label>
              <div className="bg-slate-100 p-2 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter password"
                />
                <div
                  className="cursor-pointer text-xl ml-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            <div className="grid">
              <label>Confirm Password:</label>
              <div className="bg-slate-100 p-2 flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="w-full outline-none bg-transparent"
                  placeholder="Enter confirm password"
                />
                <div
                  className="cursor-pointer text-xl ml-2"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-slate-950 hover:bg-slate-800 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:opacity-50"
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="my-5 text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
