import axios from "axios";
import {remote_faceid_url_v1, remote_url_v1} from "../environment/environment";
import { toast } from "react-toastify";
import { ErrorNotification } from "../components/ErrorNotification/ErrorNotification";
// import { base64Encoder, base64Decoder, aes_encrypt, aes_decrypt } from './encryption';

const api = axios.create({
  baseURL: remote_url_v1, //process.env.REACT_APP_BASE_URL,
  // baseURL: base_url_v1,
});

const api2 = axios.create({
  baseURL: remote_faceid_url_v1, //process.env.REACT_APP_BASE_URL,
  // baseURL: base_url_v1,
});

export const apiCall = async (url: any, method = "GET", data: any = null) => {
  const token =
    (await sessionStorage.getItem("utoken")) || localStorage.getItem("utoken");
  // if(data){
  //   data=encrypt(data)
  // }

  const headers = {
    "Content-Type": "application/json", //'text/plain',
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await api.request({
      url,
      method,
      data,
      headers,
    });

    return { data: response.data, status: response.status };

    // return decrypt(response.data);
  } catch (error: any) {
    //console.log("There is an error",error)
    if (error.response && error.response.status === 401) {
      // Navigate to login if a 401 Unauthorized error is caught
      window.location.href = "/login";
    }
    if (error.response && (error.response.status === 400 || error.response.status === 500)) {

      // Navigate to login if a 401 Unauthorized error is caught
      const errors = error.response?.data?.errors;
      const errorMessage = errors?errors:['An unknown error occurred'];
        // ? JSON.stringify(errors)
        // : "An unknown error occurred.";
      
      errorMessage.forEach(function(element:any) {
 
        ErrorNotification(element);
    });

    }
    // if(error.code=="ERR_NETWORK"){
    //   return toast.error("Please check your internet connection")
    // }
  }
};

export const unauthApiCall = async (
  url: any,
  method = "GET",
  data: any = null
) => {
  const token =
    (await sessionStorage.getItem("access_token")) ||
    localStorage.getItem("access_token");
  // if(data){
  //   data=encrypt(data)
  // }

  const headers = {
    "Content-Type": "application/json", //'text/plain',
  };

  try {
    const response = await api.request({
      url,
      method,
      data,
      headers,
    });

    return { data: response.data, status: response.status };

    // return decrypt(response.data);
  } catch (error: any) {
    console.log(error.response.data.error);
    if (error.response && error.response.status === 401) {
      toast.error(error.response.data.error);
      // Navigate to login if a 401 Unauthorized error is caught
      //  window.location.href = "/login";
    }
    if (error.response && error.response.status === 400) {
      // Navigate to login if a 401 Unauthorized error is caught
      const errors = error.response?.data?.errors;
      const errorMessage = errors?errors:['An unknown error occurred'];
        // ? JSON.stringify(errors)
        // : "An unknown error occurred.";
      console.log("the erro", errorMessage);
      errorMessage.forEach(function(element:any) {
        ErrorNotification(element);
    });
    }
    // if(error.code=="ERR_NETWORK"){
    //   return toast.error("Please check your internet connection")
    // }
  }
};


export const CustomApiCall = async (url: any, method = "GET", data: any = null,header_val:any) => {
  const token =
    (await sessionStorage.getItem("utoken")) || localStorage.getItem("utoken");
  // if(data){
  //   data=encrypt(data)
  // }

  const headers = {
    "Content-Type": "application/json", //'text/plain',
    Authorization: header_val,
  };

  try {
    const response = await api.request({
      url,
      method,
      data,
      headers,
    });

    return { data: response.data, status: response.status };

    // return decrypt(response.data);
  } catch (error: any) {

    //console.log("There is an error",error)
    if (error.response && error.response.status === 401) {
      // Navigate to login if a 401 Unauthorized error is caught
      ErrorNotification("Token expired");
    }
    if (error.response && (error.response.status === 400 || error.response.status === 500)) {
      // Navigate to login if a 401 Unauthorized error is caught
      const errors = error.response?.data?.errors;
      const errorMessage = errors?errors:['An unknown error occurred'];
        // ? JSON.stringify(errors)
        // : "An unknown error occurred.";
      console.log("the erro", errorMessage);
      errorMessage.forEach(function(element:any) {
        ErrorNotification(element);
    });

    }
    // if(error.code=="ERR_NETWORK"){
    //   return toast.error("Please check your internet connection")
    // }
  }
};
