import React, { useState } from "react";
import "./SearchBarClear.scss";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import SelectField from "../../core/SelectField/SelectField";

export const SearchBarClear = ({
  widthClass,
  onChange,
  placeholder = "search",
  label,
  clearFunction,
  isSelect = false,
  name
}: any) => {
  return (
    <div className="search-with-clear">
      <div className="d-flex justify-content-between mb-2">
        <span>{label}</span>
        <button className="btn  p-0" onClick={()=>clearFunction()}>
          Clear
        </button>
      </div>
      {isSelect ? (
        <div className=" mb-2 d-flex justify-content-end align-items-end">
          <SelectField
            options={[
              {
                value: "done",
                label: "Done",
              },
              {
                value: "consultant",
                label: "Consultant",
              },
            ]}
            label={""}
            className="coworker-select"
            name="filter_role"
          />
        </div>
      ) : (
        <SearchBar
          widthClass={"search-size3 search-bar-radious"}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
        />
      )}
    </div>
  );
};
