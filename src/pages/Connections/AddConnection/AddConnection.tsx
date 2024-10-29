import "./AddConnection.scss";
import { Form, Formik } from "formik";
import Button from "../../../core/Button/Button";
import { useState } from "react";
import SelectField from "../../../core/SelectField/SelectField";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import { createConnectionProps } from "../../../types/types";
import SearchUserAutoSelect from "./../../../components/SearchUserAutoSelect/SearchUserAutoSelect";
import { AddConnectionApi } from "../../../services/connections.service";

export const AddConnection = ({
  closeModal,
  recallData,
  editConnectionDetails,
}: createConnectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>([]);

  const initialValues = {
    invitationLanguage: "",
  };

  const onSubmit = async (values: any, { setSubmitting }: any) => {
    setIsLoading(true);
    if (selectedUser) {
      let data = {
        connection_id: selectedUser[0].id,
        language: values.invitationLanguage,
      };
      let connection_request: any = {};
      if (Object.keys(editConnectionDetails).length === 0) {
        connection_request = await AddConnectionApi(data);
      } else {
        
        connection_request = await AddConnectionApi(data);
      }

      setIsLoading(false);
      if (connection_request.status == 201) {
        toast.success(
          Object.keys(editConnectionDetails).length === 0
            ? "Connection updated."
            : "Connection created."
        );
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

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formik) => (
          <Form className="ps-lg-5 pe-lg-5 ps-1 pe-1">
            <SearchUserAutoSelect
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
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
      </Formik>
    </div>
  );
};
