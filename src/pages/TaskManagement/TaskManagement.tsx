import { useEffect, useState } from "react";
import Button from "../../core/Button/Button";
import { useTranslation } from "react-i18next";
import "./TaskManagement.scss";
import InputField from "../../core/InputField/InputField";
import { Form } from "formik";
import CustomModal from "../../components/Modal/Modal";
import { CreateTask } from "./CreateTask/CreateTask";
import ImageComponent from "../../core/Image/Image";
import taskintro from "../../assets/task-intro.png";
import { getAllTaskApi } from "../../services/task.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { getTaskApiAttributes } from "../../types/api_types";
import { convertUtcDateToLocalTime } from "../../utils/date_time";
import { ViewTask } from "./ViewTask/ViewTask";
import { UpdateTask } from "./UpdateTask/UpdateTask";
import notification from "../../assets/notification.png";
import { useNavigate } from "react-router-dom";
import { CreateBid } from "../BidManagement/CreateBid/CreateBid";
import DOMPurify from "dompurify";
import { jsonToUrlParams } from "../../utils/json_to_params.service";
import Pagination from "../../components/Pagination/Pagination";
import { Footer } from "../../components/Footer/Footer";
import { NoData } from "../../components/NoData/NoData";

export const TaskManagement = () => {
  var tablePageIndex = 1;
  const [currentPage, setCurrentPage] = useState(tablePageIndex);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [dataCount, setDataCount] = useState<number>(0);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);

  const [viewmodalShow, setViewModalShow] = useState(false);
  const toggleViewModal = () => setViewModalShow(!viewmodalShow);

  const [updatemodalShow, setUpdateModalShow] = useState(false);
  const toggleUpdateModal = () => setUpdateModalShow(!updatemodalShow);

  const [tasks, setTasks] = useState([]);
  const [singletask, setSingleTask] = useState<getTaskApiAttributes>();

  const [notificationdata, setNotifications] = useState([1, 2, 3, 4, 5]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getAllTasks();
  }, [searchValue]);

  const getAllTasks = async () => {
    let params = {
      page: tablePageIndex,
      limit: itemsPerPage,
    };

    const tasks: any = await getAllTaskApi(jsonToUrlParams(params));

    if (tasks.status == 200) {
      setTasks(tasks.data.data);
      setDataCount(tasks.data.count);
    } else {
      ErrorNotification(tasks.message);
    }
  };

  const handlePageChange = async (pageNumber: any) => {
    await setCurrentPage(pageNumber);
    tablePageIndex = pageNumber;
    getAllTasks();
  };
  return (
    <div className="p-lg-5 p-md-5 p-3">
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
        <div className="d-flex flex-lg-row flex-md-row flex-column">
          <div
            className={`filter-btn ${searchValue == "" ? "act" : ""}`}
            onClick={() => setSearchValue("")}
          >
            All
          </div>
          <div
            className={`filter-btn ${
              searchValue == "in_progress" ? "act" : ""
            }`}
            onClick={() => setSearchValue("in_progress")}
          >
            In Progress
          </div>
          <div
            className={`filter-btn ${searchValue == "completed" ? "act" : ""}`}
            onClick={() => setSearchValue("completed")}
          >
            Completed
          </div>
          <div
            className={`filter-btn ${searchValue == "pending" ? "act" : ""}`}
            onClick={() => setSearchValue("pending")}
          >
            Pending
          </div>
        </div>

        {/* <div>
          <Button
            buttonText="Create Task"
            onClickHandler={() => toggleModal()}
            className="create-btn"
          ></Button>
        </div> */}
      </div>

      <div className="row pt-4">
        <div className="col-lg-12 col-md-12 col-12">
          {tasks &&
            tasks.map((values: getTaskApiAttributes) => (
              <div className="tasks m-3 ps-3">
                <div className=" d-flex justify-content-between pt-3">
                  <div className="task-title-view">{values.title}</div>

                  <div className="task-budget pe-4">
                    {values.currency} {values.budget}
                  </div>
                </div>
                <div className="task-details">
                  <div className="progress-lbl pe-2">In Progress</div>
                  <div className="pe-2">Task Code</div>
                  <div className="pe-2">
                    Deadline {convertUtcDateToLocalTime(values.task_deadline)}
                  </div>
                </div>
                {/* <div className="deadline pt-2">
                  Bid Deadline :-{" "}
                  {convertUtcDateToLocalTime(values.bid_deadline)}
                </div>
                <div className="deadline pt-1">
                  Task Deadline :-{" "}
                  {convertUtcDateToLocalTime(values.task_deadline)}
                </div> */}
                <div
                  className="task-description pt-3 pb-2 pe-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      values.description.replace(/\n/g, "<br />")
                    ),
                  }}
                />
                <div className="deadline pt-2">
                  Bid Deadline {convertUtcDateToLocalTime(values.bid_deadline)}
                </div>
                <div className="d-flex justify-content-end pb-3 pe-3">
                  {/* <Button
                    buttonText="Update"
                    onClickHandler={() => {
                      setSingleTask(values);
                      toggleUpdateModal();
                    }}
                    className="update-btn me-2"
                  ></Button> */}

                  <Button
                    buttonText="View"
                    onClickHandler={() => {
                      navigate("/task-management/" + values.id);
                    }}
                    className="update-btn"
                  ></Button>
                </div>
              </div>
            ))}

{tasks.length==0 && <NoData noData="No Task Data Found" noDataDesc=""/>}
        </div>
        {/* <div style={{display:'none'}} className="col-3 hide-mobile">
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
        </div> */}

        <Pagination
          itemsPerPage={itemsPerPage}
          count={dataCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

   

      <CustomModal
        show={modalShow}
        toggle={toggleModal}
        ModalHeader="Create Task"
      >
        <CreateTask closeModal={toggleModal} recallData={getAllTasks} />
      </CustomModal>
    </div>
  );
};
