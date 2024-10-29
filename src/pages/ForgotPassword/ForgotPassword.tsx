import loginBg from "../../assets/login_bg.png";

import ImageComponent from "../../core/Image/Image";
import InputField from "../../core/InputField/InputField";
import "./ForgotPassword.scss";
import { Form, Formik, useFormik } from "formik";
import SocialLoginButton from "../../components/SocialLoginButton/SocialLoginButton";
import Button from "../../core/Button/Button";
import { useTranslation } from "react-i18next";
import { forgotPasswordApi, loginApi } from "../../services/user.service";
import { forgotPassApiAttributes, loginApiAttributes } from "../../types/api_types";
import { ApiAttributes } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { PasswordInputField } from "../../components/PasswordInput/PasswordInput";
import ReconnectingWebSocket from "reconnecting-websocket";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { remote_chat_url_v1 } from "../../environment/environment";

export const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (
    values: forgotPassApiAttributes,
    { setSubmitting }: any
  ) => {
    setIsLoading(true); // Start loading
    const forgotpass_request: any = await forgotPasswordApi(values);
    setIsLoading(false); // End loading

    if (forgotpass_request.status == 200) {
      toast.success("Password reset mail sent successfully");
      navigate("/");
    } else {
      ErrorNotification(forgotpass_request.message);
    }
  };

  
  return (
    <div className="container-fluid">
      <div className="row login-container">
        <div className="col-0 col-md-5 col-lg-5 login-left d-flex align-content-between flex-wrap">
          <div className="logo">Sparetan</div>
          <div className="login-main-heading">{t("loginPage.mainHeading")}</div>
          <ImageComponent
            src={loginBg}
            alt={t("loginPage.loginBackgroundAlt")}
            className="img-fluid1"
          />
        </div>

        <div className="col-lg-7 col-md-7 col-12 d-flex align-items-center justify-content-center left-container">
          <div>
            <div className="login-header pb-3 text-center">
             Forgot Password?
            </div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {(formik) => (
                <Form>
                  <InputField
                    label=""
                    className="login-input mb-4"
                    name="email"
                    isDisabled={false}
                    fieldType="text"
                    placeholder={t("loginPage.usernameOrEmailPlaceholder")}
                  />

             
                  <div className="d-flex justify-content-center pb-3">
                    <Button
                      className="login-submit"
                      type="submit"
                      buttonText={"continue with email"}
                      isLoading={isLoading}
                    />
                  </div>
                </Form>
              )}
            </Formik>
            {/* <div className="row pb-3">
              <div className="col-6">
                <SocialLoginButton
                  platform="google"
                  onClick={console.log}
                  isDisabled={false}
                  isLoading={false}
                  className="google-login"
                />
              </div>

              <div className="col-6">
                <SocialLoginButton
                  platform="microsoft"
                  onClick={console.log}
                  isDisabled={false}
                  isLoading={false}
                  className="google-login"
                />
              </div>
            </div>

            <div className="row pb-3">
              <div className="col-6">
                <SocialLoginButton
                  platform="linkedin"
                  onClick={console.log}
                  isDisabled={false}
                  isLoading={false}
                  className="google-login"
                />
              </div>

              <div className="col-6">
                <SocialLoginButton
                  platform="apple"
                  onClick={console.log}
                  isDisabled={false}
                  isLoading={false}
                  className="google-login"
                />
              </div>
            </div>

            <div className="d-flex justify-content-center pb-5">
              <div className="col-6">
                <SocialLoginButton
                  platform="bankid"
                  onClick={console.log}
                  isDisabled={false}
                  isLoading={false}
                  className="google-login"
                />
              </div>
            </div> */}
           
          </div>
        </div>
      </div>
    </div>
  );
};
