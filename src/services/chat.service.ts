
import {apiCall} from "../utils/api_util.service";


export const getAllChatsApi = async (params:any) => {
    try {
        const data = await apiCall('chatroom/?page=1&limit=10');
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}

export const getAllChatsHistoryApi = async (params:any,room_id:string) => {
    try {
        const data = await apiCall('chatroom/'+room_id+'/?'+params);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}


export const createChatRoomApi = async (pay_load:any) => {
    try {
        const data = await apiCall('chatroom/','POST',pay_load);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}