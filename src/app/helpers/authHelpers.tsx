import { $api } from "../services";
import { LoginAuth, UserAuth } from "../types/blogTypes";
import { AppDispatch } from "../store/store";
import {
  removeEmail,
  setUserAccessToken,
  setUserEmail,
} from "../store/slices/AuthSlice";
import { toast } from "react-toastify";

export const loginUser = async (data: LoginAuth, dispatch: AppDispatch) => {
  try {
    const response = await $api.post("/auth/login", data);

    if ($api.isSuccessful(response)) {
      toast.success(response?.data?.message);

      if (response?.data?.data?.accessToken) {
        dispatch(setUserAccessToken(response?.data?.data?.accessToken));
        dispatch(removeEmail());
      }
      return response;
    } else {
      

      return response;
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while logging in.");
  }
};
export const registerUser = async (data: UserAuth, dispatch: AppDispatch) => {
  try {
    const response = await $api.post("/auth/register", data);

    if ($api.isSuccessful(response)) {
      

      dispatch(setUserEmail(data.email));
    

      toast.success(response?.data?.message);
      return response;
    } else {
    
      return response;
    }
  } catch (error) {
    console.error(error);
    toast.error("An error occurred while Creating your account.");
  }
};
