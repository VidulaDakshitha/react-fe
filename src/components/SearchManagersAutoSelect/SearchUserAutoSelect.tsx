import React, { useEffect, useState } from "react";
import "./SearchUserAutoSelect.scss";
import { AutoSelectSearch } from "../AutoSelectSearch/AutoSelectSearch";
import { ErrorNotification } from "../ErrorNotification/ErrorNotification";
import {
  GetExtrenalUserApi,
  GetManagerUserApi,
  GetSubContractorsUserApi,
} from "../../services/connections.service";

const SearchManagersAutoSelect = ({
  clearOnSelect = false,
  selectedUser,
  setSelectedUser,
  connectionType = "external",
  multipleSelection = false, // Added this prop to decide single or multiple selections
}: any) => {
  const [searchedString, setSearchedString] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [fetchedUserList, setFetchedUserList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => console.log(selectedOption, "selectedOption"), [selectedOption]);

  const handleChange = (selectedOptions: any) => {
    setSelectedOption(selectedOptions);
    console.log(selectedOptions, "selectedOptions");

    if (multipleSelection) {
      // Allow multiple selections
      const exists =
        selectedOptions &&
        selectedUser.some((sub: any) => sub.email === selectedOptions.email);

      if (!exists && selectedOptions) {
        setSelectedUser((prev: any) => [...prev, selectedOptions]);
        clearOnSelect && setSelectedOption("");
      }
    } else {
      // Single selection, replace the previous selection
      setSelectedUser([selectedOptions]);
      clearOnSelect && setSelectedOption("");
    }
  };

  const fetchOptions = (inputValue: any) => {
    setSearchedString && setSearchedString(inputValue);
    setIsLoading(true);
    setFetchedUserList([]);
    return new Promise((resolve) => {
      setTimeout(async () => {
        // fetch user list API
        let updatedUsers = [];
        let searchedResults: any = [];
        if (connectionType == "SubContractors") {
          searchedResults = await GetManagerUserApi(inputValue,"consultant_manager");
        } else if(connectionType == "worker"){
          searchedResults = await GetManagerUserApi(inputValue,'consultant');
        }

        updatedUsers = searchedResults?.data.map((user: any, index: any) => ({
          ...user,
          value: user.id,
          label:
            connectionType == "SubContractors"
              ? user.name
              : user.first_name + " " + user.last_name,
          avatar: "https://via.placeholder.com/40",
        }));
        setIsLoading(false);
        if (searchedResults.status == 200) {
          setFetchedUserList(updatedUsers);
          resolve(updatedUsers);
        } else {
          ErrorNotification("");
        }
      }, 1000);
    });
  };

  return (
    <>
      <p className="card-text">
        Search for users who are already using the system by typing their
        name, email.
      </p>
      <div className="mb-4">
        {searchedString !== "" &&
          fetchedUserList.length === 0 &&
          !isLoading && (
            <div>
              <p className="mb-4 text-danger">
                No coworkers found. Try a different search term or invite your
                colleagues to join the platform.
              </p>
            </div>
          )}
      </div>
      <div className="form-group mb-4">
        <AutoSelectSearch
          fetchOptions={fetchOptions}
          placeholder="First name, Email or Company"
          handleChange={handleChange}
          selectedOption={selectedOption}
          clearOnSelect={true}
        />
      </div>
    </>
  );
};

export default SearchManagersAutoSelect;
