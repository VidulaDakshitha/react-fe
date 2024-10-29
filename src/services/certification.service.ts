import {updateCertificationAPIAttributes, updateLanguageAPIAttributes} from "../types/api_types";
import {apiCall} from "../utils/api_util.service";


export const UpdateCertificationApi = async (certification_data: updateCertificationAPIAttributes) => {
    try {
        const data = await apiCall('freelancer/', 'PUT', certification_data);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}