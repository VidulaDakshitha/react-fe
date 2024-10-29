import { useEffect, useState } from "react";
import { TaskViewProps } from "../../../types/types";
import { convertUtcDateToLocalTime } from "../../../utils/date_time";
import "./ViewTask.scss";
import { useParams } from "react-router-dom";
import { getTaskByIdApi } from "../../../services/task.service";
import { toast } from "react-toastify";
import { getTaskApiAttributes } from "../../../types/api_types";

import { Tab, Tabs } from "react-bootstrap";
import { ViewBidsClient } from "./ViewBidsClient/ViewBidsClient";
import { ViewTaskStatusClient } from "./ViewTaskStatusClient/ViewTaskStatusClient";
import { TaskDetails } from "./TaskDetails/TaskDetails";
import payment from "../../../assets/payment.png";
import CustomModal from "../../../components/Modal/Modal";
import { CreateBid } from "../../BidManagement/CreateBid/CreateBid";
import { useUserRole } from "../../../hooks/HasRole";
// export const ViewTask = ({ taskData }: TaskViewProps) => {
//   return (
//     <div>
//       <div className="row">
//         <div className="col-4 label">Title</div>
//         <div className="col-8 info">{taskData?.title}</div>
//       </div>

//       <div className="row">
//         <div className="col-4 label">Task Budget</div>
//         <div className="col-8 info">{taskData?.currency} {taskData?.budget}</div>
//       </div>

//       <div className="row">
//         <div className="col-4 label">Bid Deadline</div>
//         <div className="col-8 info">{convertUtcDateToLocalTime(taskData?.bid_deadline)}</div>
//       </div>

//       <div className="row">
//         <div className="col-4 label">Task Deadline</div>
//         <div className="col-8 info">{convertUtcDateToLocalTime(taskData?.task_deadline)}</div>
//       </div>

//         <div>
//             <div className="label">Task Description</div>
//         <div className="info">{taskData?.description}</div>
//         </div>

//     </div>
//   );
// };
export const ViewTask = () => {
  const { roles, hasRole } = useUserRole();
  const id = useParams();
  const [taskDetails, setTaskDetails] = useState<getTaskApiAttributes>();
  const [viewBidmodalShow, setViewBidModalShow] = useState(false);
  const toggleBidViewModal = () => setViewBidModalShow(!viewBidmodalShow);

  const getTaskDetailsByID = async () => {
    console.log("this is task", id);
    const details: any = await getTaskByIdApi(id.id);
    if (details.status == 200) {
      setTaskDetails(details.data);
    } else {
      toast.error("Error retreiving data");
    }
  };
  useEffect(() => {
    getTaskDetailsByID();
  }, []);

  return (
    <div className="p-lg-5 p-md-5 p-3">
      <div className="task-title d-flex justify-content-between">
        <div>
          {taskDetails && taskDetails.title}{" "}
          <span className="by-user">
            By {taskDetails && taskDetails.created_by}
          </span>
          <div className="d-flex">
            <div className="remaining-txt">14 remaining of 50 bids</div>{" "}
            <div className="verified-txt">
              <img src={payment} /> Payment Verified
            </div>
          </div>
        </div>

{  ['sales','gig_worker'].some((role:any) => hasRole(role)) &&   taskDetails && taskDetails.is_accepted==0 && taskDetails.is_completed==0 &&     <div>                <button
                  className="task-btn"
                  onClick={() => toggleBidViewModal()}
                >
                  Place Bid
                </button></div>}
      </div>

      { ['admin'].some((role:any) => hasRole(role)) ?  (
        <Tabs
          defaultActiveKey="Details"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Details" title="Details">
            <TaskDetails taskDetails={taskDetails} recallTaskData={getTaskDetailsByID}/>
          </Tab>
          <Tab eventKey="Bids" title="Bids">
            <ViewBidsClient task_id={id} />
          </Tab>
          <Tab eventKey="Status" title="Status">
            <ViewTaskStatusClient task_id={id} />
          </Tab>
        </Tabs>
      ) : (
        <TaskDetails taskDetails={taskDetails} />
      )}

<CustomModal
        show={viewBidmodalShow}
        toggle={toggleBidViewModal}
        ModalHeader="Place Bid"
      >
        <CreateBid details={taskDetails} closeModal={toggleBidViewModal} />
      </CustomModal>
      
    </div>
  );
};
