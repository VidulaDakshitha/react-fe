import {  apiCall } from "../utils/api_util.service";
  
export const GetcontractorsApi = async (keyword:any) => {
    try {
       
      const data = await apiCall("contractors/");
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }

  export const AddContractorApi = async (connection_data: any) => {
    try {
      const data = await apiCall("connection/", "POST", connection_data);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  };
  