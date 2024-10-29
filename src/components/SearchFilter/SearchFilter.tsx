import React, { useState } from "react";
import "./SearchFilter.scss";
import InputField from "../../core/InputField/InputField";

export const SearchFilter = ({ name, onChange }: any) => {
  const handleInputChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <div className="filter-icon">
        <i className="bi bi-sliders"></i>
      </div>
    </div>
  );
};
