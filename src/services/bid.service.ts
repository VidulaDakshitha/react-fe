import { apiCall } from "../utils/api_util.service";

//Create Task Api service
export const createBidApi = async (task_data: any) => {
  try {
    const data = await apiCall("bid/", "POST", task_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//gey all bids Api service
export const getBidsApi = async (params: any = "") => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const data = await apiCall("bid/?" + queryString);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//gey all bids Api service
export const BidAcceptApi = async (id: any, payload: any) => {
  try {
    const data = await apiCall("bid-manage/" + id + "/", "PUT", payload);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

//Update Bid Api service
export const UpdateBidApi = async (bid_data: any, id: number) => {
  try {
    const data = await apiCall("bid/" + id + "/", "PUT", bid_data);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};


export const getBidsOrigSummaryinApi = async (params: any = "") => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const data = await apiCall("bid-summary/?" + queryString);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};

export const getBidsOriginApi = async (params: any = "") => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const data = await apiCall("bid/?" + queryString);
    return data;
    // Process the received data
  } catch (error) {
    // Handle error here
    return error;
  }
};