import { useState } from "react";

import AddRoles from "../../../../components/AddRoles/AddRoles";
import { UpdateTaskApi } from "../../../../services/task.service";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../../components/ErrorNotification/ErrorNotification";
import Button from "../../../../core/Button/Button";
import { useUserRole } from "../../../../hooks/HasRole";

interface TaskProps{
    task_id:number;
    closeModal:()=>void;
    recallData:()=>void;
}



export const AssignConsultant = ({task_id,  closeModal,
    recallData}:TaskProps) =>{
    const [selectedSubContractor, setSelectedSubContractor] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('SubContractors');
    const { roles, hasRole } = useUserRole();
    const SaveManager=async()=>{
        setIsLoading(true);
        let values={
            "assignee_id":selectedSubContractor[0].id
        }
        const task_request: any = await UpdateTaskApi(
            values,
            task_id
          );
         setIsLoading(false);
          if (task_request.status == 200) {
            toast.success("Task updated successfully");
            closeModal();
            recallData();
          } else {
            ErrorNotification(task_request.message);
          }
    }
    return(
        <div>

          
             <AddRoles
              selectedSubContractor={selectedSubContractor}
              setSelectedSubContractor={setSelectedSubContractor}
              type="worker"
            />

            <div className="d-flex justify-content-end pt-5">
            <Button
                  className="task-btn me-2"
                  buttonText={"Assign Consultant"}
                  type="button"
                  isLoading={isLoading}
                  onClickHandler={()=>SaveManager()}
                />
            </div>
            
        </div>
    )
}