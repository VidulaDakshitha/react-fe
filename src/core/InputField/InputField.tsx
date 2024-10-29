import React from "react";
import { useField } from "formik";
import { InputProps } from "../../types/core";
import './InputField.scss';

// InputField component
const InputField = ({
  id,
  label,
  fieldType,
  name,
  className,
  isDisabled,
  placeholder,
  LabelclassName,
  onChange // Add the onChange prop here
}: InputProps) => {
  const [field, meta, helpers] = useField(name); // Added helpers to handle field manually

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e); // Keep Formik's field value updating
    if (onChange) {
      onChange(e); // Trigger custom onChange if provided
    }
  };

  return (
    <>
      {label && <label className={LabelclassName} htmlFor={id || name}>{label}</label>}
      <input
        type={fieldType}
        disabled={isDisabled}
        {...field}
        placeholder={placeholder}
        name={name}
        className={`${className ? className : "input-field"}`}
        onChange={handleChange} // Use custom handleChange function
      />
      {meta.touched && meta.error ? (
        <div className="error mb-4">{meta.error}</div>
      ) : null}
    </>
  );
};

export default InputField;
