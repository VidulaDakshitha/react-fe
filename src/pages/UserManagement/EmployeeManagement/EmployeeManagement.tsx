import { useEffect, useState } from "react";
import "./EmployeeManagement.scss";
import { getAllUserDetailsApi } from "../../../services/user.service";
import { BsPlus, BsPlusLg } from "react-icons/bs";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import CustomModal from "../../../components/Modal/Modal";
import { AddEmployee } from "./AddEmployee/AddEmployee";
export const EmployeeManagement = () => {
  const [employeeDetails, SetEmployeeDetails] = useState<any>([]);
  const [modalShow, setModalShow] = useState(false);
  const toggleModal = () => setModalShow(!modalShow);
  useEffect(() => {
   // getAllUserDetails();
  }, []);

  // const getAllUserDetails = async () => {
  //   try {
  //     const user_details: any = await getAllUserDetailsApi();
  //     if (user_details.status == 200) {
  //       console.log("hello", user_details.data);
  //       SetEmployeeDetails(user_details.data);
  //       // setDataCount(user_details.data.count);
  //     } else {
  //       ErrorNotification(user_details.message);
  //     }
      
  //   } catch (error) {
      
  //   }

  // };
  return (
    <div className="container pt-5">
      <div className="d-flex justify-content-end pb-5">
        <div className="d-flex task-btn" onClick={() => toggleModal()}>
          <div>
            <BsPlusLg className="me-1" />
          </div>
          Add Employee
        </div>
      </div>

      <div className="pb-5">
        <table className="table table-stripes">
          <thead>
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Country</th>
              <th scope="col">status</th>
              <th scope="col">Verified</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {employeeDetails &&
              employeeDetails.map((employee: any) => (
                <tr>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.country ? employee.country : "N/A"}</td>
                  <td>
                    {employee.is_active == 1 ? (
                      <div className="active-badge d-flex justify-content-around align-items-center">
                        <span className="active-dot"></span> <span>Active</span>
                      </div>
                    ) : (
                      <div className="inactive-badge d-flex justify-content-around align-items-center">
                        <span className="inactive-dot"></span>{" "}
                        <span>In-Active</span>
                      </div>
                    )}
                  </td>
                  <td>{employee.is_verified == 1 ? "Yes" : "No"}</td>
                  <td>
                    <div className="employee-btn">View Profile</div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <CustomModal
        show={modalShow}
        toggle={toggleModal}
        ModalHeader="Add Employee"
        size={"md"}
      >
        <p></p>
        {/* <AddEmployee closeModal={toggleModal} recallData={getAllUserDetails} /> */}
      </CustomModal>
    </div>
  );
};
