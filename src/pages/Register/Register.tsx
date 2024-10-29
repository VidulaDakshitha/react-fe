import { Formik, Form, Field, ErrorMessage } from "formik";
import "./Register.scss";
import InputField from "../../core/InputField/InputField";
import ImageComponent from "../../core/Image/Image";
import RegisterBG from "../../assets/register_bg.png";
import { PasswordInputField } from "../../components/PasswordInput/PasswordInput";
import SelectField from "../../core/SelectField/SelectField";
import SocialLoginButton from "../../components/SocialLoginButton/SocialLoginButton";
import Button from "../../core/Button/Button";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ApiAttributes } from "../../types/types";
import { registerApi } from "../../services/user.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { toast } from "react-toastify";
import { useState } from "react";

export const Register = () => {
  const { t } = useTranslation();
  const { type } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    organization_name: "",
    // is_client: ((type == "individual") || (type == "organization")) ? 1 : 0,
    // is_freelancer: ((type == "w-individual") || (type == "w-organization") || (type == "employee")) ? 1 : 0,
    // is_company: ((type == "organization") || (type == "w-organization")) ? 1 : 0,
    // is_over_employee: type == "employee"?1:0,
    user_type:
      type == "individual"
        ? "U"
        : type == "organization" || type == "w-organization"
        ? "OR"
        : type == "w-individual"
        ? "GW"
        : type == "employee"
        ? "OE"
        : "N/A",
    // job_seeker_type:type == "w-individual"?"IN":type == "w-organization"?"OR":type == "employee"?"OE":"",
    // employer_type:type == "individual"?"IN":type == "organization"?"OR":"",
  };

  // Validation schema using Yup
  const validationSchema = {};
  // Handle form submission
  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);
    if(!((type == "organization")|| (type == "w-organization"))){
        delete values.organization_name
    }
    console.log(values)
    const register_request: any = await registerApi(values);
    setIsLoading(false);
    if (register_request.status == 201) {
      toast.success(
        "Account created check your email for account verification"
      );
      navigate("/login");
    } else {
      ErrorNotification(register_request.data.message);
    }
  };
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
            <div className="d-flex justify-content-center signup-header mb-4 pt-lg-0 pt-5">
              Join as{" "}
              {type == "individual"
                ? "a Client"
                : type == "employee"
                ? "an Over Employee"
                : type == "organization" || type == "w-organization"
                ? "an Organization"
                : type == "w-individual"
                ? "a Freelancer"
                : ""}
            </div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {(formik) => (
                <Form className="ps-lg-5 pe-lg-5 ps-1 pe-1">
                  {(type == "organization" || type == "w-organization") && (
                    <InputField
                      name="organization_name"
                      placeholder=""
                      label={"Organization Name"}
                      className="register-input mb-3"
                      fieldType="text"
                      LabelclassName="register-lbl"
                    />
                  )}

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12">
                      <InputField
                        name="first_name"
                        placeholder=""
                        label={t("registerPage.firstNameLabel")}
                        className="register-input mb-4"
                        fieldType="text"
                        LabelclassName="register-lbl"
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <InputField
                        name="last_name"
                        placeholder=""
                        label={t("registerPage.lastNameLabel")}
                        className="register-input mb-4"
                        fieldType="text"
                        LabelclassName="register-lbl"
                      />
                    </div>
                  </div>
                  <InputField
                    name="email"
                    placeholder=""
                    label={t("registerPage.workEmailLabel")}
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
                        label: t("registerPage.countries.sweden"),
                      },
                    ]}
                    label={t("registerPage.countryLabel")}
                    className="register-input mb-3"
                    LabelclassName="register-lbl"
                  />
                  <div className="mb-3">
                    <InputField
                      fieldType="checkbox"
                      name="agree"
                      placeholder={""}
                      className="me-2"
                    />
                    <span className="terms">
                      {t("registerPage.termsAgreementText")}
                    </span>
                  </div>
                  {/* <div className="d-flex justify-content-center pb-3">
                                        {t("registerPage.orText")}
                                    </div> */}
                  {/* <div className="row pb-3 ps-5 pe-5">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <SocialLoginButton
                                                platform="google"
                                                onClick={console.log}
                                                isDisabled={false}
                                                isLoading={false}
                                                className="google-login"
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 pt-lg-0 pt-md-0 pt-3">
                                            <SocialLoginButton
                                                platform="microsoft"
                                                onClick={console.log}
                                                isDisabled={false}
                                                isLoading={false}
                                                className="google-login"
                                            />
                                        </div>
                                    </div>

                                    <div className="row pb-3 ps-5 pe-5">
                                        <div className="col-lg-6 col-md-6 col-12">
                                            <SocialLoginButton
                                                platform="linkedin"
                                                onClick={console.log}
                                                isDisabled={false}
                                                isLoading={false}
                                                className="google-login"
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-12 pt-lg-0 pt-md-0 pt-3">
                                            <SocialLoginButton
                                                platform="apple"
                                                onClick={console.log}
                                                isDisabled={false}
                                                isLoading={false}
                                                className="google-login"
                                            />
                                        </div>
                                    </div> */}

                  <div className="d-flex justify-content-center mt-5 pb-lg-0 pb-4">
                    <Button
                      className="register-btn"
                      buttonText={t("registerPage.createAccountButton")}
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
