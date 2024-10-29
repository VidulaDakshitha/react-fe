import { Field, Form, Formik } from "formik";
import InputField from "../../../core/InputField/InputField";
import SelectField from "../../../core/SelectField/SelectField";
import Button from "../../../core/Button/Button";
import { createBidApi } from "../../../services/bid.service";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import {useState} from "react";

export const CreateBid = ({ details, closeModal }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    amount: "",
    description: "",
    currency: details && details.currency? details.currency : "",
    message: "",
    revision: 10,
    cover_letter: "",
    task_id: details && details.id,
    costs: [],
  };

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true)
    const bid_request: any = await createBidApi(values);
    setIsLoading(false);
    if (bid_request.status == 201) {
      toast.success("Bid created successfully");
      closeModal();
    } else {
      ErrorNotification(bid_request.message);
    }
  };
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} >
        {(formik) => (
          <Form className="ps-5 pe-5">
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

            <div className="row">
              <div className="col-12 label  pb-2">Message</div>

              <div className="col-12">
                <Field
                  as="textarea"
                  name="description"
                  className="task-input-desc mb-4"
                />
              </div>
            </div>

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
    </div>
  );
};
