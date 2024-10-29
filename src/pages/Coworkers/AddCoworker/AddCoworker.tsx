import "./AddCoworker.scss";
import { Form, Formik, Field } from "formik";
import Button from "./../../../core/Button/Button";
import SelectField from "../../../core/SelectField/SelectField";
import { useState } from "react";
import { FaUserCog, FaUserTie, FaUserTag, FaUserCheck, FaUserGraduate, FaUserSlash, FaUserEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import InputField from "../../../core/InputField/InputField";
import { createTaskProps } from "../../../types/types";
import { EmployeeEmailApi, EmployeeRegisterApi, InviteConnectionApi } from "../../../services/user.service";
import { AddConnectionApi } from "../../../services/connections.service";
import SearchUserAutoSelect from "../../../components/SearchUserAutoSelect/SearchUserAutoSelect";

export const AddCoworker = ({ closeModal, recallData }: createTaskProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleID, setSelectedRoleID] = useState(1);
    const [selectedRoles, setSelectedRoles] = useState<any>([]);
    const [userStatus, setUserStatus] = useState<any>();

    const [selectedUser, setSelectedUser] = useState<any>([]);

    const [isConnection, setIsConnection] = useState<any>();
    const [enteredMail, setEnteredMail] = useState<any>();
    const [connectionId, setConnectionId] = useState<any>();

    const initialValues2 = {
      invitationLanguage: "",
    };

    
    let roles:any=[]
  const systemRole = [
    {
      id: 1,
      label: "Admin",
      value: "admin",
      icon: <FaUserCog size={40} className="mb-2" color="#164863"/>,
    },
    {
      id: 2,
      label: "Consultant",
      value: "consultant",
      icon: <FaUserGraduate size={40} className="mb-2" color="#164863"/>,
    },

    {
      id: 3,
      label: "Billing",
      value: "billing",
      icon: <FaUserTag size={40} className="mb-2" color="#164863"/>,
    },
    {
      id: 4,
      label: "Sales",
      value: "sales",
      icon: <FaUserCheck size={40} className="mb-2" color="#164863"/>,
    },
    {
      id: 5,
      label: "Consultant Manager",
      value: "consultant_manager",
      icon: <FaUserTie size={40} className="mb-2" color="#164863"/>,
    },
    {
      id: 6,
      label: "Task Approval Manager",
      value: "task_manager",
      icon: <FaUserEdit size={40} className="mb-2" color="#164863"/>,
    },
  ];
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    invitationLanguage: "",
    roles: {
      admin: false,
      consultant: false,
      vendor: false,
      buyer: false,
    },
    manager: "",
  };

  const addroles=()=>{
    let roles=[]
    if(selectedRoles.includes(1)){
      roles.push('admin')
    }
    if(selectedRoles.includes(2)){
      roles.push('consultant')
    }

    if(selectedRoles.includes(3)){
      roles.push('billing')
    }
    
    if(selectedRoles.includes(4)){
      roles.push('sales')
    }
    
    if(selectedRoles.includes(5)){
      roles.push('consultant_manager')
    }


    if(selectedRoles.includes(6)){
      roles.push('task_manager')
    }

    return roles;
  }
  // Handle form submission
  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);

    if(isConnection){


      let data={
        consultant_id:connectionId,
        language:values.invitationLanguage,
      }
  
      console.log(data)
      const register_request: any = await InviteConnectionApi(data);
      setIsLoading(false);
      if (register_request.status == 201) {
        toast.success("User invited. Invitation email sent to user");
        closeModal();
        recallData();
      } else {
        ErrorNotification(register_request.data.message);
      }


    }else{
      let data={
        email:values.email,
        language:values.invitationLanguage,
        first_name:values.first_name,
        last_name:values.last_name,
        roles:addroles(),
      }
  
      console.log(data)
      const register_request: any = await EmployeeRegisterApi(data);
      setIsLoading(false);
      if (register_request.status == 201) {
        toast.success("Account created. proceed with email verification process");
        closeModal();
        recallData();
      } else {
        ErrorNotification(register_request.data.message);
      }
    }

  };




  const onSubmit2 = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);
    if (selectedUser) {
      let data = {
        connection_id: selectedUser[0].id,
        language: values.invitationLanguage,
      };
      let connection_request: any = {};
      connection_request = await AddConnectionApi(data);

      setIsLoading(false);
      if (connection_request.status == 201) {
  
        closeModal();
        recallData();
      } else {
        ErrorNotification(connection_request.data.message);
      }
    } else {
      ErrorNotification("User not selected");
      setIsLoading(false);
    }
  };


  const checkEmail = async(email:any, setFieldError: any) =>{


    setEnteredMail(email)
    const register_request: any = await EmployeeEmailApi(encodeURIComponent(email))

    if(register_request.status==200){

      if(register_request.data.user_status=="internal"){
        setFieldError("email", "Email is already taken");
        setIsConnection(false)
      }else if(register_request.data.user_status=="external"){
        setConnectionId(register_request.data.user_id)
      }
      setUserStatus(register_request.data.user_status)
    }
  }

  return (
    <div>
<Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => (
          <Form className="ps-lg-5 pe-lg-5 ps-1 pe-1">
                     <InputField
              name="email"
              placeholder=""
              label={"Email"}
              className="register-input mb-3"
              fieldType="email"
              LabelclassName="register-lbl"
              onChange={(e: any) => {
                const email = e.target.value;
                formik.setFieldValue("email", email); // Update Formik's value
                checkEmail(email, formik.setFieldError); // // Call the checkEmail function
              }}
            />
           {userStatus=="external" && !isConnection && <p className="label pb-5">This user exists outside the organization. Click <span className="here" onClick={()=>setIsConnection(true)}> here </span> to invite this user</p>}
          {!isConnection &&  <div className="row">
              <div className="col-lg-12 col-md-12 col-12">
                <InputField
                  name="first_name"
                  placeholder=""
                  label={"First Name"}
                  className="register-input mb-4"
                  fieldType="text"
                  LabelclassName="register-lbl"
                />
              </div>
              <div className="col-lg-12 col-md-12 col-12">
                <InputField
                  name="last_name"
                  placeholder=""
                  label={"Last Name"}
                  className="register-input mb-4"
                  fieldType="text"
                  LabelclassName="register-lbl"
                />
              </div>
            </div>}
   
            <SelectField
              name="invitationLanguage"
              options={[
                {
                  value: "en",
                  label: "English",
                },
                {
                  value: "se",
                  label: "Sweden",
                },
              ]}
              label={" Invitation Language"}
              className="register-input mb-3"
              LabelclassName="register-lbl"
            />

{!isConnection && <div className="mb-3">
  <label>Choose system roles for the coworker</label>
  <div className="container mt-4">
    <div className="row justify-content-start">
      {systemRole.map((role) => (
        <div className="col-3 pt-2" key={role.id}>
          <div
            className={`role-item position-relative p-3 border border-primary rounded bg-light p-3 ${
              selectedRoles.includes(role.id) ? "active-item" : ""
            }`}
            onClick={() => {
              if (selectedRoles.includes(role.id)) {
                // If the role is already selected, remove it
                setSelectedRoles(selectedRoles.filter((r:any) => r !== role.id));
              } else {
                // Otherwise, add it
                setSelectedRoles([...selectedRoles, role.id]);
              }
            }}
          >
            <input
              type="checkbox"
              checked={selectedRoles.includes(role.id)}
              className="form-check-input position-absolute"
            />

            <label
              htmlFor="admin"
              className="d-flex flex-column align-items-center justify-content-center h-100"
            >
              {role.icon}
              <div>{role.label}</div>
            </label>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
}

            {/* <SelectField
              name="manager"
              options={[
                {
                  value: "manager1",
                  label: "Manager1",
                },
                {
                  value: "manager2",
                  label: "Manager2",
                },
                {
                  value: "manager3",
                  label: "Manager3",
                },
              ]}
              label={"Manager"}
              className="register-input mb-3"
              LabelclassName="register-lbl"
            /> */}

            <div className="d-flex justify-content-center mt-5 pb-lg-0 pb-4">
              <Button
                className="register-btn"
                buttonText={"Add Co-worker"}
                type="submit"
                isLoading={isLoading}
              />
            </div>
          </Form>
        )}
      </Formik>



 {/* {isConnection &&     <Formik initialValues={initialValues2} onSubmit={onSubmit2}>
        {(formik) => (
          <Form className="ps-lg-5 pe-lg-5 ps-1 pe-1">
            <SearchUserAutoSelect
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              external_email={encodeURIComponent(enteredMail)}
            />

            <div>
              <SelectField
                name="invitationLanguage"
                options={[
                  {
                    value: "en",
                    label: "English",
                  },
                  {
                    value: "se",
                    label: "Sweden",
                  },
                ]}
                label={"Invitation Language"}
                className="register-input mb-3"
                LabelclassName="register-lbl"
              />
            </div>

            <div className="d-flex justify-content-center mt-5 pb-lg-0 pb-4">
              <Button
                className="register-btn"
                buttonText={"Invite Connections"}
                type="submit"
                isLoading={isLoading}
                isDisabled={selectedUser.length === 0}
              />
            </div>
          </Form>
        )}
      </Formik>} */}
    </div>
  );
};
