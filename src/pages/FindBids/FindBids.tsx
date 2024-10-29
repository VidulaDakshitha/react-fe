import "./FindBids.scss";
import taskintro from "../../assets/task-intro.png";
import ImageComponent from "../../core/Image/Image";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { getAllTaskApi } from "../../services/task.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { getTaskApiAttributes } from "../../types/api_types";
import { convertUtcDateToLocalTime } from "../../utils/date_time";
import Button from "../../core/Button/Button";
import { useNavigate } from "react-router-dom";
import profile from "../../assets/profile.png";
import DOMPurify from "dompurify";
import { jsonToUrlParams } from "../../utils/json_to_params.service";
import Pagination from "../../components/Pagination/Pagination";
import CustomModal from "../../components/Modal/Modal";
import { CreateBid } from "../BidManagement/CreateBid/CreateBid";

export const FindBids = () => {
  var tablePageIndex = 1;
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(tablePageIndex);
  const [itemsPerPage, setitemsPerPage] = useState(5);
  const [dataCount, setDataCount] = useState<number>(0);
  const [searchValue, setSearchValue] = useState("");

  const [viewBidmodalShow, setViewBidModalShow] = useState(false);
  const toggleBidViewModal = () => setViewBidModalShow(!viewBidmodalShow);
  const [singleTask, setSingleTask] = useState<getTaskApiAttributes>();

  const [skills, setSkills] = useState([
    "Web Design",
    "Figma",
    "Mobile UI",
    "User Experience Design",
    "Responsive Design",
  ]);
  useEffect(() => {
    getAllTasks();
  }, [searchValue]);

  const handleSearchChange = (value: any) => {
    setSearchValue(value);
  };

  const getAllTasks = async () => {
    let params = {
      page: tablePageIndex,
      limit: itemsPerPage,
      keyword: searchValue,
    };

    const tasks: any = await getAllTaskApi(jsonToUrlParams(params));
    try {
      if (tasks.status == 200) {
        setTasks(tasks.data.data);
        setDataCount(tasks.data.count);
      } else {
        ErrorNotification(tasks.message);
      }
    } catch (error: any) {}
  };

  const handlePageChange = async (pageNumber: any) => {
    await setCurrentPage(pageNumber);
    tablePageIndex = pageNumber;
    getAllTasks();
  };

  return (
    <div className="p-lg-5 p-md-5 p-4">
      <div className="row">
        <div className="col-lg-9 col-md-9 col-12 order-lg-1 order-md-1 order-2">
          <div className="row banner-bg mb-5 p-3 hide-mobile">
            <div className="col-lg-8 col-md-8 col-12 ">
              <div className="banner-header ">
                Are you looking for part time job?
              </div>
              <div className="banner-description pt-3">
                Sparetan is a place where you can find great small task job
                effortlessly. You can find your job in various skills. More than
                10,000 are avaliable
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-12 pt-lg-0 pt-md-0 pt-3">
              <ImageComponent
                src={taskintro}
                alt="task-intro"
                className="img-fluid w-75"
              />
            </div>
          </div>

          <div className="w-100 ">
            <SearchBar
              widthClass={"search-size2"}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            {tasks &&
              tasks.map((values: getTaskApiAttributes, index: any) => (
                <div className="tasks m-3 ps-3">
                  <div className="post-time pt-3">
                    Posted on {convertUtcDateToLocalTime(values.created_on)}
                  </div>
                  <div className=" d-flex justify-content-between ">
                    <div className="task-title-view">{values.title}</div>
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
                    className="task-description pt-3 pb-3 pe-2"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        values.description.replace(/\n/g, "<br />")
                      ),
                    }}
                  />

                  <div className="skills-container2 mb-3 mt-4">
                    {values &&
                      values.skills.map((skill: any) => (
                        <div className="skill-wrapper pb-3">
                          <div className="skill-bid">{skill.skill} </div>
                        </div>
                      ))}
                  </div>

                  <div className="d-flex justify-content-end pb-3 pe-3">
                    {values.is_completed == 0 && values.is_accepted == 0 && (
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
              ))}
          </div>
        </div>
        <div className="col-lg-3 col-md-3 col-12 order-lg-2 order-md-2 order-1">
          <div className="prof-box p-5 mb-4">
            <div className="d-flex justify-content-center">
              <img src={profile} />
            </div>
            <div className="d-flex justify-content-center prof-name pt-2 pb-3">
              {localStorage.getItem("name")}
            </div>
            {/* <div className="d-flex justify-content-center pb-3">
              Software Engineer
            </div> */}
            <div className="d-flex justify-content-center">
              <div className="task-btn" onClick={() => navigate("/profile")}>
                Go to Profile
              </div>
            </div>
          </div>

          <div className="filter-box p-5">
            <div className="pb-3 filter-type">Type</div>
            <div className="row pb-2">
              <label className="chk-label">
                <input type="checkbox" className="me-2 chk-box" />
                Remote Jobs
              </label>
            </div>
            <div className="row pb-2">
              <label className="chk-label">
                <input type="checkbox" className="me-2 chk-box" />
                Hybrid
              </label>
            </div>
            <div className="row pb-2">
              <label className="chk-label">
                <input type="checkbox" className="me-2 chk-box" />
                Physical
              </label>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        count={dataCount}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <CustomModal
        show={viewBidmodalShow}
        toggle={toggleBidViewModal}
        ModalHeader="Place Bid"
      >
        <CreateBid details={singleTask} closeModal={toggleBidViewModal} />
      </CustomModal>
    </div>
  );
};
