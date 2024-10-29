import React from "react";
import { useField } from "formik";
import { InputProps, SelectProps } from "../../types/core";

// SelectField component
const SelectField = ({
  id,
  label,
  name,
  className,
  isDisabled,
  options,
  LabelclassName,
  onChange2
}: SelectProps) => {
  const [field, meta] = useField(name);
  return (
    <>
      {label && <label className={LabelclassName} htmlFor={name}>{label}</label>}
      <select {...field} className={className} disabled={isDisabled} >
        <option value={""}>Select {label}</option>
        {options &&
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default SelectField;
