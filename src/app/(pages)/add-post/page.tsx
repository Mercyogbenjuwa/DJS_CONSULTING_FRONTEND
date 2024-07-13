"use client";
import {  usePostActions } from "@/app/helpers/postHelpers";
import { $api } from "@/app/services";
import {
  clearPostForm,
  setPostContent,
  setPostCoverImg,
  setPostCoverImgName,
  setPostTitle,
} from "@/app/store/slices/PostSlice";
import { RootState } from "@/app/store/store";
import { BlogPost, BlogPostUpdate } from "@/app/types/blogTypes";
import { PageLayout } from "@/app/Wrappers/PageLayout";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { PiSpinnerGapBold } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function AddPost() {
  const {addPost} = usePostActions()
  const router = useRouter();
  const dispatch = useDispatch();
  const [uploadingCoverImage, setUploadingCoverImage] =
    useState<boolean>(false);
  const [coverImageName, setCoverImageName] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);

  const blogCreateForm = useSelector((state: RootState) => state.Post.postForm);

  console.log({ blogCreateForm });

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
          dispatch(setPostCoverImg(response?.data?.secure_url));
          dispatch(setPostCoverImgName(response?.data?.original_filename));
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
      blogCreateForm.content &&
      blogCreateForm.title &&
      blogCreateForm.coverImgUrl
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setTriedToSubmit(true);
    e.preventDefault();
    setIsLoading(true);
    if (isFormValid()) {
      try {
        const response = await addPost({
          title: blogCreateForm.title,
          content: blogCreateForm.content,
          coverImgUrl: blogCreateForm.coverImgUrl,
        });

        if ($api.isSuccessful(response)) {
          setIsLoading(false);
          router.push("/home")
          dispatch(clearPostForm());

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
    <PageLayout>
      <div className="max-w-[1200px] m-auto h-full">
        <div className="md:p-20 px-6 py-20">
          <form className="" onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-3xl font-semibold leading-7 text-gray-900">
                  Post a Blog
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Share your Thoughts with the world.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cover photo
                    </label>
                    <div
                      className={`mt-2 relative flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ${
                        triedToSubmit &&
                        !blogCreateForm.coverImgUrl &&
                        "!border-red-600 border-dashed !border-2"
                      }`}
                    >
                      <div className="text-center">
                        {uploadingCoverImage ? (
                          <PiSpinnerGapBold className="animate-spin text-7xl" />
                        ) : blogCreateForm.coverImageName ? (
                          <div className="h-full w-full">
                            <Image
                              alt="coverImageName"
                              src={blogCreateForm.coverImgUrl}
                              className="h-full w-full object-contain "
                              height={50}
                              width={300}
                            />
                          </div>
                        ) : (
                          <>
                            <PhotoIcon
                              aria-hidden="true"
                              className="mx-auto h-12 w-12 text-gray-300"
                            />
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileUpload(e.target.files || "")
                                  }
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </div>
                      {blogCreateForm.coverImageName && (
                        <div className="p-7">
                          <SlClose
                            className="absolute cursor-pointer top-[5%] right-[2%] text-3xl"
                            onClick={() => {
                              dispatch(setPostCoverImg(""));
                              dispatch(setPostCoverImgName(""));
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {triedToSubmit && !blogCreateForm.coverImgUrl && (
                      <div className="flex items-center gap-2 mt-2">
                        <LiaInfoCircleSolid color="#ef4444" />
                        <h4 className="text-xs text-red-600">
                          Please upload a suitable cover photo
                        </h4>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="blogTitle"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Blog Title
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          id="blogTitle"
                          name="blogTitle"
                          type="text"
                          placeholder="e.g How to..."
                          value={blogCreateForm.title}
                          onChange={(e) =>
                            dispatch(setPostTitle(e.target.value))
                          }
                          autoComplete="username"
                          className={`block flex-1 border-0 bg-transparent py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${
                            triedToSubmit &&
                            !blogCreateForm.title &&
                            "!border-red-600 !border-2"
                          }`}
                        />
                      </div>
                      {triedToSubmit && !blogCreateForm.title && (
                        <div className="flex items-center gap-2 mt-2">
                          <LiaInfoCircleSolid color="#ef4444" />
                          <h4 className="text-xs text-red-600">
                            Blog title is required
                          </h4>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Blog Content
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        rows={10}
                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                          triedToSubmit &&
                          !blogCreateForm.content &&
                          "!border-red-600 !border-2"
                        }`}
                        value={blogCreateForm.content}
                        onChange={(e) =>
                          dispatch(setPostContent(e.target.value))
                        }
                      />
                    </div>
                    {triedToSubmit && !blogCreateForm.content && (
                      <div className="flex items-center gap-2 mt-2">
                        <LiaInfoCircleSolid color="#ef4444" />
                        <h4 className="text-xs text-red-600">
                          Blog content is required
                        </h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                disabled={isLoading}
                className="text-sm font-semibold leading-6 text-gray-900 disabled:cursor-not-allowed "
                onClick={() => {
                  router.back();
                  dispatch(clearPostForm());
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isLoading ? (
                  <PiSpinnerGapBold className="animate-spin text-lg" />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
