"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { BlogPost, BlogPostUpdate } from "@/app/types/blogTypes";
import Image, { StaticImageData } from "next/image";
import axios from "axios";
import { $api } from "@/app/services";
import { usePostActions } from "@/app/helpers/postHelpers";
import { toast } from "react-toastify";
import { PiSpinnerGapBold } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { LiaInfoCircleSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";

type ModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  props: BlogPost;
};

export default function EditModal({ open, setOpen, props }: ModalProps) {
  const dispatch = useDispatch();

  const { getPostById, updatePostById } = usePostActions();

  const [uploadingCoverImage, setUploadingCoverImage] =
    useState<boolean>(false);
  const [coverImageName, setCoverImageName] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | StaticImageData>(
    ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);

  const [editForm, setEditForm] = useState<BlogPostUpdate>({
    coverImgUrl: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    if (open) {
      setCoverImageName(props.coverImgUrl ? "coverimg" : "");
      setCoverImageUrl(props.coverImgUrl || "");
      setEditForm({
        coverImgUrl: props.coverImgUrl || "",
        title: props.title || "",
        content: props.content || "",
      });
    }
  }, [open, props]);

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
      
          setCoverImageName(response?.data?.original_filename);
          setEditForm({
            ...editForm,
            coverImgUrl: response?.data?.secure_url,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setUploadingCoverImage(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setEditForm({ ...editForm, [id]: value });
  };

  const isFormValid = () => {
    return editForm.content && editForm.title && editForm.coverImgUrl;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setTriedToSubmit(true);
    e.preventDefault();
    setIsLoading(true);
    if (isFormValid()) {
      try {
        const response = await updatePostById(props.id, editForm);

        getPostById(props.id, dispatch);
        setIsLoading(false);
        setOpen(false);
        if ($api.isSuccessful(response)) {
        } else {
          setOpen(true);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        setOpen(true);
      }
    } else {
      toast.error("Form Submission error");
      setIsLoading(false);
      setOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 z-10 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full   items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative flex-1 lg:max-w-[817px] max-w-[350px]  md:max-w-[600px] w-full transform overflow-hidden rounded-lg p-5 bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <form className="" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div className="border-b border-gray-900/10 ">
                  <h2 className="text-3xl font-semibold leading-7 text-gray-900">
                    Edit Blog
                  </h2>

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
                          !coverImageUrl &&
                          "!border-red-600 border-dashed !border-2"
                        }`}
                      >
                        <div className="text-center">
                          {uploadingCoverImage ? (
                            <PiSpinnerGapBold className="animate-spin text-7xl" />
                          ) : coverImageName ? (
                            <div className="h-full w-full">
                              <Image
                                alt="coverImageName"
                                src={coverImageUrl}
                                className="h-full w-full object-contain "
                                height={50}
                                width={250}
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
                        {coverImageName && (
                          <div className="p-7">
                            <SlClose
                              className="absolute cursor-pointer top-[5%] right-[2%] text-3xl"
                              onClick={() => {
                                setCoverImageUrl("");
                                setCoverImageName("");
                              }}
                            />
                          </div>
                        )}
                      </div>
                      {triedToSubmit && !coverImageUrl && (
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
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Blog Title
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g How to..."
                            value={editForm.title}
                            onChange={handleInputChange}
                            autoComplete="username"
                            className={`block flex-1 border-0 bg-transparent py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${
                              triedToSubmit &&
                              !editForm.title &&
                              "!border-red-600 !border-2"
                            }`}
                          />
                        </div>
                        {triedToSubmit && !editForm.title && (
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
                        htmlFor="content"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Blog Content
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="content"
                          name="content"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                            triedToSubmit &&
                            !editForm.content &&
                            "!border-red-600 !border-2"
                          }`}
                          value={editForm.content}
                          onChange={handleInputChange}
                        />
                      </div>
                      {triedToSubmit && !editForm.content && (
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
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {isLoading ? (
                    <PiSpinnerGapBold className="animate-spin text-lg" />
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
