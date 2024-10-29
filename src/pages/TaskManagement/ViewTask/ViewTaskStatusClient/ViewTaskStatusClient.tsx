import { ProgressBar } from "react-bootstrap";
import "./ViewTaskStatusClient.scss";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import doc from "../../../../assets/doc.png";
import Button from "../../../../core/Button/Button";
import { getSubmissionApi } from "../../../../services/submission.service";
import { ErrorNotification } from "../../../../components/ErrorNotification/ErrorNotification";
import { ViewAttachment } from "../../../../components/ViewAttachment/ViewAttachment";
import {
  convertUtcDateToLocalTime,
  convertUtcTimeToLocalTime,
} from "../../../../utils/date_time";
import { NoData } from "../../../../components/NoData/NoData";

export const ViewTaskStatusClient = ({ task_id }: any) => {
  const [attachment, Attachments] = useState([1, 2, 3, 4]);
  const now = 60;

  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    getAllSubmissions();
  }, []);

  const getAllSubmissions = async () => {
    const tasks: any = await getSubmissionApi(task_id.id);

    if (tasks.status == 200) {
      setSubmissions(tasks.data.data);
    } else {
      ErrorNotification(tasks.message);
    }
  };

  const initialValues = {
    description: "",
  };

  // Handle form submission
  const onSubmit = async (values: any, { setSubmitting }: any) => {
    // values.bid_type = values.bid_type ? "open" : "closed";
    console.log(values);
  };
  return (
    <div>
      <div className="">
        {submissions &&
          submissions.map((submit: any) => (
            <div className="pb-5 status-section2">
              <div className="status-lbl pb-3">
                Updated On:{" "}
                <span className="status-date-time">
                  {convertUtcDateToLocalTime(submit.created_on)}{" "}
                  {convertUtcTimeToLocalTime(submit.created_on)}
                </span>
              </div>
              <div className="status-lbl">Description</div>
              <div className="col-12">
                <textarea
                  name="description"
                  className="task-input-desc mb-4"
                  value={submit.description}
                ></textarea>
              </div>

              <div className="status-lbl">Submissions</div>

              <ViewAttachment attachments={submit.subtask_files} />


              <div className="status-lbl pt-5">Invoices</div>

              <ViewAttachment attachments={submit.sub_task_invoice} />
            </div>
          ))}
        {submissions && submissions.length > 0 && (
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {(formik) => (
              <Form>
                <div className="pt-4 pb-5 d-flex justify-content-end">
                  <Button
                    className="task-btn"
                    buttonText={"Payment"}
                    type="submit"
                    onClickHandler={console.log}
                  />
                </div>
              </Form>
            )}
          </Formik>
        )}

        {submissions && submissions.length == 0 && (
         <NoData noData="No status data available" noDataDesc="Status data will be available after task progress update"/>
        )}
      </div>
    </div>
  );
};
