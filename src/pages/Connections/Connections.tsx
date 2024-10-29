import { useEffect, useState } from "react";
import { SearchBarClear } from "../../components/SearchBarWithClear/SearchBarClear";
import "./Connections.scss";
import Button from "../../core/Button/Button";
import { Form, Formik } from "formik";
import CustomModal from "../../components/Modal/Modal";
import { BsPlusLg, BsPencil } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { AddConnection } from "./AddConnection/AddConnection";
import { UserListBar } from "../../components/UserListBar/UserListBar";
import { getAllConnectionDetailsApi } from "../../services/user.service";
import { ErrorNotification } from "../../components/ErrorNotification/ErrorNotification";
import { ConnectionSummeryApi } from "../../services/user.service";

export const Connections = () => {
  const [connectionEmployeeDetails, SetConnectionEmployeeDetails] =
    useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [viewConnectionshow, setViewConnectionModalShow] = useState(false);
  const [editConnectionDetails, setEditConnectionDetails] = useState({});
  const [employeeUserList, setEmployeeUserList] = useState<any>([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    getAllUserDetails();
  }, []);

  const getAllUserDetails = async () => {
    try {
      const user_details: any = await ConnectionSummeryApi("1", "", "");

      if (user_details.status === 200) {
        setEmployeeUserList(user_details.data);
      } else {
        ErrorNotification(user_details.message);
      }
    } catch (error) {
      ErrorNotification("Error fetching user details");
    }
  };

  const toggleViewConnectionModal = () =>
    setViewConnectionModalShow(!viewConnectionshow);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const initialValues = {
    filter_name: "",
    filter_email: "",
    filter_role: "",
    filter_manager: "",
    filter_status: "",
  };

  const getAllConnectedUserDetails = async () => {
    setIsloading(true);
    try {
      const user_details: any = await getAllConnectionDetailsApi(
        status,
        name ? name : email
      );

      if (user_details.status === 200) {
        setIsloading(false);
        SetConnectionEmployeeDetails(user_details.data);
      } else {
        setIsloading(false);
        ErrorNotification(user_details.message);
      }
    } catch (error) {
      setIsloading(false);
      ErrorNotification("Error fetching user details");
    }
  };

  useEffect(() => {
    getAllConnectedUserDetails();
  }, [name, email, status]); // Initial load

  const onSubmitFilter = async (values: any, { setSubmitting }: any) => {};

  const handleSearchChange = (value: any) => {
    setSearchValue(value);
  };

  return (
    <div className="p-lg-5 p-md-5 p-3">
      {employeeUserList?.all_connections > 0 ? (
        <div className="row">
          <div className="col-lg-9 col-md-9 col-12">
            <Formik initialValues={initialValues} onSubmit={onSubmitFilter}>
              {({ handleChange, handleSubmit, values }) => (
                <Form>
                  <div className="row space-between  align-items-end">
                    <div className="col-lg-4 col-md-5 col-12">
                      <SearchBarClear
                        widthClass={"search-size3 search-bar-radious"}
                        onChange={setName}
                        placeholder="Name"
                        label="Name"
                        clearFunction={() => console.log("working")}
                      />
                    </div>
                    <div className="col-lg-4 col-md-5 col-12">
                      <SearchBarClear
                        widthClass={"search-size3 search-bar-radious"}
                        onChange={setEmail}
                        placeholder="Email"
                        label="Email"
                        clearFunction={() => console.log("working")}
                      />
                    </div>
                    <div className="col-lg-4 col-md-5 col-12">
                      <label className="mb-2">Role</label>
                      <select
                        className="search-size3 search-bar-radious mb-2"
                        name="status"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="">Select status</option>
                        <option value="1">Is Connected</option>
                        <option value="0">Not Connected</option>
                      </select>
                      {/* <SearchBarClear
                        widthClass={"search-size3 search-bar-radious"}
                        onChange={handleSearchChange}
                        placeholder="Status"
                        label="Status"
                        clearFunction={() => console.log("working")}
                        isSelect={true}
                      /> */}
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="d-flex justify-content-end">
              <Button
                className="intro-button mt-5"
                buttonText="Add Connections"
                icon={<BsPlusLg />}
                onClickHandler={toggleViewConnectionModal}
              />
            </div>

            {connectionEmployeeDetails &&
            connectionEmployeeDetails.length > 0 ? (
              <div className="pb-5 pt-5">
                <table className="table table-stripes">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">E-mail</th>
                      <th scope="col">Role</th>
                      <th scope="col">Manager</th>
                      <th scope="col">Status</th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectionEmployeeDetails &&
                      connectionEmployeeDetails.map((employee: any) => (
                        <tr>
                          <td>{employee.connection_name}</td>
                          <td>{employee.connection_email}</td>
                          <td>{employee.connection_email}</td>
                          <td>
                            {employee.manager_name
                              ? employee.manager_name
                              : "N/A"}
                          </td>
                          <td>
                            {employee.is_active == 1 ? (
                              <div className="active-badge d-flex justify-content-around align-items-center">
                                <span className="active-dot"></span>{" "}
                                <span>Active</span>
                              </div>
                            ) : (
                              <div className="inactive-badge d-flex justify-content-around align-items-center">
                                <span className="inactive-dot"></span>{" "}
                                <span>In-Active</span>
                              </div>
                            )}
                          </td>
                          <td className="d-flex">
                            <div className="employee-btn">View Profile</div>
                          </td>
                          {/* <td>
                          <BsPencil
                            size={20}
                            className="text-secondary edit-cursor"
                            onClick={() => {
                              setEditConnectionDetails(employee);
                              toggleViewConnectionModal();
                            }}
                          />
                        </td> */}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-lg-5 p-md-5 p-3">
                <div className="container text-center mt-5">
                  <div className="row">
                    <div className="col">
                      <div className="p-5 bg-light border rounded">
                        <h5 className="mb-4">
                          Searched Connection not found !
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <UserListBar
            employeeUserList={employeeUserList}
            title="Don’t see your connections?"
            onClick={toggleViewConnectionModal}
          />
        </div>
      ) : (
        <div className="p-lg-5 p-md-5 p-3">
          <div className="container text-center mt-5">
            <div className="row">
              <div className="col">
                <div className="p-5 bg-light border rounded">
                  <h5 className="mb-4">
                    You haven’t connected with any connectors or consultants
                    yet. You might find your next star right here. Expand your
                    network by connecting with coworkers who are already using
                    the platform or invite new colleagues to join you.
                    Collaborate, share tasks, and build stronger connections
                    within your professional community.
                  </h5>
                  <div className="text-center mt-5">
                    <Button
                      className="co-work-search me-2 search-btn p-10"
                      buttonText="Search connections"
                      icon={<FaSearch />}
                    />
                    <Button
                      className="co-work-add me-2 search-btn p-10"
                      buttonText="Send Invitaion"
                      onClickHandler={toggleViewConnectionModal}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        show={viewConnectionshow}
        toggle={toggleViewConnectionModal}
        ModalHeader={
          Object.keys(editConnectionDetails).length === 0
            ? "Update Connection"
            : "Add Connection"
        }
        size={"lg"}
      >
        <AddConnection
          closeModal={toggleViewConnectionModal}
          recallData={() => {
            getAllUserDetails();
            getAllConnectedUserDetails();
          }}
          editConnectionDetails={editConnectionDetails}
        />
      </CustomModal>
    </div>
  );
};
