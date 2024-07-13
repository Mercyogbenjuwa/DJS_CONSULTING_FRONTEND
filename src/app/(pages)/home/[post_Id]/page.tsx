"use client";

import { PageLayout } from "@/app/Wrappers/PageLayout";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import dateFormat, { masks } from "dateformat";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { useParams, usePathname, useRouter } from "next/navigation";
import DeleteModal from "@/app/components/modals/DeleteModal";
import EditModal from "@/app/components/modals/EditModal";
import user from "../../../../../public/img/default-applicant.png";
import chef from "../../../../../public/img/chef.jpeg";
import { BlogPost } from "@/app/types/blogTypes";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCaretBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { selectIsLoggedIn } from "@/app/store/slices/AuthSlice";
import { usePostActions } from "@/app/helpers/postHelpers";
import { $api } from "@/app/services";
import { PiSpinnerGapBold } from "react-icons/pi";

const CurrentPost = () => {
  const dispatch = useDispatch();
  const { isLoading, getPostById } = usePostActions();

  const router = useRouter();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { post_Id } = useParams();
  const isLoggedIn = useSelector((state: RootState) => selectIsLoggedIn());
  const currentBlog = useSelector((state: RootState) => state.Post.currentPost);
  const [isClient, setIsClient] = useState(false);

 console.log({currentBlog})

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getCurrentPost = async () => {
    if (post_Id) {
      getPostById(post_Id, dispatch);
     
    }
  };

  useEffect(() => {
    getCurrentPost();
  }, [getPostById, post_Id]);

  const handleOpenDelete = () => {
    setOpenDeleteModal((prev) => !prev);
  };
  const handleEditDelete = () => {
    setOpenEditModal((prev) => !prev);
  };
  return (
    <PageLayout>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        blogId={post_Id}
      />
      {currentBlog && (
        <EditModal
          open={openEditModal}
          setOpen={setOpenEditModal}
          props={currentBlog}
        />
      )}
      <div className="max-w-[1100px] min-h-screen m-auto h-full pt-10 pb-10">
        <div className="md:p-20 h-full px-6 py-10">
          <div className="flex justify-between items-center gap-3">
            <button
              className="bg-transparent border flex items-center gap-2  px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
              onClick={() => router.push("/home")}
            >
              <IoCaretBackSharp fontSize={25} />
              <span className="hidden md:block">Back</span>
            </button>

            {isClient && isLoggedIn && (
              <div className="flex gap-3 items-center">
                <button
                  className="bg-transparent border flex items-center gap-2  px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300"
                  onClick={handleEditDelete}
                >
                  <HiOutlinePencilSquare fontSize={25} />
                  <span className="hidden md:block">Edit</span>
                </button>
                <button
                  className="bg-transparent border flex items-center gap-2  px-4 py-2 rounded-md text-red-400 hover:bg-gray-300"
                  onClick={handleOpenDelete}
                >
                  <RiDeleteBin6Line fontSize={25} className="text-red-400" />
                  <span className="hidden md:block">Delete</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start gap-2 border-b-2 py-7">
            {isLoading ? (
              <div className="h-[50px] w-[60%] bg-gray-200 rounded-md my-3"></div>
            ) : (
              <div>
                <h3 className="text-3xl font-bold my-3">
                  {currentBlog?.title}
                </h3>
              </div>
            )}

            {isLoading ? (
              <div className="h-[30px] w-[40%] bg-gray-200 rounded-md my-2"></div>
            ) : (
              <div className="flex  gap-2">
                {currentBlog?.user?.profileUrl && (
                  <div className="flex-shrink-0">
                    <Image
                      src={user}
                      alt="user"
                      className="h-10 w-10 rounded-full"
                      height={10}
                      width={10}
                    />
                  </div>
                )}

                <div className="flex flex-col items-start">
                  <h4 className="font-semibold text-gray-500 ">
                    {" "}
                    {currentBlog?.user?.email}
                  </h4>

                  <p className="text-gray-500 text-sm">
                    {dateFormat(currentBlog?.createdAt, "mmm d, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="flex h-full items-center col-span-full flex-col justify-center py-32 bg-gray-200 rounded ">
              <div>
                <PiSpinnerGapBold className="animate-spin text-6xl" />
              </div>
              <p className="text-lg text-gray-400 font-semibold">
                Fetching Blog
              </p>
            </div>
          ) : (
            <div>
              <div className="flex-shrink-0 py-10">
                {currentBlog?.coverImgUrl ? (
                  <Image
                    src={currentBlog.coverImgUrl}
                    alt="user"
                    className="h-full w-full object-contain"
                    height={50}
                    width={300}
                    priority
                  />
                ) : null}
              </div>
              <div className="py-5 px-2">
                <div className="text-gray-600 font-semibold">
                  {currentBlog?.content || (
                    <div className="flex items-center col-span-full flex-col justify-center py-32 bg-gray-200 rounded ">
                      <div>
                        <img
                          alt="image"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                          className="h-28 w-auto"
                        />
                      </div>
                      <p className="text-lg text-gray-400 font-semibold">
                        No content Available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CurrentPost;
