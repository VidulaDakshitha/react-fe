import loginBg from "../../assets/login_bg.png";

import ImageComponent from "../../core/Image/Image";
import InputField from "../../core/InputField/InputField";
import "./Login.scss";
import { Form, Formik, useFormik } from "formik";
import SocialLoginButton from "../../components/SocialLoginButton/SocialLoginButton";
import Button from "../../core/Button/Button";
import { useTranslation } from "react-i18next";
import { loginApi } from "../../services/user.service";
import { loginApiAttributes } from "../../types/api_types";
import { ApiAttributes } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { PasswordInputField } from "../../components/PasswordInput/PasswordInput";
import ReconnectingWebSocket from "reconnecting-websocket";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { remote_chat_url_v1 } from "../../environment/environment";

export const Login = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (
    values: loginApiAttributes,
    { setSubmitting }: any
  ) => {
    setIsLoading(true); // Start loading
    const login_request: any = await loginApi(values);
    setIsLoading(false); // End loading

    if (login_request.status == 200) {
      toast.success("Login successfully");
      localStorage.setItem("utoken", login_request.data["access_token"]);

      localStorage.setItem("roles",login_request.data["user"]["roles"])


      localStorage.setItem("chat_id", login_request.data["user"]["chat_id"]);
      // establishWebSocketConnection(login_request.data["user"]["chat_id"]);
      localStorage.setItem("name", login_request.data["user"]["first_name"]);
      localStorage.setItem(
        "is_face_id_verified",
        login_request.data["user"]["is_face_id_verified"]
      );
      localStorage.setItem(
        "is_face_id_proceed",
        login_request.data["user"]["is_face_id_proceed"]
      );

            localStorage.setItem(
        "has_associated_organization_details",
        login_request.data["user"]["has_associated_organization_details"]
      );

      localStorage.setItem(
        "has_completed_basic_details",
        login_request.data["user"]["has_completed_basic_details"]
      );

      localStorage.setItem(
        "has_languages",
        login_request.data["user"]["has_languages"]
      );

      localStorage.setItem(
        "has_skills",
        login_request.data["user"]["has_skills"]
      );

      navigate("/");
    } else {
      ErrorNotification(login_request.message);
    }
  };

  // Function to establish WebSocket connection
  const establishWebSocketConnection = (token: string) => {
    const socketUrl = `${remote_chat_url_v1}ws/notifications/${token}/`;
    const socket = new ReconnectingWebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (message: any) => {
      console.log("WebSocket message received:", message);
      // setValue(message)
    };

    socket.onerror = (error: any) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };
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
              {t("loginPage.logInHeader")}
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

                  <div className="pb-3">
                    <PasswordInputField
                      label={""}
                      name="password"
                      LabelclassName="labels-style"
                      classname="login-input"
                    />
                  </div>
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
            <div className="d-flex justify-content-center">
              <div
                style={{ width: "320px" }}
                className="d-flex justify-content-between pb-3"
              >
                <hr
                  style={{
                    width: "32px",
                    color: "black",
                    border: "1px solid black",
                  }}
                />
                <div className="d-flex align-items-center signup-txt">
                  {t("loginPage.dontHaveAccount")}
                </div>
                <hr
                  style={{
                    width: "32px",
                    color: "black",
                    border: "1px solid black",
                  }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <Button
                className="signup"
                buttonText={t("loginPage.signUpButton")}
                onClickHandler={() => navigate("/register/type")}
              />
            </div>
            <div className="forgot-txt text-center pt-3" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
