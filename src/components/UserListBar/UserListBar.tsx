import React, { useEffect, useState } from "react";
import "./UserListBar.scss";
import {
  BsPeople,
  BsPersonBadge,
  BsPersonCheck,
  BsPersonFillGear,
  BsPersonLinesFill,
  BsPersonFill,
} from "react-icons/bs";
import Button from "../../core/Button/Button";

export const UserListBar = ({ employeeUserList, title = "", onClick }: any) => {
  return (
    <div className="col-lg-3 col-md-3 col-12">
      <div className="grey-container p-4">
        {/* connections user */}
        {employeeUserList?.all_connections ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPeople className="me-2" /> All coworkers
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.all_connections}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.all_workers ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPeople className="me-2" /> All workers
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.all_workers}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.active_workers ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPeople className="me-2" /> Active workers
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.active_workers}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.admin ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonBadge className="me-2" /> Admin
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.admin}
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* coworkers */}
        {employeeUserList?.consultant ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonCheck className="me-2" /> Consultant
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.consultant}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.employer ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonFillGear className="me-2" /> Employer
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.employer}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.job_seeker ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonLinesFill className="me-2" /> Job seeker
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.job_seeker}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* connections user */}
        {employeeUserList?.active_connections ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonFill className="me-2" /> Active account
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.active_connections}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* coworkers */}
        {employeeUserList?.inactive_workers ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonFill className="me-2" /> Deactivate account
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.inactive_workers}
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* connections user */}
        {employeeUserList?.pending_connections ? (
          <div className="d-flex justify-content-between align-items-center pb-3">
            <div className="d-flex align-items-center">
              <BsPersonFill className="me-2" /> Pending account
            </div>
            <div className="badge bg-light text-dark">
              {employeeUserList?.pending_connections}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="mt-5 blue-container p-4">
        <div className="invite-text-header">
          <p>{title}</p>
        </div>
        <div className="invite-text">
          <p>
            Invite your colleagues to collaborate with you on our platform. Just
            enter their email, and we’ll take care of the rest!
          </p>
        </div>
        <div>
          <Button
            buttonText="Send Invitation"
            className="me-2 invitaion-btn mt-3"
            onClickHandler={onClick}
          />
        </div>
      </div>
    </div>
  );
};
