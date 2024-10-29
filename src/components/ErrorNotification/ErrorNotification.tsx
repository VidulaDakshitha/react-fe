import { toast } from "react-toastify";

export const ErrorNotification = (error: string) => {
    return toast.error(error);
};