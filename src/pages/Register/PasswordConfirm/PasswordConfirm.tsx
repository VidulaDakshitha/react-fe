import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import "./PasswordConfirm.scss";
import ImageComponent from "../../../core/Image/Image";
import RegisterBG from "../../../assets/register_bg.png";
import { PasswordInputField } from "../../../components/PasswordInput/PasswordInput";
import Button from "../../../core/Button/Button";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { setPasswordApi } from "../../../services/user.service";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import {useState} from "react";
import {toast} from "react-toastify";

export const PasswordConfirm = () => {
  const { t } = useTranslation();
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Minimum 8 characters required")
      .matches(/[a-z]/, "Password should have lower case character")
      .matches(/[A-Z]/, "Password should have upper case character")
      .matches(/\d/, "Password should have numbers")
      .matches(/[@$!%*?&#]/, "Password should have special character")
      .required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], "Password mismatch")
      .required("password confirm required"),
  });


  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true)
    setIsLoading(true);
    const register_request: any = await setPasswordApi(values, id ? id : "", token ? token : "");
    setIsLoading(false);
    if (register_request.status == 200) {
      toast.success("Password updated successfully");
      navigate("/login");
    } else {
      ErrorNotification(register_request.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row login-container">
        <div className="col-0 col-md-5 col-lg-5 login-left ">
          <div>
            <div className="logo">Sparetan</div>
            <div className="register-main-heading">
              {t("registerPage.mainHeading")}
            </div>
            <div className="register-sub-heading d-flex me-2">
              <div></div>
              {t("registerPage.subHeading1")}
            </div>
            <div className="register-sub-heading d-flex me-2">
              <div></div>
              {t("registerPage.subHeading2")}
            </div>
            <div className="d-flex justify-content-center pt-4">
              <ImageComponent
                src={RegisterBG}
                alt={t("registerPage.loginBackgroundAlt")}
                className="register_bg"
              />
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-md-7 col-12 d-flex align-items-center justify-content-center">
          <div>
            <div className="d-flex justify-content-center signup-header mb-4">
              {t("registerPage.signupHeader")}
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {(formik) => (
                <Form>
                  <div className="mb-3">
                    <PasswordInputField
                      label={t("registerPage.passwordLabel")}
                      name="password"
                      LabelclassName="labels-style"
                    />
                    {/* <ErrorMessage name="password" component="div" className="error" /> */}
                  </div>
                  <div className="mb-3">
                    <PasswordInputField
                      label={t("registerPage.confirmPasswordLabel")}
                      name="confirmPassword"
                      LabelclassName="labels-style"
                    />
                    {/* <ErrorMessage name="confirmPassword" component="div" className="error" /> */}
                  </div>

                  <div className="d-flex justify-content-center mt-5">
                    <Button
                      className="register-btn"
                      buttonText={t("registerPage.savePasswordButton")}
                      type="submit"
                      isLoading={isLoading}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
