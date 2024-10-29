import {updateSkillAPIAttributes} from "../types/api_types";
import {apiCall} from "../utils/api_util.service";


//Get Skill Api service
export const getAllSkillApi = async (keyword: string): Promise<any> => {
    try {
        const data = await apiCall(`skill/?keyword=${keyword}`);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
};

export const UpdateSkillApi = async (skill_data: updateSkillAPIAttributes) => {
    try {
        const data = await apiCall('user/', 'PUT', skill_data);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}