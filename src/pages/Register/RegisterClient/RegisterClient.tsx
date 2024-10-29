import { Formik, Form, Field, ErrorMessage } from "formik";
import "./RegisterClient.scss";
// import InputField from "../../core/InputField/InputField";
import ImageComponent from "../../../core/Image/Image";
import RegisterBG from "../../../assets/register_bg.png";

import SocialLoginButton from "../../../components/SocialLoginButton/SocialLoginButton";
import Button from "../../../core/Button/Button";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import Option3 from "../../../assets/client_option1.png";
import Option4 from "../../../assets/client_option2.png";
import OptionSelected from "../../../assets/option-selected.png";

export const ClientType = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const navigate = useNavigate();

  const [clickType, setClickType] = useState<string>();

  return (
    <div className="container-fluid">
      <div className="row login-container">
        <div className="col-0 col-md-5 col-lg-5  login-left ">
          <div>
            <div className="logo">Sparetan</div>
            <div className="register-main-heading">
              {t("registerPage.mainHeading")}
            </div>
            <div className="register-sub-heading d-flex me-2">
              <div></div>
              Individual: If you're seeking services or products for personal
              use
            </div>
            <div className="register-sub-heading d-flex me-2">
              <div></div>
              Organization: If you're representing a company or group.
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
        <div className="col-xl-7 col-lg-12 col-md-12 col-12 ps-5">
          {/* <div className="d-flex justify-content-end">
            <div className="logo">Sparetan</div>
          </div> */}

          <div className="join-as-client">Join as a Client</div>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-12 option-padding"
              onClick={() => setClickType("individual")}
            >
              <div
                className={`${
                  clickType == "individual"
                    ? "option-frame-clicked"
                    : "option-frame"
                } d-flex justify-content-center align-items-center`}
              >
                <div>
                  <div className="d-flex justify-content-center pb-4">
                    <ImageComponent
                      src={Option3}
                      alt={t("registerTypePage.altText")}
                      className=""
                    />
                  </div>
                  <div className="register-type-option ps-5 pe-5">
                    Join in as Individual
                  </div>

                  {clickType == "individual" && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionSelected}
                        alt={t("registerTypePage.altText")}
                        className=""
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className="col-lg-6 col-md-6 col-12 option-padding"
              onClick={() => setClickType("organization")}
            >
              <div
                className={`${
                  clickType == "organization"
                    ? "option-frame-clicked"
                    : "option-frame"
                } d-flex justify-content-center align-items-center`}
              >
                <div>
                  <div className="d-flex justify-content-center pb-4">
                    <ImageComponent
                      src={Option4}
                      alt={t("registerTypePage.altText")}
                      className=""
                    />
                  </div>
                  <div className="register-type-option ps-5 pe-5">
                    Join in As Organization
                  </div>

                  {clickType == "organization" && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionSelected}
                        alt={t("registerTypePage.altText")}
                        className=""
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-5">
              <Button
                className="register-type-btn"
                buttonText={
                  clickType == "individual"
                    ? "Join as Individual"
                    : "Join as Organization"
                }
                type="submit"
                isDisabled={clickType == ""}
                onClickHandler={() => navigate("/register/" + clickType)}
              />
            </div>
            <div
              className="pt-4 pb-5 d-flex justify-content-center"
              onClick={() => navigate("/login")}
            >
              {t("registerTypePage.loginPrompt")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
