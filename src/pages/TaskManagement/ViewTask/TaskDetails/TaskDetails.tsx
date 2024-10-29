import { useState } from "react";
import "./TaskDetails.scss";
import CustomModal from "../../../../components/Modal/Modal";
import { UpdateTask } from "../../UpdateTask/UpdateTask";
import { CreateBid } from "../../../BidManagement/CreateBid/CreateBid";
import DOMPurify from "dompurify";
import { ViewAttachment } from "../../../../components/ViewAttachment/ViewAttachment";
export const TaskDetails = ({ taskDetails, recallTaskData }: any) => {
  console.log("hutto", taskDetails);
  const [attachment, Attachments] = useState([1, 2, 3, 4]);
  const [updatemodalShow, setUpdateModalShow] = useState(false);
  const toggleUpdateModal = () => setUpdateModalShow(!updatemodalShow);
  const [viewBidmodalShow, setViewBidModalShow] = useState(false);
  const toggleBidViewModal = () => setViewBidModalShow(!viewBidmodalShow);
  const [skills, setSkills] = useState([
    "Web Design",
    "Figma",
    "Mobile UI",
    "User Experience Design",
    "Responsive Design",
  ]);

  return (
    <>
      <div className="row">
        <div className="task-desc pt-4 row">
          {/* <div className="col-8">{taskDetails && taskDetails.description}</div> */}
          <div
            className="col-lg-10 col-md-10 col-12 order-lg-1 order-md-1 order-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                taskDetails && taskDetails.description.replace(/\n/g, "<br />")
              ),
            }}
          />
          <div className="col-lg-2 col-md-2 col-12 d-flex justify-content-end order-lg-2 order-md-2 order-1 pb-lg-0 pb-md-0 pb-4">
            <div>
              {localStorage.getItem("e_type") == "1" ? (
                <button
                  className="task-btn"
                  onClick={() => toggleUpdateModal()}
                >
                  Edit Task
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="acceptance-header pt-4">Acceptance Criteria :</div>
      {/* <div className="acceptance-desc">
        {taskDetails && taskDetails.acceptance_criteria}
      </div> */}

      <div
        className="acceptance-desc"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            taskDetails &&
              taskDetails.acceptance_criteria.replace(/\n/g, "<br />")
          ),
        }}
      />
      <div className="row bottom-border">
        <div className="col-lg-6 col-md-6 col-12 skills-header">
          Skills & Expertise
          <div className="skills-type">
            {taskDetails && taskDetails.experience_level}
          </div>
        </div>

        <div className="col-lg-6 col-md-6 col-12">
          <div className="skills-container2 flex-lg-row flex-md-column flex-column">
            {taskDetails &&
              taskDetails.skills &&
              taskDetails.skills.map((skills: any) => (
                <div className=" skill-wrapper pb-3 " key={skills.skill}>
                  <div className="skill">{skills.skill}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

{((localStorage.getItem("j_type")=="1" &&  taskDetails && taskDetails.bid_type) || (localStorage.getItem("e_type")=="1")) && <div className="row bottom-border">
        <div className="col-lg-6 col-md-6 col-12 skills-header">Placed Bids</div>

        <div className="col-lg-6 col-md-6 col-12 d-flex flex-lg-row flex-md-row flex-column">
          <div className="min-bid me-lg-5 me-md-5 me-0 mb-lg-0 mb-md-0 mb-3">Min Bid Price: {(taskDetails && taskDetails.min_bid_value)?taskDetails.min_bid_value:'N/A'} {taskDetails && taskDetails.currency}</div>
          <div className="min-bid">Max Bid Price: {(taskDetails && taskDetails.max_bid_value)?taskDetails.max_bid_value:'N/A'} {taskDetails && taskDetails.currency}</div>
        </div>
      </div>}

      <div>
        <div className="attachment-header">Attachments</div>
        <ViewAttachment attachments={taskDetails && taskDetails.attachments} />
      </div>

      <CustomModal
        show={updatemodalShow}
        toggle={toggleUpdateModal}
        ModalHeader="Update Task"
      >
        <UpdateTask
        task_id=""
          taskData={taskDetails}
          closeModal={toggleUpdateModal}
          recallData={recallTaskData}
        />
      </CustomModal>

      <CustomModal
        show={viewBidmodalShow}
        toggle={toggleBidViewModal}
        ModalHeader="Place Bid"
      >
        <CreateBid details={taskDetails} closeModal={toggleBidViewModal} />
      </CustomModal>
    </>
  );
};
