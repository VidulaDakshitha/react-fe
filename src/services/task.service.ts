

import { createTaskApiAttributes } from "../types/api_types";
import { apiCall } from "../utils/api_util.service";


//Create Task Api service
export const createTaskApi = async (task_data:createTaskApiAttributes) => {
    try {
      const data = await apiCall('task/','POST',task_data);
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }


  //Get Task Api service
export const getAllTaskApi = async (params:any) => {
  try {
    const data = await apiCall('retrieve-task/?'+params);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
}


  //Get Task by ID Api service
  export const getTaskByIdApi = async (id:any) => {
    try {
      const data = await apiCall('retrieve-task/'+id+'/');
      return data;
      // Process the received data
    } catch (error) {
      // Handle error here
      return error;
    }
  }
  

  //Update Task Api service
export const UpdateTaskApi = async (task_data:any,id:number) => {
  try {
    const data = await apiCall('task/'+id+'/','PUT',task_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
}