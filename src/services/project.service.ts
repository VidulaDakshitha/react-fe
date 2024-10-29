import {
    updateCertificationAPIAttributes,
    updateLanguageAPIAttributes,
    updateProjectAPIAttributes
} from "../types/api_types";
import {apiCall} from "../utils/api_util.service";


export const UpdateProjectApi = async (project_data: updateProjectAPIAttributes) => {
    try {
        const data = await apiCall('freelancer/', 'PUT', project_data);
        return data;
        // Process the received data
    } catch (error) {
        // Handle error here
        return error;
    }
}