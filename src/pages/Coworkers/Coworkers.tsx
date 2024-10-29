import {useEffect, useState} from "react";
import {SearchBarClear} from "../../components/SearchBarWithClear/SearchBarClear";
import "./Coworkers.scss";
import Button from "../../core/Button/Button";
import {Form, Formik} from "formik";
import SelectField from "../../core/SelectField/SelectField";
import CustomModal from "../../components/Modal/Modal";
import {BsPlusLg} from "react-icons/bs";
import {FaSearch} from "react-icons/fa";
import {
    getAllUserDetailsApi,
    UserSummeryApi,
} from "../../services/user.service";
import {ErrorNotification} from "../../components/ErrorNotification/ErrorNotification";
import {UserListBar} from "../../components/UserListBar/UserListBar";
import {AddCoworker} from "./AddCoworker/AddCoworker";
import {useNavigate} from "react-router-dom";
import {Spinner} from "../../components/Spinner/Spinner";
import {NoData} from "../../components/NoData/NoData";

const data: any = [];

export const Coworkers = () => {
    const navigate = useNavigate();
    const [employeeDetails, setEmployeeDetails] = useState<any>(data);
    const [viewCoworkerShow, setViewCoworkerModalShow] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [manager, setManager] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [userSummeryList, setUserSummeryList] = useState<any>([]);

    useEffect(() => {
        getUSerSummeryDetails();
    }, []);

    const getUSerSummeryDetails = async () => {
        try {
            const user_details: any = await UserSummeryApi("1", "", "");

            if (user_details.status === 200) {
                setUserSummeryList(user_details.data);
            } else {
                ErrorNotification(user_details.message);
            }
        } catch (error) {
            ErrorNotification("Error fetching user details");
        }
    };

    const toggleViewCoworkerModal = () =>
        setViewCoworkerModalShow(!viewCoworkerShow);

    const initialValues = {
        filter_name: "",
        filter_email: "",
        filter_role: "",
        filter_manager: "",
        filter_status: "",
    };

    const getAllUserDetails = async () => {
        setIsLoading(true);
        try {
            const user_details: any = await getAllUserDetailsApi(
                role,
                manager,
                status,
                name,
                email
            );

            if (user_details.status === 200) {
                const modifiedData = user_details.data.map((employee: any) => ({
                    ...employee,
                    type: employee.is_external === 0 ? "Internal" : "External"
                }));
                setEmployeeDetails(modifiedData);
            } else {
                ErrorNotification(user_details.message);
            }
        } catch (error) {
            ErrorNotification("Error fetching user details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllUserDetails();
    }, [name, email, manager, status, role]);

    return (
        <div className="p-lg-5 p-md-5 p-3">
            <div className="row">
                <div className="col-lg-9 col-md-9 col-12">
                    <Formik initialValues={initialValues} onSubmit={console.log}>
                        {({handleChange, handleSubmit, values}) => (
                            <Form>
                                <div className="row space-between align-items-end">
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <SearchBarClear
                                            widthClass={"search-size3 search-bar-radious"}
                                            onChange={setName}
                                            placeholder="Name"
                                            label="Name"
                                            name="name"
                                            clearFunction={() => setName("")}
                                        />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <SearchBarClear
                                            widthClass={"search-size3 search-bar-radious"}
                                            onChange={setEmail}
                                            placeholder="Email"
                                            label="Email"
                                            name="email"
                                            clearFunction={() => setEmail("")}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label>Role</label>
                                        <select
                                            className="coworker-filter"
                                            name="filter_role"
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="">Select Role</option>
                                            <option value="admin">Admin</option>
                                            <option value="consultant_manager">
                                                Consultant Manager
                                            </option>
                                            <option value="consultant">Consultant</option>
                                            <option value="billing">Billing</option>
                                            <option value="sales">Sales</option>
                                        </select>
                                    </div>

                                    {/*<div className="col-4">*/}
                                    {/*    <SelectField*/}
                                    {/*        options={[*/}
                                    {/*            {value: "admin", label: "Admin"},*/}
                                    {/*            {value: "consultant", label: "Consultant"},*/}
                                    {/*            {value: "job_seeker", label: "Job Seeker"},*/}
                                    {/*            {value: "employer", label: "Employer"},*/}
                                    {/*        ]}*/}
                                    {/*        label={"Manager"}*/}
                                    {/*        className="coworker-filter"*/}
                                    {/*        name="filter_manager"*/}
                                    {/*        onChange2={setManager}*/}
                                    {/*    />*/}
                                    {/*</div>*/}

                                    <div className="col-lg-6 col-md-6 col-12">
                                        <label>Status</label>
                                        <select
                                            className="coworker-filter"
                                            name="filter_status"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>

                    <div className="d-flex justify-content-end">
                        <Button
                            className="intro-button mt-5"
                            buttonText="Add Coworker"
                            icon={<BsPlusLg/>}
                            onClickHandler={toggleViewCoworkerModal}
                        />
                    </div>

                    <div className="pb-5 pt-5">
                        {isLoading ? (
                            <Spinner size="large"/>
                        ) : employeeDetails && employeeDetails.length > 0 ? (
                            <table className="table table-stripes">
                                <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">E-mail</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Manager</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Status</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {employeeDetails.map((employee: any) => (
                                    <tr key={employee.id}>
                                        <td>
                                            {employee.first_name} {employee.last_name}
                                        </td>
                                        <td>{employee.email}</td>
                                        <td>
                                            {employee.roles.map((role: string, index: number) => {
                                                let displayRole = role;
                                                if (role === 'gig_worker' || role === 'over_employee') {
                                                    displayRole = 'Consultant';
                                                } else if (role === 'customer') {
                                                    return null; // Don't display 'customer' role
                                                }
                                                return (
                                                    <span key={index} className="role-badge">
        {displayRole
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')}
                                                        {index < employee.roles.length - 1 ? ', ' : ''}
      </span>
                                                );
                                            }).filter(Boolean)} {/* Filter out null values */}
                                        </td>
                                        <td>{employee.manager_name || "N/A"}</td>
                                        <td>{employee.type}</td>
                                        <td>
                                            {employee.is_active === 1 ? (
                                                <div
                                                    className="active-badge d-flex justify-content-around align-items-center">
                                                    <span className="active-dot"></span>
                                                    <span>Active</span>
                                                </div>
                                            ) : (
                                                <div
                                                    className="inactive-badge d-flex justify-content-around align-items-center">
                                                    <span className="inactive-dot"></span>
                                                    <span>In-Active</span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="d-flex">
                                            <div
                                                className="employee-btn"
                                                onClick={() =>
                                                    navigate("/view-profile/" + employee.id)
                                                }
                                            >
                                                View Profile
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            <NoData
                                noData="Searched Co-worker not found!"
                                noDataDesc="Try adjusting your search criteria or add a new coworker."
                            />
                        )}
                    </div>
                </div>

                <UserListBar
                    employeeUserList={userSummeryList}
                    title="Don't see your coworker?"
                    onClick={toggleViewCoworkerModal}
                />
            </div>

            <CustomModal
                show={viewCoworkerShow}
                toggle={toggleViewCoworkerModal}
                ModalHeader="Add Coworker"
                size={"lg"}
            >
                <AddCoworker
                    closeModal={toggleViewCoworkerModal}
                    recallData={() => getAllUserDetails()}
                />
            </CustomModal>
        </div>
    );
};
