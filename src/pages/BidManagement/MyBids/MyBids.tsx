import { useEffect, useState } from "react";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import { getAllTaskApi } from "../../../services/task.service";
import { getTaskApiAttributes } from "../../../types/api_types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { jsonToUrlParams } from "../../../utils/json_to_params.service";
import { DynamicTable } from "../../../components/DynamicTable/DynamicTable";
import { Spinner } from "../../../components/Spinner/Spinner";
import { SearchBarClear } from "../../../components/SearchBarWithClear/SearchBarClear";
import { Form, Formik } from "formik";
import CustomModal from "../../../components/Modal/Modal";

import Button from "../../../core/Button/Button";

import { getBidsOriginApi, getBidsOrigSummaryinApi } from "../../../services/bid.service";

export const MyBids = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedID, setSelectedID] = useState<string>();

  const [keyword, setKeyword] = useState("");


  // Define the type of the possible attributes
type JsonAttributes = {
  id?: number;
  title?: string;
  description?: string;
  budget?: number;
  currency?: string;
  bid_type?: string;
  bid_deadline?: string;
  task_deadline?: string;
  acceptance_criteria?: string;
  created_by?: string;
  job_type?: string;
  experience_level?: string;
  attachments?: string;
  files?: string;
  skills?: string[];
  is_completed?: boolean;
  is_accepted?: boolean;
  status?: string;
  required_skills?: string[];
  created_on?: string;
  updated_on?: string;
  updated_by?: string;
  min_bid_value?: number;
  max_bid_value?: number;
  sub_contractor_ids?: number[];
  sub_contractors?: string[];
  total_amount?: number;
  remaining_amount?: number;
  is_fully_paid?: boolean;
  progress?: number;
  exit_criteria?: string;
  communication_deadline?: string;
  communication_type?: string;
  is_sub_contractors_only?: boolean;
  is_origin_organization?: boolean;
  origin_organization?: string;
  is_post_approved?: boolean;
  is_post_rejected?: boolean;
  post_approved_by?: string;
  post_approved_on?: string;
  is_worker_organization?: boolean;
  manage_organization?: string;
  assignee?: string;
  manager?: string;
  post_status?: string;
  has_manager?: boolean;
  has_assignee?: boolean;
};

// Mapping keys to meaningful names
const attributeLabels: { [key: string]: string } = {
  id: 'ID',
  title: 'Title',
  description: 'Description',
  budget: 'Budget',
  currency: 'Currency',
  bid_type: 'Bid Type',
  bid_deadline: 'Bid Deadline',
  task_deadline: 'Task Deadline',
  acceptance_criteria: 'Acceptance Criteria',
  created_by: 'Created By',
  job_type: 'Job Type',
  experience_level: 'Experience Level',
  attachments: 'Attachments',
  files: 'Files',
  skills: 'Skills',
  is_completed: 'Is Completed',
  is_accepted: 'Is Accepted',
  status: 'Status',
  required_skills: 'Required Skills',
  created_on: 'Created On',
  updated_on: 'Updated On',
  updated_by: 'Updated By',
  min_bid_value: 'Min Bid Value',
  max_bid_value: 'Max Bid Value',
  sub_contractor_ids: 'Sub Contractor IDs',
  sub_contractors: 'Sub Contractors',
  total_amount: 'Total Amount',
  remaining_amount: 'Remaining Amount',
  is_fully_paid: 'Is Fully Paid',
  progress: 'Progress',
  exit_criteria: 'Exit Criteria',
  communication_deadline: 'Communication Deadline',
  communication_type: 'Communication Type',
  is_sub_contractors_only: 'Is Sub Contractors Only',
  is_origin_organization: 'Is Origin Organization',
  origin_organization: 'Origin Organization',
  is_post_approved: 'Is Post Approved',
  is_post_rejected: 'Is Post Rejected',
  post_approved_by: 'Post Approved By',
  post_approved_on: 'Post Approved On',
  is_worker_organization: 'Is Worker Organization',
  manage_organization: 'Manage Organization',
  assignee: 'Assignee',
  manager: 'Manager',
  post_status: 'Post Status',
  has_manager: 'Has Manager',
  has_assignee: 'Has Assignee',
  bid_count:'Bid Count',
  bid_status: 'Bid status'
};

  useEffect(() => {
    getAllTasks();
  }, [keyword, searchValue]);

  const getAllTasks = async () => {
    setIsLoading(true);
    let params:any = {
      page: tablePageIndex,
      limit: itemsPerPage,
      keyword: keyword,
      worker: 1,
    };

    if(searchValue=='accepted'){
      params.bid_type = 'in_progress'
    }

    if(searchValue=='rejected'){
      params.bid_type = 'rejected'
    }

    const tasks: any = await getBidsOriginApi(jsonToUrlParams(params));

    if (tasks.status == 200) {
      setIsLoading(false);
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

  const initialValues = {
    keyword: "",
  };

  const updateDataBtn = (row: { [key: string]: any }) => {
    console.log("visited")
    return (
      <div className="d-flex ">
        {/* <button className="employee-btn me-2" onClick={() => {setSelectedID(row["id"]); toggleUpdateModal()}}>Update</button> */}
        <button className="employee-btn" onClick={()=>navigate("/task-management/" + row["id"])}>View</button>
      </div>
    );
  };

  return (
    <div className="p-lg-5 p-md-5 p-3">
      <Formik initialValues={initialValues} onSubmit={console.log}>
        {({ handleChange, handleSubmit, values }) => (
          <Form>
            <div className="row space-between align-items-end mb-4">
              <div className="col-lg-6 col-md-6 col-12">
                <SearchBarClear
                  widthClass={"search-size3 search-bar-radious"}
                  onChange={setKeyword}
                  placeholder="Search tasks"
                  label="Search"
                  name="keyword"
                  clearFunction={() => setKeyword("")}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>


      <div className="d-flex justify-content-between mt-5 mb-5">
        <div className="d-flex flex-lg-row flex-md-row flex-column">
          <div
            className={`filter-btn ${searchValue == "" ? "act" : ""}`}
            onClick={() => setSearchValue("")}
          >
            All
          </div>
          <div
            className={`filter-btn ${
              searchValue == "accepted" ? "act" : ""
            }`}
            onClick={() => setSearchValue("accepted")}
          >
            In Progress
          </div>
          <div
            className={`filter-btn ${searchValue == "rejected" ? "act" : ""}`}
            onClick={() => setSearchValue("rejected")}
          >
            Rejected
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
      {isLoading ? (
        <Spinner size="large" />
      ) : tasks.length > 0 ? (
        <DynamicTable data={tasks} renderButton={updateDataBtn} attributeLabels={attributeLabels}/>
      ) : (
        <div className="text-center p-4">
          <h4>{t("No data available")}</h4>
        </div>
      )}



    </div>
  );
};
