import React, { useEffect, useState } from "react";
import "./SearchUserAutoSelect.scss";
import { AutoSelectSearch } from "../AutoSelectSearch/AutoSelectSearch";
import { ErrorNotification } from "./../ErrorNotification/ErrorNotification";
import {
  GetExtrenalUserApi,
  GetOrganizationsApi,
  GetSubContractorsUserApi,
  GetWorkersApi,
} from "./../../services/connections.service";

const SearchUserAutoSelect = ({
  clearOnSelect = false,
  selectedUser,
  setSelectedUser,
  connectionType = "external",
  external_email,
}: any) => {
  const [searchedString, setSearchedString] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [fetchedUserList, setFetchedUserList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log(connectionType)
  useEffect(
    () => console.log(selectedOption, "selectedOption"),
    [selectedOption]
  );

  useEffect(()=>{
    if(external_email){
      fetchOptions(external_email)
    }
    
  },[external_email])
  const handleChange = (selectedOptions: any) => {
    setSelectedOption(selectedOptions);
    console.log(selectedOptions, "selectedOptions");
    const exists =
      selectedOptions &&
      selectedUser.some((sub: any) => sub.email === selectedOptions.email);

    if (!exists && selectedOptions) {
      setSelectedUser((prev: any) => [...prev, selectedOptions]);
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
          searchedResults = await GetWorkersApi(inputValue);
        } else {
          searchedResults = await GetOrganizationsApi(inputValue);
        }
console.log(searchedResults)
        updatedUsers = searchedResults?.data.map((user: any, index: any) => ({
          ...user,
          value: user.id,
          label:
            connectionType == "SubContractors"
              ? user.name
              : user.name,
          avatar: "https://via.placeholder.com/40",
          type:  connectionType == "SubContractors"
          ? "worker"
          : "company",
        }));
        console.log(updatedUsers)
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
        Search for connections who are already using the system by typing their
        name, email, or company.
      </p>
      <div className="mb-4">
        {searchedString !== "" &&
          fetchedUserList.length === 0 &&
          !isLoading && (
            <div>
              <p className="mb-4 text-danger">
                No {connectionType=="company"?"organizations":"Co-workers"} found. Try a different search term or invite your
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

export default SearchUserAutoSelect;
