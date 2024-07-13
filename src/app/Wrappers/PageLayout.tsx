'use client'

import { ReactNode, useEffect } from "react";
import NavBar from "../components/navigation/NavBar";
import Footer from "../components/navigation/Footer";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


type PageLayoutProps = {
  children: ReactNode;
};
export const PageLayout = ({ children }: PageLayoutProps) => {
  useEffect(() => {
    const message = Cookies.get("redirectMessage");
  
    
    if (message) {
      toast.error(message);
      Cookies.remove("redirectMessage", { path: "/home" });
    }
  }, []);
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};
