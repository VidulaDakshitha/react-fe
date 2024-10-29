import React, { useState } from "react";
import "./AutoSelectSearch.scss";
import AsyncSelect from "react-select/async";
import { FaSearch } from "react-icons/fa";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    paddingLeft: "35px",
    borderRadius: "5px",
    boxShadow: "none",
    ":hover": {
      borderColor: "#666",
    },
    height: 50,
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    // maxHeight: 200,
    // overflowY: "scroll",
    borderRadius: "8px",
    padding: 5,
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  }),
};

export const AutoSelectSearch = ({
  fetchOptions,
  handleChange,
  selectedOption,
  placeholder = "Search ...",
  clearOnSelect = false,
}: any) => {
  const [inputValue, setInputValue] = useState("");

  const handleChangeOption = (option: any) => {
    handleChange(option);
    if (clearOnSelect) {
      setInputValue(""); // Reset the input field
    }
  };
  const loadOptions = (inputValue: any, callback: any) => {
    console.log("fuck")
    if (inputValue) {
      fetchOptions(inputValue).then((options: any) => callback(options));
    } else {
      callback([]);
    }
  };

  const CustomOption = (props: any) => {
    const { data, innerRef, innerProps, isFocused, isSelected } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`d-flex align-items-center mb-3 auto-select-search ${
          isSelected ? "bg-selected" : isFocused ? "bg-focused" : "bg-white"
        } `}
      >
        <img
          src={data.avatar}
          alt="avatar"
          className="rounded-circle me-3 option-img-style"
        />
        <div>
          <h6 className="mb-0">{data.label}</h6>
          <small className="text-muted">{data.email}</small>
        </div>
      </div>
    );
  };

  const handleInputChange = (value: string) => {
    setInputValue(value); // Track the user's input
  };

  return (
    <div className="search-bar-wrapper">
      <div className="search-container">
        <FaSearch className="search-icon" />
        <AsyncSelect
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions={false}
          onChange={handleChangeOption}
          value={selectedOption}
          placeholder={placeholder}
          isClearable
          components={{ Option: CustomOption }}
          closeMenuOnSelect={true}
          styles={customStyles}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          menuIsOpen={inputValue.length > 0}
        />
      </div>
    </div>
  );
};
