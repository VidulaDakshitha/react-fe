import { useState, useEffect } from "react";

// Hook to get user roles and check if a user has a specific role
export const useUserRole = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isOrganization, setIsOrganization] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the roles from localStorage or any other source
    const savedRoles = localStorage.getItem("roles");
    const isOrganizationValue = localStorage.getItem("has_associated_organization_details");
    if (savedRoles) {
      setRoles(savedRoles.split(","));
    }

    if(isOrganizationValue){
      setIsOrganization(true)
    }
  }, []);

  // Function to check if the user has a certain role
  const hasRole = (role: string) => {
    return roles.includes(role);
  };


  const hasOrganization = () => {
    return isOrganization;
  };

  return { roles, hasRole, hasOrganization };
};
