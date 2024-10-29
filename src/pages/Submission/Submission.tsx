import { Field, Formik } from "formik";
import "./Submission.scss";
import { useEffect, useState } from "react";
import { Form, useParams } from "react-router-dom";
import { AddSubmit } from "./AddSubmit/AddSubmit";
import { SubmissionHistory } from "./SubmissionHistory/SubmissionHistory";
import { useUserRole } from "../../hooks/HasRole";

export const Submission = () => {
  const id = useParams();

    const [isUpdate,setIsUpdate] = useState(true)
    const [isHistory,setIsHistory] = useState(false)


  return (
    <div className="p-5">
      <div className="pb-5 upd-task-heading">Update Task</div>

      <div className="d-flex">
        <div onClick={()=>{setIsUpdate(true);setIsHistory(false)}} className={`filter-btn ${isUpdate?'act':''}`}>Update</div>
        <div onClick={()=>{setIsUpdate(false);setIsHistory(true)}} className={`filter-btn ${isHistory?'act':''}`}>History</div>
      </div>

{isUpdate &&      <div>
        <AddSubmit id={id} />
      </div>}

{isHistory &&      <div>
        <SubmissionHistory id={id} />
      </div>}
 
    </div>
  );
};
