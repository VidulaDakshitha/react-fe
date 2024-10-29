import "./AddEmployee.scss";
import { Form, Formik } from "formik";
import Button from "../../../../core/Button/Button";
import SelectField from "../../../../core/SelectField/SelectField";
import { useState } from "react";
import { EmployeeRegisterApi } from "../../../../services/user.service";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../../components/ErrorNotification/ErrorNotification";
import InputField from "../../../../core/InputField/InputField";
import { createTaskProps } from "../../../../types/types";

export const AddEmployee = ({ closeModal, recallData }: createTaskProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    is_client: localStorage.getItem("type") == "client" ? 1 : 0,
    is_freelancer: localStorage.getItem("type") != "client" ? 1 : 0,
    is_company: 1,
  };

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);
    const register_request: any = await EmployeeRegisterApi(values);
    setIsLoading(false);
    if (register_request.status == 201) {
      toast.success("Account created. proceed with email verification process");
      closeModal();
      recallData();
    } else {
      ErrorNotification(register_request.data.message);
    }
  };

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => (
          <Form className="ps-lg-5 pe-lg-5 ps-1 pe-1">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <InputField
                  name="first_name"
                  placeholder=""
                  label={"First Name"}
                  className="register-input mb-4"
                  fieldType="text"
                  LabelclassName="register-lbl"
                />
              </div>
              <div className="col-lg-12 col-md-12 col-12">
                <InputField
                  name="last_name"
                  placeholder=""
                  label={"Last Name"}
                  className="register-input mb-4"
                  fieldType="text"
                  LabelclassName="register-lbl"
                />
              </div>
            </div>
            <InputField
              name="email"
              placeholder=""
              label={"Email"}
              className="register-input mb-3"
              fieldType="email"
              LabelclassName="register-lbl"
            />
            {/* <InputField
                    name="user_name"
                    placeholder=""
                    label={t("registerPage.userName")}
                    className="register-input mb-3"
                    fieldType="text"
                  /> */}

            <SelectField
              name="country"
              options={[
                {
                  value: "sweden",
                  label: "Sweden",
                },
              ]}
              label={"Select Country"}
              className="register-input mb-3"
              LabelclassName="register-lbl"
            />

            <div className="d-flex justify-content-center mt-5 pb-lg-0 pb-4">
              <Button
                className="register-btn"
                buttonText={"Add Employee"}
                type="submit"
                isLoading={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
