"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import BgMain from "../../../../public/img/bg-main.jpeg";
import profile from "../../../../public/img/default-applicant.png";
import axios from "axios";
import { $api } from "@/app/services";
import { UserAuth } from "@/app/types/blogTypes";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { validateEmail, validatePassword } from "@/app/helpers/Regex";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { registerUser } from "@/app/helpers/authHelpers";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { PiSpinnerGapBold } from "react-icons/pi";

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [uploadingCoverImage, setUploadingCoverImage] =
    useState<boolean>(false);
  const [coverImageName, setCoverImageName] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);
  const [passwordBlur, setPasswordBlur] = useState<boolean>(true);
  const [confirmPasswordBlur, setConfirmPasswordBlur] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [signUpForm, setSignUpForm] = useState<UserAuth>({
    email: "",
    password: "",
    profileUrl: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setSignUpForm({ ...signUpForm, [id]: value });
  };

  const handleFileUpload = async (files: FileList | "") => {
    if (files?.length > 0) {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("upload_preset", "djs-blog");
      formData.append("cloud_name", "dtgaovjxc");
      try {
        setUploadingCoverImage(true);
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dtgaovjxc/image/upload",
          formData
        );
        if ($api.isSuccessful(response)) {
          setCoverImageUrl(response?.data?.secure_url);
          console.log(response?.data?.secure_url);
          setCoverImageName(response?.data?.original_filename);
          setSignUpForm({
            ...signUpForm,
            profileUrl: response?.data?.secure_url,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setUploadingCoverImage(false);
      }
    }
  };
  const isFormValid = () => {
    return (
      validateEmail(signUpForm.email) &&
      validatePassword(signUpForm.password) &&
      signUpForm.password === confirmPassword &&
      signUpForm.profileUrl
    );
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setTriedToSubmit(true);
    e.preventDefault();
    setIsLoading(true);
    console.log(signUpForm);
    if (isFormValid()) {
      try {
        const response = await registerUser(signUpForm, dispatch);
        console.log(response);
        if ($api.isSuccessful(response)) {
          router.push("/login");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    } else {
      toast.error("Form Submission error");
      setIsLoading(false);
      return;
    }
  };
  return (
    <div className="bg-white h-screen flex bg-cover">
      <div className="w-1/2 max-[1100px]:hidden relative flex justify-center items-center">
        <Image
          src={BgMain}
          alt="djs-consult"
          className="object-cover h-full w-full max-h-screen"
        />
        <h5 className="absolute top-[50%]  text-6xl font-bold text-white">
          DJS CONSULTING BLOG
        </h5>
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <div className=" max-[1100px]:flex hidden relative  bg-gradient-to-r from-purple-300 via-blue-400 to-black text-transparent  items-center justify-center  font-extrabold bg-clip-text">
            <h5 className=" text-3xl mt-4 font-bold text-center">
              DJS CONSULTING BLOG
            </h5>
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register as an admin
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
            <div
              className={`mx-auto text-center relative w-40 ${
                triedToSubmit &&
                !coverImageUrl &&
                "border-red-600 border-2 rounded-full"
              }`}
            >
              <Image
                className="w-40 h-40 object-contain rounded-full"
                src={coverImageUrl || profile}
                alt="Profile"
                width={160}
                height={160}
                priority
              />

              {uploadingCoverImage ? (
                <div className="w-40 h-40 group bg-gray-200 opacity-60 rounded-full absolute top-0 left-0 flex justify-center items-center cursor-not-allowed transition duration-500">
                  <svg
                    viewBox="0 0 256 256"
                    xmlns="http://www.w3.org/2000/svg"
                    height="50"
                    width="50"
                    className="animate-spin"
                  >
                    <rect fill="none" height="25" width="25" />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="128"
                      x2="128"
                      y1="32"
                      y2="64"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="224"
                      x2="192"
                      y1="128"
                      y2="128"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="195.9"
                      x2="173.3"
                      y1="195.9"
                      y2="173.3"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="128"
                      x2="128"
                      y1="224"
                      y2="192"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="60.1"
                      x2="82.7"
                      y1="195.9"
                      y2="173.3"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="32"
                      x2="64"
                      y1="128"
                      y2="128"
                    />
                    <line
                      fill="none"
                      stroke="#000"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="8"
                      x1="60.1"
                      x2="82.7"
                      y1="60.1"
                      y2="82.7"
                    />
                  </svg>
                </div>
              ) : (
                <label
                  htmlFor="file"
                  className="w-40 h-40 group hover:bg-gray-200 opacity-0 hover:opacity-60 rounded-full absolute top-0 left-0 flex justify-center items-center cursor-pointer transition duration-500"
                >
                  <img
                    className="hidden group-hover:block w-12"
                    src="https://www.svgrepo.com/show/33565/upload.svg"
                    alt="Upload"
                  />
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files || "")}
                  />
                </label>
              )}
            </div>

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
                  value={signUpForm.email.trim()}
                  onChange={handleInputChange}
                  autoComplete="email"
                  className={`block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 ${
                    triedToSubmit &&
                    !validateEmail(signUpForm.email) &&
                    "!border-red-600 !border-2"
                  }`}
                />
              </div>
              {triedToSubmit && !validateEmail(signUpForm.email) && (
                <div className="flex items-center gap-2 mt-2">
                  <LiaInfoCircleSolid color="#ef4444" />
                  <h4 className="text-xs text-red-600">
                    valid email is required
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
                  value={signUpForm.password.trim()}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  className={`block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 ${
                    triedToSubmit &&
                    !validatePassword(signUpForm.password) &&
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
              {triedToSubmit && !validatePassword(signUpForm.password) && (
                <div className="flex items-center gap-2 mt-2">
                  <LiaInfoCircleSolid color="#ef4444" />
                  <h4 className="text-xs text-red-600">
                    password must contain one capital letter, one number, and
                    special character
                  </h4>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordBlur ? "password" : "text"}
                  autoComplete="current-password"
                  value={confirmPassword.trim()}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6 ${
                    confirmPassword !== signUpForm.password &&
                    "!border-red-600 !border-2"
                  }`}
                />
                <div
                  className="cursor-pointer absolute bottom-[30%] right-[5%]"
                  onClick={() => setConfirmPasswordBlur(!confirmPasswordBlur)}
                >
                  {confirmPasswordBlur ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
              </div>
              {confirmPassword !== signUpForm.password && (
                <div className="flex items-center gap-2 mt-2">
                  <LiaInfoCircleSolid color="#ef4444" />
                  <h4 className="text-xs text-red-600">
                    passwords do not match
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
                  "Sign up"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Got an account?{" "}
            <Link
              href="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
