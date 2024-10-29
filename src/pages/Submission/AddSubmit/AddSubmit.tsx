import { Field, Form, Formik } from "formik";
import { useState } from "react";
import Button from "../../../core/Button/Button";
import ImageUpload from "../../../components/FileUpload/FileUpload";
import { createSubmissionApi } from "../../../services/submission.service";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import InvoiceUpload from "../../../components/InvoiceUpload/InvoiceUpload";
import InputField from "../../../core/InputField/InputField";
import SelectField from "../../../core/SelectField/SelectField";
import { Accordion } from "react-bootstrap";
import "./AddSubmit.scss";
import { useUserRole } from "../../../hooks/HasRole";
export const AddSubmit = ({ id }: any) => {
  const { roles, hasRole } = useUserRole();
  const [filesData, setFilesData] = useState<any>([]);
  const [invoiceData, setInvoiceData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    bid_id: id ? id.id : "",
    description: "",
    from_date: "2024-06-10 00:00:00",
    to_date: "2024-06-16 00:00:00",
    files: filesData,
    invoices: invoiceData,
    amount: "",
    currency: "SEK",
  };

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);
    let data:any = {
      task_id: id ? id.id : "",
      from_date: "2024-10-01 00:00:00",
      to_date: "2024-10-30 00:00:00",
      files: filesData,
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

    
  
    const bid_request: any = await createSubmissionApi(data);
    setIsLoading(false);
    if (bid_request.status == 201) {
      toast.success("Submission successfully made");
    } else {
      ErrorNotification(bid_request.message);
    }
  };

  const handleFilesChange = async (
    files: { file: string }[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    console.log("Uploaded Files:", files);
    setFilesData(files);
    setFieldValue("files", files);
  };

  const handleInvoiceChange = async (
    files: { file: string }[],
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    console.log("Uploaded Files:", files);
    setInvoiceData(files);
    setFieldValue("invoices", files);
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => (
          <Form>
            <div className="p-3 mt-4 submit-bg">
    {['consultant','admin'].some((role:any) => hasRole(role)) &&          <>
              <div className="row">
                <div className="col-12 label pb-2">Description</div>
                <div className="col-12">
                  <Field
                    as="textarea"
                    name="description"
                    className="task-input-desc mb-4"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  onFilesChange={(files) =>
                    handleFilesChange(files, formik.setFieldValue)
                  }
                />
              </div>
</>}
             {['billing','admin'].some((role:any) => hasRole(role)) && <div className="mb-5 mt-5">
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
              </div>}

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
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
