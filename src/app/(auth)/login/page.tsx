"use client";

import Link from "next/link";
import React, { FormEvent, useState } from "react";
import Image from "next/image";
import BgMain from "../../../../public/img/bg-main.jpeg";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { LoginAuth } from "@/app/types/blogTypes";
import { RootState } from "@/app/store/store";
import { loginUser } from "@/app/helpers/authHelpers";
import { validateEmail } from "@/app/helpers/Regex";
import { toast } from "react-toastify";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { PiSpinnerGapBold } from "react-icons/pi";
import { $api } from "@/app/services";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const email = useSelector((state: RootState) => state.Auth.email);
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);
  const [passwordBlur, setPasswordBlur] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loginForm, setLoginForm] = useState<LoginAuth>({
    email: email || "",
    password: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setLoginForm({ ...loginForm, [id]: value });
  };
  const isFormValid = () => {
    return validateEmail(loginForm.email) && loginForm.password;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTriedToSubmit(true);
    setIsLoading(true);

    console.log(loginForm);
    if (isFormValid()) {
      try {
        const response = await loginUser(loginForm, dispatch);
        if ($api.isSuccessful(response)) {
          router.push("/home");
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      toast.error("Form Submission error");
      setIsLoading(false);
    }
  };
  return (
    <div className={`bg-white h-screen flex  bg-cover`}>
      <div className="w-1/2 max-[1100px]:hidden relative flex justify-center items-center">
        <Image
          src={BgMain}
          alt=""
          className="object-cover h-full w-full max-h-screen"
        />
        <h5 className="absolute top-[50%]  text-6xl font-bold text-white">
          DJS CONSULTING BLOG
        </h5>
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <div className=" max-[1100px]:inline-block hidden relative  bg-gradient-to-r from-purple-300 via-blue-400 to-black text-transparent text-center  font-extrabold bg-clip-text">
            <h5 className=" text-5xl mt-4 font-bold text-center">
              DJS CONSULTING BLOG
            </h5>
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={loginForm.email.trim()}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className={`block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 ${
                    triedToSubmit &&
                    !validateEmail(loginForm.email) &&
                    "!border-red-600 !border-2"
                  }`}
                />
              </div>
              {triedToSubmit && !validateEmail(loginForm.email) && (
                <div className="flex items-center gap-2 mt-2">
                  <LiaInfoCircleSolid color="#ef4444" />
                  <h4 className="text-xs text-red-600">
                    valid email is required!
                  </h4>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={passwordBlur ? "password" : "text"}
                  value={loginForm.password.trim()}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className={`block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 ${
                    triedToSubmit &&
                    !loginForm.password &&
                    "!border-red-600 !border-2"
                  }`}
                />
                <div
                  className="cursor-pointer absolute bottom-[30%] right-[5%]"
                  onClick={() => setPasswordBlur(!passwordBlur)}
                >
                  {passwordBlur ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
              {triedToSubmit && !loginForm.password && (
                <div className="flex items-center gap-2 mt-2">
                  <LiaInfoCircleSolid color="#ef4444" />
                  <h4 className="text-xs text-red-600">
                    password is required!
                  </h4>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                disabled={isLoading}
                className="flex w-[50%] justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? (
                  <PiSpinnerGapBold className="animate-spin text-lg" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not Registered?{" "}
            <Link
              href="/sign-up"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
