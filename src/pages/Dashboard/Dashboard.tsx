import ImageComponent from "../../core/Image/Image";
import "./Dashboard.scss";
import dashboard1 from "../../assets/dashboard1.png";
import dashboard2 from "../../assets/dashboard2.png";
import Button from "../../core/Button/Button";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllTaskApi } from "../../services/task.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import {
  convertUtcDateToLocalTime,
  convertUtcTimeToLocalTime,
} from "../../utils/date_time";
import { getTaskApiAttributes } from "../../types/api_types";
import notification from "../../assets/notification.png";
import CustomModal from "../../components/Modal/Modal";
import DOMPurify from "dompurify";
import { CreateBid } from "../BidManagement/CreateBid/CreateBid";
import { AddLanguage } from "../../components/Language/AddLanguage/AddLanguage";
import { VerifyFaceID } from "../../components/FaceID/VerifyFaceID";
import { NoData } from "../../components/NoData/NoData";

export const Dashbaord = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [notificationdata, setNotifications] = useState([1, 2, 3, 4, 5]);
  const [viewBidmodalShow, setViewBidModalShow] = useState(false);
  const toggleBidViewModal = () => setViewBidModalShow(!viewBidmodalShow);
  const [singleTask, setSingleTask] = useState<getTaskApiAttributes>();
  const [fIdModalShow, setFIdModalShow] = useState(false);
  const [isFaceIdVerified, setFaceIdVerified] = useState(false);

  useEffect(() => {
    getAllTasks();

    const is_fif_v = localStorage.getItem("is_face_id_verified");
    const faceIdVerified = is_fif_v === "1";
    setFaceIdVerified(faceIdVerified);
  }, []);

  const toggleFIdModal = () => {
    const is_fif_v = localStorage.getItem("is_face_id_verified");
    if (is_fif_v === "1") {
      ErrorNotification("Already proceed with the verification");
    } else {
      setFIdModalShow(!fIdModalShow);
    }
  };

  const getAllTasks = async () => {
    const tasks: any = await getAllTaskApi("");
    try {
      if (tasks.status == 200) {
        setTasks(tasks.data.data);
      } else {
        ErrorNotification(tasks.message);
      }
    } catch (error: any) {}
  };

  return (
    <div className="p-lg-5 p-md-5 p-4">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-12">
          <div className="row intro-box">
            <div className="col-lg-8 col-md-8 col-12">
              <div className="intro-header">
                Welcome {localStorage.getItem("name")}!
              </div>
              <div className="intro-description pt-3">
                We want to ensure you get the best experience possible. By
                adding languages to your profile, you help us match you with
                professionals who can communicate effectively in your preferred
                language.
              </div>

              <div
                className="pt-2 d-flex flex-lg-row flex-md-row flex-column"
                style={{ display: "flex", alignItems: "center" }}
              >
                {(localStorage.getItem("has_associated_company_details") ==
                  "0" ||
                  localStorage.getItem("has_completed_basic_details") == "0" ||
                  localStorage.getItem("has_languages") == "0" ||
                  localStorage.getItem("has_skills") == "0") && (
                  <Button
                    className="intro-button "
                    buttonText="Complete Profile"
                    onClickHandler={() => navigate("/profile")}
                  />
                )}
                <div style={{ width: "10px" }}></div>
                {!isFaceIdVerified && (
                  <Button
                    className="intro-button mt-lg-0 mt-md-0 mt-3"
                    buttonText="Face ID Verification"
                    onClickHandler={() => toggleFIdModal()}
                  />
                )}
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12 pt-lg-0 pt-md-0 pt-5">
              <ImageComponent
                alt="dashboard1"
                src={dashboard1}
                className="img-fluid"
              />
            </div>
          </div>
          {localStorage.getItem("e_type") == "1" && (
            <>
              <div className="pt-5">
                <div className="client-dash-header">
                  Connecting you to the right freelancer
                </div>
                <div className="client-dash-description pt-2">
                  Search diverse freelancer skills to match your exact needs,
                  ensuring you find the perfect expert for your project. Add
                  your preferences or search keywords to tailor your results.
                </div>
              </div>

              <div className="pt-3">
                <Button
                  className="intro-button"
                  buttonText="Create a Task"
                  onClickHandler={() => navigate("task-management")}
                />
              </div>

              <div className="pt-5 client-dash-header">Your Recent Task</div>

              <div>
                {tasks &&
                  tasks.map(
                    (values: getTaskApiAttributes, index: any) =>
                      index === 0 && (
                        <div className="tasks m-3 ps-3">
                          <div className=" d-flex justify-content-between pt-3">
                            <div className="task-title-view">
                              {values.title}
                            </div>
                            <div className="task-budget pe-4">
                              {values.currency} {values.budget}
                            </div>
                          </div>

                          <div className="deadline pt-2">
                            Bid Deadline :-{" "}
                            {convertUtcDateToLocalTime(values.bid_deadline)}
                          </div>
                          <div className="deadline pt-1">
                            Task Deadline :-{" "}
                            {convertUtcDateToLocalTime(values.task_deadline)}
                          </div>
                          <div
                            className="task-description pt-3 pb-2 pe-2"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                values.description.replace(/\n/g, "<br />")
                              ),
                            }}
                          />

                          <div className="d-flex justify-content-end pb-3 pe-3">
                            <Button
                              buttonText="Update"
                              // onClickHandler={() => {
                              //   setSingleTask(values);
                              //   toggleUpdateModal();
                              // }}
                              className="update-btn me-2"
                            ></Button>

                            <Button
                              buttonText="View"
                              onClickHandler={() => {
                                navigate("/task-management/" + values.id);
                              }}
                              className="view-btn"
                            ></Button>
                          </div>
                        </div>
                      )
                  )}

                {tasks.length == 0 && (
                  <NoData
                    noData="No Recent Task Data"
                    noDataDesc="Get Started by creating a task"
                  />
                )}
              </div>
            </>
          )}

          {localStorage.getItem("j_type") == "1" && (
            <>
              <div className="pt-5">
                <div className="client-dash-header">Explore Related Tasks</div>
              </div>

              <div>
                {tasks &&
                  tasks.map(
                    (values: getTaskApiAttributes, index: any) =>
                      index < 2 && (
                        <div className="tasks m-3 ps-3">
                          <div className="post-time pt-3">
                            Posted{" "}
                            {convertUtcTimeToLocalTime(values.created_on)}
                          </div>
                          <div className=" d-flex justify-content-between ">
                            <div className="task-title-view">
                              {values.title}
                            </div>
                            <div className="task-budget pe-4">
                              {/* {values.currency} {values.budget} */}
                            </div>
                          </div>

                          <div className="deadline pt-2">
                            Bid Deadline :-{" "}
                            {convertUtcDateToLocalTime(values.bid_deadline)}
                          </div>
                          <div className="deadline pt-1">
                            Task Deadline :-{" "}
                            {convertUtcDateToLocalTime(values.task_deadline)}
                          </div>
                          {/* <div className="task-description pt-3 pb-2 pe-2">
                            {values.description}
                          </div> */}

                          <div
                            className="task-description pt-3 pb-2 pe-2"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                values.description.replace(/\n/g, "<br />")
                              ),
                            }}
                          />

                          <div className="skills-container2 mb-3 mt-4">
                            {values.skills &&
                              values.skills.map((skill: any) => (
                                <div className="skill-wrapper pb-3">
                                  <div className="skill-bid">
                                    {skill.skill}{" "}
                                  </div>
                                </div>
                              ))}
                          </div>

                          <div className="d-flex justify-content-end pb-3 pe-3">
                            {values.is_accepted == 0 &&
                              values.is_completed == 0 && (
                                <Button
                                  buttonText="Place a Bid"
                                  onClickHandler={() => {
                                    setSingleTask(values);
                                    toggleBidViewModal();
                                  }}
                                  className="task-btn me-2"
                                ></Button>
                              )}

                            <Button
                              buttonText="View"
                              onClickHandler={() => {
                                navigate("/task-management/" + values.id);
                              }}
                              className="view-btn"
                            ></Button>
                          </div>
                        </div>
                      )
                  )}
              </div>
            </>
          )}
        </div>
        <div className="col-lg-4 col-md-4 col-12 p-lg-5 p-md-5 p-4 d-flex justify-content-center">
          <div>
            <div className="d-flex justify-content-center">
              <ImageComponent
                alt="dashboard2"
                src={dashboard2}
                className="img-fluid w-75"
              />
            </div>
            <div className="ps-5 dashboard-header2 pt-3">
              Learn how to get started on Sparetan
            </div>
            <div className="pt-2 ps-5">
              <Button className="intro-button" buttonText="Learn More" />
            </div>

            <div className="pt-5" style={{ display: "none" }}>
              {notificationdata &&
                notificationdata.map((notify: any) => (
                  <div className="d-flex notify-box mb-3">
                    <div>
                      <img src={notification} />
                    </div>
                    <div className="ps-3">
                      <div className="notify-name">Hannah Flores</div>
                      <div className="notify-desc">
                        Complete payment 10:00 AM
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* <CustomModal
        show={updatemodalShow}
        toggle={toggleUpdateModal}
        ModalHeader="Update Task"
      >
        <UpdateTask
          taskData={taskDetails}
          closeModal={toggleUpdateModal}
          recallData={console.log}
        />
      </CustomModal> */}

      <CustomModal
        show={viewBidmodalShow}
        toggle={toggleBidViewModal}
        ModalHeader="Place Bid"
      >
        <CreateBid details={singleTask} closeModal={toggleBidViewModal} />
      </CustomModal>

      <CustomModal
        show={fIdModalShow}
        toggle={toggleFIdModal}
        ModalHeader=""
        size={"md"}
      >
        <VerifyFaceID toggleFIdModal={toggleFIdModal} />
      </CustomModal>
    </div>
  );
};
