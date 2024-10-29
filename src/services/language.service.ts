import {updateLanguageAPIAttributes} from "../types/api_types";
import {apiCall} from "../utils/api_util.service";


//Get Skill Api service
export const getAllLanguageApi = async (): Promise<any> => {
    try {
        const data = await apiCall(`language/`);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
};

export const UpdateLanguageApi = async (language_data: updateLanguageAPIAttributes) => {
    try {
        const data = await apiCall('freelancer/', 'PUT', language_data);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}