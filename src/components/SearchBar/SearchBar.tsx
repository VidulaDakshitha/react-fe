import React, { useState } from "react";
import "./SearchBar.scss";

export const SearchBar = ({
  widthClass,
  onChange,
  placeholder = "search",
  name
}: any) => {
  const handleInputChange = (e: any) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div>
      <div className="col-auto">
        <div className="input-group mb-2 d-flex">
          <div className="input-group-prepend">
            <div className="input-group-text">
              <i className="bi bi-search"></i>
            </div>
          </div>
          <input
            type="text"
            className={`search-input-box ${widthClass}`}
            id="inlineFormInputGroup"
            placeholder={placeholder}
            onChange={handleInputChange}
            name={name}
          />
        </div>
      </div>
    </div>
  );
};
