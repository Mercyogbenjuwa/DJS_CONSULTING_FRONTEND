
import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const baseURL = process.env.NEXT_PUBLIC_APP_API_URL;

const axiosConfig = {
  withCredentials: false,
  headers: {
    Accept: "application/json",
  },
};

const axiosClient: AxiosInstance = axios.create(axiosConfig);


class ServiceApi {
  public url = baseURL;
 
  

  appendToURL(url: string) {
    
    return `${this.url}${url}`;
  }

  setupHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("blog_admin_access_token")}`,
      },
    };
  }

  async fetch(url: string, data?: any) {
    try {
      const response = await axiosClient.get(this.appendToURL(url), {
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("blog_admin_access_token")}`,
        },
      });
      return response;
    } catch (err: any) {
      return err;
    }
  }

  async fetchWithoutAuth(url: string, data?: any) {
    try {
      const response = await axiosClient.get(this.appendToURL(url), {
        data,
      });
      return response;
    } catch (err: any) {
      return err;
    }
  }

  async post(url: string, data: any) {

    
    try {
      const response = await axiosClient.post(
        this.appendToURL(url),
        data,
        this.setupHeaders()
      );
      return response;
    } catch (err: any) {
      return err;
    }
  }

  async delete(url: string) {
    try {
      const response = await axiosClient.delete(
        this.appendToURL(url),
        this.setupHeaders()
      );
      return response;
    } catch (err: any) {
      return err;
    }
  }

  async update(url: string, data: any) {
    try {
      const response = await axiosClient.patch(
        this.appendToURL(url),
        data,
        this.setupHeaders()
      );
      return response;
    } catch (err: any) {
      return err;
    }
  }

  isSuccessful(response: any): boolean {
    const codes = [200, 201, 202, 204];
    console.log(response?.response?.data?.statusCode);
    if (
      !codes.includes(
        response?.status ||
          response?.statusCode ||
          response?.code ||
          response?.response?.data?.statusCode
      )
    ) {
        if (Array.isArray(response?.response?.data?.message.length)) {
          // toast.error(response?.response?.data?.message[0]);
        } else {
          toast.error(response?.response?.data?.message);
        }
    }
    return codes.includes(
      response?.status ||
        response?.statusCode ||
        response?.code ||
        response?.response?.data?.statusCode
    )
      ? true
      : false;
  }
}


export default new ServiceApi();
