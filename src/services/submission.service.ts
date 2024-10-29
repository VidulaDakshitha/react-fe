import { apiCall } from "../utils/api_util.service";

//Create Task Api service
export const createSubmissionApi = async (task_data: any) => {
  try {
    const data = await apiCall("subtask/", "POST", task_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//gey all bids Api service
export const getSubmissionApi = async (id: any) => {
  try {
    const data = await apiCall("subtask/" + id + "/");
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};


//Create Task Api service
export const UpdateSubmissionInvoiceApi = async (task_data: any , id:any) => {
  try {
    const data = await apiCall("subtask/"+id+'/', "PUT", task_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
}