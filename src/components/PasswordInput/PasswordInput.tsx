import React, { useState } from "react";
import "./PasswordInput.scss";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import InputField from "../../core/InputField/InputField";
import { passwordProps } from "../../types/types";

export const PasswordInputField = ({
  label,
  name,
  LabelclassName,
  classname
}: passwordProps) => {
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  return (
    <div className="password-field">
     {label && <label className={LabelclassName}>{label}</label>}
      <div className="input-group" style={{flexDirection:'column'}}>
        <InputField
          name={name}
          placeholder={""}
          label={""}
          className={`${classname} password-input`}
          fieldType={isPasswordVisible ? "text" : "password"}
        />
        <button
          onClick={togglePasswordVisibility}
          className="toggle-password-visibility"
          type="button"
        >
          {isPasswordVisible ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
        </button>
      </div>
    </div>
  );
};
