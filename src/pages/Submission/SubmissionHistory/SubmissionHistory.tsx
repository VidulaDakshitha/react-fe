import { useEffect, useState } from "react";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import { getSubmissionApi, UpdateSubmissionInvoiceApi } from "../../../services/submission.service";
import "./SubmissionHistory.scss";
import { ViewAttachment } from "../../../components/ViewAttachment/ViewAttachment";
import { Accordion } from "react-bootstrap";
import InvoiceUpload from "../../../components/InvoiceUpload/InvoiceUpload";
import InputField from "../../../core/InputField/InputField";
import SelectField from "../../../core/SelectField/SelectField";
import { useUserRole } from "../../../hooks/HasRole";
import { Form, Formik } from "formik";
import Button from "../../../core/Button/Button";
import { toast } from "react-toastify";

export const SubmissionHistory = ({ id }: any) => {
  const [submissions, setSubmissions] = useState([]);
  const [invoiceData, setInvoiceData] = useState<any>([]);
  const { roles, hasRole } = useUserRole();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    bid_id: id ? id.id : "",
    description: "",
    invoices: invoiceData,
    amount: "",
    currency: "SEK",
  };


  useEffect(() => {
    getAllSubmissions();
  }, []);

  const getAllSubmissions = async () => {
    const tasks: any = await getSubmissionApi(id.id);

    if (tasks.status == 200) {
      setSubmissions(tasks.data.data);
    } else {
      ErrorNotification(tasks.message);
    }
  };


  const handleInvoiceChange = async (
    files: { file: string }[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    console.log("Uploaded Files:", files);
    setInvoiceData(files);
    setFieldValue("invoices", files);
  };

  const onSubmit = async (values: any,id:any, { setSubmitting }: any) => {
    setIsLoading(true);
    let data:any = {
      is_invoiced: invoiceData.length > 0 ? 1 : 0,
      description: values.description,
      invoices: [
        {
          amount: values.amount,
          file: invoiceData.length > 0 ? invoiceData[0].file : "",
        },
      ],
    };

    if(['consultant'].some((role:any) => hasRole(role)) ){
      delete data.invoices

    }

  
    const bid_request: any = await UpdateSubmissionInvoiceApi(data,id.id);
    setIsLoading(false);
    if (bid_request.status == 201) {
      toast.success("Invoice successfully added");
    } else {
      ErrorNotification(bid_request.message);
    }
  };

  
  return (
    <div>
      {submissions &&
        submissions.map((submit: any) => (
          <div className="p-3 mt-4 submit-bg">
            <div className="submission-time pb-3">{submit.created_on}</div>
            <div className="complete-time pb-1">Task Completion Time</div>
            <div className="pb-3">6 hours</div>
            <div className="label mb-3">Description</div>
            <div>
              <textarea
                className="task-input-desc mb-4"
                value={submit.description}
              ></textarea>
            </div>
            <div className="status-lbl">Submissions</div>

<ViewAttachment attachments={submit.subtask_files} />


<div className="status-lbl pt-5">Invoices</div>

<ViewAttachment attachments={submit.sub_task_invoice} />

{['billing','admin'].some((role:any) => hasRole(role)) && <div className="mb-5 mt-5">
  <Formik initialValues={initialValues} onSubmit={(values, actions) => onSubmit(values, submit, actions)}>
   {(formik) => (
          <Form>
                <Accordion>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header className="invoice-header">
                      Upload Invoice
                    </Accordion.Header>
                    <Accordion.Body>
                      <InvoiceUpload
                        onFilesChange={(files) =>
                          handleInvoiceChange(files, formik.setFieldValue)
                        }
                      />

                      <div className="mb-1 mt-3">Invoice Amount</div>
                      <div className="input-group d-flex">
                        <InputField
                          label=""
                          className="budget-input mb-4"
                          name="amount"
                          isDisabled={false}
                          fieldType="number"
                          placeholder={""}
                        />

                        <div className="input-group-append">
                          <SelectField
                            isDisabled={true}
                            name="currency"
                            options={[
                              {
                                value: "USD",
                                label: "USD",
                              },
                              {
                                value: "SEK",
                                label: "SEK",
                              },
                              {
                                value: "EUR",
                                label: "EUR",
                              },
                            ]}
                            label={""}
                            className="currency-select mb-3"
                          />
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>

                <div>
                <div className="d-flex justify-content-end mt-1 pb-lg-0 pb-4">
                  <Button
                    className="task-btn"
                    buttonText={"Submit"}
                    type="submit"
                    isLoading={isLoading}
                  />
                </div>
              </div>
                </Form>
        )}
      </Formik>
              </div>}
</div>
        ))}

      {submissions && submissions.length == 0 && (
        <div className="no-bids submit-bg p-3 mt-4 ">
          No previous submissions available
        </div>
      )}
    </div>
  );
};
