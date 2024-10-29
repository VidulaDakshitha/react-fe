import {
  forgotPassApiAttributes,
  loginApiAttributes,
  registerApiAttributes,
  setPasswordApiAttributes,
} from "../types/api_types";
import { CustomApiCall, apiCall, unauthApiCall } from "../utils/api_util.service";

//Login Api service
export const loginApi = async (login_data: loginApiAttributes) => {
  try {
    const data = await unauthApiCall("login/", "POST", login_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Login Api service
export const forgotPasswordApi = async (forgot_data: forgotPassApiAttributes) => {
  try {
    const data = await unauthApiCall("forget-password/", "POST", forgot_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Register Api service
export const registerApi = async (register_data: registerApiAttributes) => {
  try {
    const data = await unauthApiCall("register/", "POST", register_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Set Password Api service
export const setPasswordApi = async (
  password_data: setPasswordApiAttributes,
  user_id: string,
  header_val:string,
) => {
  try {
    const data = await CustomApiCall(
      "user/" + user_id + "/password/",
      "POST",
      password_data,
      header_val
    );
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Set Password Api service
export const setPasswordConnectionApi = async (
  password_data: setPasswordApiAttributes,
  user_id: string,
  header_val:string,
) => {
  try {
    const data = await CustomApiCall(
      "connection-accept/" + user_id +"/",
      "POST",
      password_data,
      header_val
    );
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//get user details Api service
export const getUserDetailsApi = async () => {
  try {
    const data = await apiCall("user/");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};


//get user details Api service
export const getUserDetailsByIDApi = async (id:any) => {
  try {
    const data = await apiCall("user/"+id+"/");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//update user details Api service
export const updateUserDetailsApi = async (payload: any) => {
  try {
    const data = await apiCall("user/", "PUT", payload);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//get user details Api service
export const getAllUserDetailsApi = async (role:String, manager:string,status:string, name:string, email:string) => {
  try {
    const data = await apiCall("users/?role="+role+"&manager="+manager+"&status="+status+"&name="+name+"&email="+email+"");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Register Api service
export const EmployeeRegisterApi = async (register_data: any) => {
  try {
    const data = await apiCall("user/", "POST", register_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};




//get connection details Api service
export const getAllConnectionDetailsApi = async (status:string, name:string) => {
  try {
    let urlString = "connection/"
    if(status !=""){
       urlString = "connection/?is_connected="+status+"&keyword="+name+"";
    }else{
       urlString = "connection/?keyword="+name+"";
    }
    const data = await apiCall(urlString);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Register Api service
export const ConnectionRegisterApi = async (register_data: any) => {
  try {
    const data = await apiCall("user/", "POST", register_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Get Connection Summery  Api service
export const ConnectionSummeryApi = async (status:string, name:string, email:string) => {
  try {
    const data = await apiCall("connection-summary/?is_connected="+status+"&keyword="+name+"&keyword="+email+"");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Get  Api service
export const UserSummeryApi = async (status:string, name:string, email:string) => {
  try {
    const data = await apiCall("user-summary/");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};


//Register Api service
export const EmployeeEmailApi = async (register_data: any) => {
  try {
    const data = await apiCall("get-user-status/?email="+register_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};


//Register Api service
export const InviteConnectionApi = async (register_data: any) => {
  try {
    const data = await apiCall("connection/", "POST", register_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};