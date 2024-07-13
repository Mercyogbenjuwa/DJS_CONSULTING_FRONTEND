"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import userIcon from "../../../../public/img/default-applicant.png";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { clearAuth, selectIsLoggedIn } from "@/app/store/slices/AuthSlice";
import { toast } from "react-toastify";

export default function NavBar() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => selectIsLoggedIn());
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const pathname: string = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Disclosure
      as="nav"
      className="bg-indigo-500 border-b-2 fixed top-0 left-0 right-0 z-10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/home" className="cursor-pointer">
                <img
                  alt="logo"
                  src="https://tailwindui.com/img/logos/mark.svg?color=white&shade="
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isClient && isLoggedIn ? (
              <>
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <Image
                        alt=""
                        src={userIcon}
                        className="h-8 w-8 rounded-full"
                        height={32}
                        width={32}
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        onClick={() => {
                          toast.info("Logging out!");

                          setTimeout(() => {
                            dispatch(clearAuth());

                            if (isLoggedIn) {
                              toast.success("Logged out Successfully");
                            }
                          }, 1500);
                        }}
                      >
                        Sign out
                      </a>
                    </MenuItem>
                  </MenuItems>
                </Menu>
                <div>
                  <button
                    className="bg-white border flex items-center gap-2  px-4 py-2 rounded-md text-gray-700 font-semibold hover:bg-gray-300"
                    onClick={() => router.push("/add-post")}
                  >
                    <HiOutlinePencilSquare />
                    Post
                  </button>
                </div>
              </>
            ) : (
              <div>
                <button
                  className="bg-white px-5 py-2 rounded-md text-gray-700 font-semibold"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
