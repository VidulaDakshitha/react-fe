import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageComponent from "../../../core/Image/Image";
import Button from "../../../core/Button/Button";
import "./RegisterType.scss";
import RegisterTypeBG from "../../../assets/register_type_bg.png";
import Option1 from "../../../assets/register_type_opt1.png";
import Option2 from "../../../assets/register_type_opt2.png";
import OptionSelected from "../../../assets/option-selected.png";
import OptionnotSelected from "../../../assets/option-not-selected.png";

import { useNavigate } from "react-router-dom";

export const RegisterType = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [clickType, setClickType] = useState<string>("");

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <div className="row">
        <div className="col-lg-5 col-md-5 col-0 ps-0 pb-0 login-left">
          <div className="d-flex align-items-center">
            <ImageComponent
              src={RegisterTypeBG}
              alt={t("registerTypePage.altText")}
              className="img-fluid1"
            />
          </div>
        </div>

        <div className="col-xl-7 col-lg-12 col-md-12 col-12 ps-lg-5 ps-md-5 ps-2">
          <div className="d-flex justify-content-end">
            <div className="logo">Sparetan</div>
          </div>

          <div className="register-type-heading">
            {t("registerTypePage.heading1")}
          </div>
          <div className="register-type-heading">
            {t("registerTypePage.heading2")}
          </div>

          <p className="register-type-description pt-4 pb-4">
            {t("registerTypePage.description")}
          </p>

          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-12 option-padding"
              onClick={() => setClickType("client")}
            >
              <div
                className={`${
                  clickType == "client"
                    ? "option-frame-clicked"
                    : "option-frame"
                } d-flex justify-content-center align-items-center`}
              >
                <div>
                  <div className="d-flex justify-content-center pb-4">
                    <ImageComponent
                      src={Option1}
                      alt={t("registerTypePage.altText")}
                      className=""
                    />
                  </div>
                  <div className="register-type-option ps-5 pe-5">
                    {t("registerTypePage.optionClient")}
                  </div>

                  {clickType == "client" && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionSelected}
                        alt={t("registerTypePage.altText")}
                        className=""
                      />
                    </div>
                  )}

                  {(clickType == "" || clickType == "freelance") && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionnotSelected}
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
              onClick={() => setClickType("freelance")}
            >
              <div
                className={`${
                  clickType == "freelance"
                    ? "option-frame-clicked"
                    : "option-frame"
                } d-flex justify-content-center align-items-center`}
              >
                <div>
                  <div className="d-flex justify-content-center pb-4">
                    <ImageComponent
                      src={Option2}
                      alt={t("registerTypePage.altText")}
                      className=""
                    />
                  </div>
                  <div className="register-type-option ps-5 pe-5" style={{ whiteSpace: 'pre-line' }}>
                    {t("registerTypePage.optionFreelancer")}
                  </div>

                  {clickType == "freelance" && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionSelected}
                        alt={t("registerTypePage.altText")}
                        className=""
                      />
                    </div>
                  )}

                  {(clickType == "" || clickType == "client") && (
                    <div className="d-flex justify-content-center pt-4">
                      <ImageComponent
                        src={OptionnotSelected}
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
                  clickType == "client"
                    ? t("registerTypePage.joinAsClientButton")
                    : t("registerTypePage.joinAsFreelanceButton")
                }
                type="submit"
                isDisabled={clickType == ""}
                onClickHandler={() =>
                  navigate(
                    clickType == "client"
                      ? "/client/" + clickType
                      : "/worker/" + clickType
                  )
                }
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
