import "./BidManagement.scss";
import { useEffect, useState } from "react";
import Button from "../../core/Button/Button";
import { useTranslation } from "react-i18next";
import InputField from "../../core/InputField/InputField";
import { Form } from "formik";
import CustomModal from "../../components/Modal/Modal";

import ImageComponent from "../../core/Image/Image";
import taskintro from "../../assets/task-intro.png";
import { getAllTaskApi } from "../../services/task.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { getTaskApiAttributes } from "../../types/api_types";
import { convertUtcDateToLocalTime } from "../../utils/date_time";

import notification from "../../assets/notification.png";
import { useNavigate } from "react-router-dom";
import { getBidsApi } from "../../services/bid.service";
import { UpdateBid } from "./UpdateBid/UpdateBid";

export const BidManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);

  const [viewmodalShow, setViewModalShow] = useState(false);
  const toggleViewModal = () => setViewModalShow(!viewmodalShow);

  const [updatemodalShow, setUpdateModalShow] = useState(false);
  const toggleUpdateModal = () => setUpdateModalShow(!updatemodalShow);

  const [bids, setBids] = useState([]);
  const [singleBid, setSingleBid] = useState<any>();

  const [notificationdata, setNotifications] = useState([1, 2, 3, 4, 5]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    getAllBids();
  }, [filterValue]);

  const getAllBids = async () => {
    const params = {
      status: filterValue,
    };

    const tasks: any = await getBidsApi(params);

    if (tasks.status == 200) {
      setBids(tasks.data.data);
    } else {
      ErrorNotification(tasks.message);
    }
  };

  return (
    <div className="p-5">
      {/* <div className="col-9 ">
          <div className="row banner-bg mb-5 p-3">
            <div className="col-8">
              <div className="banner-header">
                Are you looking for skilled people?
              </div>
              <div className="banner-description pt-3">
                Sparetan is a place where you can find great small task job
                effortlessly. You can find your required skills. More than 10,000
                skills are avaliable
              </div>
            </div>
            <div className="col-4">
              <ImageComponent
                src={taskintro}
                alt="task-intro"
                className="img-fluid w-75"
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between border-btm pb-4">
          <div className="task-mgmt-header">Task Management</div>
  
          <div>
            <Button
              buttonText="Create Task"
              onClickHandler={() => toggleModal()}
              className="create-btn"
            ></Button>
          </div>
        </div> */}

      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div
            className={`filter-btn ${filterValue === "" ? "act" : ""}`}
            onClick={() => setFilterValue("")}
          >
            All
          </div>
          <div
            className={`filter-btn ${filterValue === "in_progress" ? "act" : ""}`}
            onClick={() => setFilterValue("in_progress")}
          >
            In Progress
          </div>
          <div
            className={`filter-btn ${filterValue === "completed" ? "act" : ""}`}
            onClick={() => setFilterValue("completed")}
          >
            Completed
          </div>
          <div
            className={`filter-btn ${filterValue === "pending" ? "act" : ""}`}
            onClick={() => setFilterValue("pending")}
          >
            Pending
          </div>
        </div>
      </div>

      <div className="row pt-4">
        <div className="col-9">
          {bids &&
            bids.map((bid: any) => (
              <div className="bid-details-box mb-4">
                <div className="bid-time">Posted 5 hours ago</div>
                <div className="bid-title pt-3">
                  {bid && bid.task && bid.task.title}
                </div>
                <div className="bid-description pt-3">
                  {bid && bid.description}
                </div>
                <div className="row">
                  <div className="col-8">
                    <div className="row pt-3">
                      {bid &&
                        bid.task &&
                        bid.task.skills &&
                        bid.task.skills.map((skills: any) => (
                          <div className="col-3 pb-3">
                            <div className="skill">{skills.skill}</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="col-4 d-flex align-items-center justify-content-end">
                    {bid && bid.is_accepted == 0 && (
                      <div
                        className="me-3 task-btn"
                        onClick={() => {
                          setSingleBid(bid);
                          toggleModal();
                        }}
                      >
                        Edit Bid
                      </div>
                    )}
                    {bid && bid.is_accepted == 1 && (
                        <Button
                        className="view-btn2 me-2"
                        buttonText={"Chat"}
                        type="button"
                        onClickHandler={() => navigate("/chat/?id="+bid.client_id)}
                      />
                    )}

                    {bid && bid.is_accepted == 1 && (
                      <Button
                        className="task-btn"
                        buttonText={"View"}
                        type="button"
                        onClickHandler={() => navigate("/submission/" + bid.task.id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="col-3">
          {notificationdata &&
            notificationdata.map((notify: any) => (
              <div className="d-flex notify-box mb-3">
                <div>
                  <img src={notification} />
                </div>
                <div className="ps-3">
                  <div className="notify-name">Hannah Flores</div>
                  <div className="notify-desc">Complete payment 10:00 AM</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <CustomModal
        show={modalShow}
        toggle={toggleModal}
        ModalHeader="Update Bid"
      >
        <UpdateBid
          closeModal={toggleModal}
          recallData={getAllBids}
          details={singleBid}
        />
      </CustomModal>
      {/*
        <CustomModal
          show={viewmodalShow}
          toggle={toggleViewModal}
          ModalHeader="View Task"
        >
          <ViewTask taskData={singletask} />
        </CustomModal> */}
    </div>
  );
};
