import React, { ReactNode } from "react";
import Button from "../../core/Button/Button"; // Import the updated Button component
import "./SocialLoginButton.scss"; // Import any additional styles specific to social login buttons
// Import icons for social platforms
import GoogleIcon from "../../assets/google-ico.png";
import AppleIcon from "../../assets/apple-ico.png";
import microsoft from "../../assets/microsoft-ico.png";
import linkedin from "../../assets/linkedin-ico.png";
import BankIcon from "../../assets/bank-ico.png";
import { SocialLoginButtonProps } from "../../types/types";
import ImageComponent from "../../core/Image/Image";
import { useTranslation } from "react-i18next";

const SocialLoginButton = ({
  platform,
  onClick,
  isDisabled = false,
  isLoading = false,
  className,
}: SocialLoginButtonProps) => {
  const { t, i18n } = useTranslation();
  const socialPlatformConfig: any = {
    google: {
      buttonText: t("loginPage.googleLoginButton"),
      icon: <ImageComponent src={GoogleIcon} alt="Google" />,
      styleName: " row",
    },
    apple: {
      buttonText: t("loginPage.appleLoginButton"),
      icon: <img src={AppleIcon} alt="apple" />,
      styleName: "row",
    },
    microsoft: {
      buttonText: "Login with Microsoft",
      icon: <img src={microsoft} alt="apple" />,
      styleName: "row",
    },
    linkedin: {
      buttonText: "Login with Linkedin",
      icon: <img src={linkedin} alt="apple" />,
      styleName: "row",
    },
    bankid: {
      buttonText: t("loginPage.bankIdLoginButton"),
      icon: <img src={BankIcon} alt="Twitter" />,
      styleName: "row",
    },
  };

  const { buttonText, icon, styleName } = socialPlatformConfig[platform];

  const ChildElement = () => {
    return (
      <>
        <div className="col-3 h-100 d-flex align-items-center justify-content-end ">
          {" "}
          {icon}
        </div>
        <div className="col-9 h-100 d-flex align-items-center ps-0">
          {buttonText}
        </div>
      </>
    );
  };

  return (
    <Button
      buttonText={buttonText}
      onClickHandler={onClick}
      isDisabled={isDisabled}
      isLoading={isLoading}
      className={styleName + " " + className}
      children={<ChildElement />}
      type="button"
    />
  );
};

export default SocialLoginButton;
