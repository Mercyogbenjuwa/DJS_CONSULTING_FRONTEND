"use client";

import { PageLayout } from "@/app/Wrappers/PageLayout";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import author from "../../../../public/img/author.png";
import chef from "../../../../public/img/chef.jpeg";

import PostCard from "@/app/components/cards/PostCardList";
import { BlogPost } from "@/app/types/blogTypes";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Pagination from "@/app/components/navigation/pagination";
import { LuListFilter } from "react-icons/lu";
import { BsGrid } from "react-icons/bs";
import PostCardList from "@/app/components/cards/PostCardList";
import PostCardGrid from "@/app/components/cards/PostCardGrid";
import { TbRuler } from "react-icons/tb";
import { usePostActions } from "@/app/helpers/postHelpers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { PiSpinnerGapBold } from "react-icons/pi";

const Home = () => {
  const dispatch = useDispatch();
  const { isLoading, getAllPosts } = usePostActions();
  const [search, setSearch] = useState<string>("");
  const [isListOrientation, setIsListOrientation] = useState<Boolean>(true);
  const posts = useSelector((state: RootState) => state.Post.allPosts);


  const getPosts = async () => {
    await getAllPosts(dispatch);
  };
  useEffect(() => {
    getPosts();
  }, []);

  const filteredPosts = posts.filter((blog: BlogPost) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [postsPerPage, setPostsPerPage] = useState<number>(4);
  useEffect(() => {
    setCurrentPage(1);
  }, [isListOrientation]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const router = useRouter();

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleOrientation = () => {
    setIsListOrientation((prev) => !prev);
  };

  return (
    <PageLayout>
      <div className="min-h-screen ">
        <div className="max-w-[1200px] m-auto h-full px-6 xl:px-0">
          <div className=" pt-28 pb-10  flex justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-10">
              <div>
                <h3 className=" text-3xl sm:text-5xl font-semibold text-center text-gray-600">
                  Welcome to DigiTech Blog
                </h3>
              </div>
              <div>
                <div className="bg-white border w[340px] sm:w-[500px] min-w-[full]  flex items-center gap-2.5 px-4 h-[56px] rounded-lg">
                  <div>
                    <IoIosSearch fontSize={25} color="#ccc" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search blog Post"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent w-full text-base placeholder:text-dkgrey outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center flex-col md:flex-row gap-3 font-bold">
                <span>Topics:</span>
                <ul className=" grid grid-cols-2 md:grid-cols-4 *:rounded-full *:border *:px-2 gap-2 *:py-2 *:border-white *:bg-gray-200 whitespace-nowrap text-center *w-fit *:cursor-pointer">
                  <li>Design</li>
                  <li>Development</li>
                  <li>Ux Design</li>
                  <li>Marketing</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="py-9 h-full">
            <div className="border-b-2 py-4 flex justify-between items-center">
              <h3 className="text-xl text-gray-500 font-medium ">Posts</h3>

              <div className="flex gap-2 ">
                <div
                  className={`w-[56px] h-full text-dpblack bg-blwhite rounded-lg flex items-center justify-center cursor-pointer focus:outline-none ${
                    isListOrientation ? "opacity-30" : ""
                  }`}
                  onClick={() => setIsListOrientation(true)}
                >
                  <LuListFilter fontSize={24} />
                </div>
                <div
                  className={`w-[56px] h-full text-dpblack bg-blwhite rounded-lg flex items-center justify-center cursor-pointer focus:outline-none ${
                    !isListOrientation ? "opacity-30" : ""
                  }`}
                  onClick={() => setIsListOrientation(false)}
                >
                  <BsGrid fontSize={24} />
                </div>
              </div>
            </div>
            <div
              className={`${
                !isListOrientation
                  ? `grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 2xl:grid-cols-4 place-content-center gap-10`
                  : `flex flex-col gap-4 mt-8`
              } mt-[34px] gap-4`}
            >
              {isLoading ? (
                <div className="flex items-center col-span-full flex-col justify-center py-32 bg-gray-200 rounded ">
                  <div>
                    <PiSpinnerGapBold className="animate-spin text-6xl" />
                  </div>
                  <p className="text-lg text-gray-400 font-semibold">
                    Fetching Blogs
                  </p>
                </div>
              ) : currentPosts.length > 0 ? (
                <>
                  {" "}
                  {currentPosts.map((blog: BlogPost) => (
                    <div key={blog.id}>
                      {isListOrientation ? (
                        <PostCardList props={blog} />
                      ) : (
                        <PostCardGrid props={blog} />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex items-center col-span-full flex-col justify-center py-32 bg-gray-200 rounded ">
                  <div>
                    <img
                      alt="image"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-28 w-auto"
                    />
                  </div>
                  <p className="text-lg text-gray-400 font-semibold">
                    No Posts Available
                  </p>
                </div>
              )}
            </div>
            {currentPosts.length > 0 ? (
              <div>
                <Pagination
                  postsPerPage={postsPerPage}
                  totalPosts={filteredPosts.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  indexOfFirstPost={indexOfFirstPost}
                  indexOfLastPost={indexOfLastPost}
                  handleNext={handleNext}
                  handlePrev={handlePrevious}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
