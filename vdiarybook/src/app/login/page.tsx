"use client";

import { AppContext } from "@/context/app.context";
import authApi from "@/services/auth.service";
import { setUser as setReduxUser } from "@/store/authSlice";
import { setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage, setUserIdToLocalStorage } from "@/utils/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { validateSignIn } from "@/validations/auth.validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ILogin } from "@/types/auth.type";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated, setUser } = useContext(AppContext)
  const router = useRouter();
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: {errors, isSubmitting}} = useForm<ILogin>({
    resolver: yupResolver(validateSignIn), mode: "onChange"
  })

  const onSubmit = async (data: ILogin) => {
    try {
      const res = await authApi.signIn(data);
      const dataApi = res.data;
      const userData = dataApi.metadata.user;
      if (dataApi?.success && dataApi?.metadata) {
        toast.success(dataApi.message);    
        setAccessTokenToLocalStorage(dataApi.metadata.accessToken);
        setRefreshTokenToLocalStorage(dataApi.metadata.refreshToken);
        setUserIdToLocalStorage(dataApi.metadata.user.id);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");
        dispatch(setReduxUser(userData));
        setIsAuthenticated(true)
        setUser(userData)
        router.push("/");
      } else {
        toast.error(dataApi.message || "Login failed");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed (server)";
      toast.error(message);
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4 bg-slate-100">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src="/assets/img/signin.gif" alt="login icon" />
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid">
              <label>Email</label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  {...register("email")}
                  name="email"
                  placeholder="Nhập email"
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="grid">
              <label>Password</label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  name="password"
                  placeholder="Nhập password"
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
              <Link
                href={"/forgot-password"}
                className="block w-fit ml-auto hover:underline hover:text-red-600"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-slate-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
            >
              Login
            </button>
          </form>

          <p className="my-5">
            Don't have an account?{" "}
            <Link
              href={"/register"}
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
