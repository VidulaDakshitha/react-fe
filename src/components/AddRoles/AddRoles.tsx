import React, { useState } from "react";

import { FaTimesCircle } from "react-icons/fa";

import SearchManagersAutoSelect from "../SearchManagersAutoSelect/SearchUserAutoSelect";

const AddRoles = ({
  selectedSubContractor,
  setSelectedSubContractor,
  type
}: any) => {
  const removeSubContractor = (id: any) => {
    setSelectedSubContractor((prev: any[]) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="container mt-5 p-0">
      {/* <p className="advanced-option">Advanced Options</p> */}
      <div className="card">
        <div className="card-body">
          {/* <h5 className="card-title">Assign Consultant {type=="worker"?'Consultant':'Manager'}</h5> */}
          <SearchManagersAutoSelect
            selectedUser={selectedSubContractor}
            setSelectedUser={setSelectedSubContractor}
            clearOnSelect={true}
            connectionType={type}
          />

          {/* Display selected sub-contractors */}
          <div className="d-flex flex-wrap mt-3">
            {selectedSubContractor.map((sub: any) => (
              <div
                className="position-relative border rounded p-3  me-3 mb-3 selected-user-label"
                key={sub.id}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={sub.avatar || "https://via.placeholder.com/40"}
                    alt="profile"
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                  />
                  <div>
                    <strong>{sub.label}</strong>
                    <br />
                    <span>{sub.email}</span>
                  </div>
                </div>

                <FaTimesCircle
                  className="position-absolute text-secondary close-selected-user-icon"
                  onClick={() => removeSubContractor(sub.id)}
                />
              </div>
            ))}
          </div>

          {/* <div className="d-flex justify-content-end mt-1 pb-lg-0 pb-4">
            <Button className="task-btn" buttonText={"Invite"} type="submit" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AddRoles;
