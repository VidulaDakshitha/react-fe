import {  apiCall } from "../utils/api_util.service";
  
export const GetExtrenalUserApi = async (keyword:any) => {
    try {
       
      const data = await apiCall("external-consultant/?email="+keyword);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }

  export const GetOrganizationsApi = async (keyword:any) => {
    try {
       
      const data = await apiCall("organization/?keyword="+keyword);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }


  export const GetWorkersApi = async (keyword:any) => {
    try {
       
      const data = await apiCall("external-consultant/?keyword="+keyword);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }
  export const GetSubContractorsUserApi = async (keyword:any) => {
    try {
      const data = await apiCall("contractors/?keyword="+keyword);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }
  export const AddConnectionApi = async (connection_data: any) => {
    try {
      const data = await apiCall("connection/", "POST", connection_data);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  };


  export const GetManagerUserApi = async (keyword:any,role:any) => {
    try {
      const data = await apiCall("users/role/?role="+role+"&keyword="+keyword);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      console.log(error)
      return error;
    }
  }
  