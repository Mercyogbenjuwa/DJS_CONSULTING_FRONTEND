import { useDispatch } from "react-redux";
import { $api } from "../services";
import { BlogPost, BlogPostUpdate } from "../types/blogTypes";
import { toast } from "react-toastify";
import { setAllPost, setCurrentPost } from "../store/slices/PostSlice";
import { AppDispatch } from "../store/store";
import { useCallback, useState } from "react";

export const usePostActions = () => {

  const [isLoading, setIsLoading] = useState<boolean>()

   const addPost = async (data: BlogPostUpdate) => {
    try {
      const response = await $api.post("/posts", data);
  
      if ($api.isSuccessful(response)) {
        toast.success(response?.data?.message);
        return response
      } 
    } catch (error) {
     
      toast.error("An error occurred while creating the post.");
    }
  };
  
 const getAllPosts = async (dispatch: AppDispatch) => {
  setIsLoading(true)
    try {
      const response = await $api.fetch("/posts");
  
      if ($api.isSuccessful(response)) {
        dispatch(setAllPost(response?.data?.data));
      setIsLoading(false)
        
      } else {
      setIsLoading(false);

      }
    } catch (error) {
      
      setIsLoading(false);
      toast.error("An error occurred while fetching the posts.");
    }
  };
  
  const getPostById = useCallback(async (id: string | string[], dispatch : AppDispatch) => {
    setIsLoading(true)
    try {
      const response = await $api.fetch(`/posts/${id}`);
     
  
      if ($api.isSuccessful(response)) {
        setIsLoading(false)
        dispatch(setCurrentPost(response?.data?.data));
        return response?.data?.data;
      } else {
      
        setIsLoading(false);

      }
    } catch (error) {
    
      toast.error("An error occurred while fetching the post.");
        setIsLoading(false);

    }
  }, [$api]);
  
   const updatePostById = async (id: string, data: BlogPostUpdate) => {
    try {
      const response = await $api.update(`/posts/${id}`, data);
  
      
  
      if ($api.isSuccessful(response)) {
             toast.success(response?.data?.message);
             
  
      } else {
       
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the post.");
    }
  };
  
  const deletePostById = async (id: string | string[]) => {
    try {
      const response = await $api.delete(`/posts/${id}`);

      if ($api.isSuccessful(response)) {
        toast.success(response?.data?.message);
       
      } else {
        
      }
    } catch (error) {
      
      toast.error("An error occurred while deleting the post.");
    }
  };

  return {
    addPost,
    getAllPosts,
    getPostById,
    updatePostById,
    deletePostById,
    isLoading,
  };
}

