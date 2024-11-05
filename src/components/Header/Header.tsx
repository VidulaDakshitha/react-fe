// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { BsList } from "react-icons/bs";
// import { HeaderProps } from "../../types/types";
// import { useWebSocket } from "../../context/webSocketContext";
// import { SearchBar } from "../SearchBar/SearchBar";
// import ImageComponent from "../../core/Image/Image";
// import profile from "../../assets/profile.png";
// import "./Header.scss";

// const Header: React.FC<HeaderProps> = ({ user }) => {
//   const { messages } = useWebSocket();
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [isOpen, setIsOpen] = useState(false);

//   const e_userType = localStorage.getItem("e_type");
//   const j_userType = localStorage.getItem("j_type");
//   const isCompany = localStorage.getItem("isadmin") === "comp";
//   const roles = localStorage.getItem("roles")?.split(",") || [];
//   const hasPermission = (requiredRoles:any)=>{
//     console.log(requiredRoles)
//     return  requiredRoles.some((role:any) => roles.includes(role))
  
//   };

//   useEffect(() => {
//     if (messages?.data) {
//       try {
//         const parsedMessage = JSON.parse(messages.data);
//         setNotifications(prev => [...prev, parsedMessage]);
//       } catch (error) {
//         console.error("Error parsing JSON:", error);
//       }
//     }
//   }, [messages?.data]);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const renderMenuItem = (label: string, path: string, isMobile = false) => (
//     <div
//       key={path}
//       className={`menu-option p-4 ${isMobile ? 'menu2 pb-2' : 'hide-mobile'}`}
//       onClick={() => navigate(path)}
//     >
//       {label}
//     </div>
//   );

//   const renderMenuItems = (isMobile = false) => {
//     const items = [];
//     if (hasPermission(['admin', 'customer', 'gig_worker'])) {
//       items.push(renderMenuItem("My Tasks", "/task-management", isMobile));
//     }
//     if (j_userType === "1") {
//       items.push(
//         renderMenuItem("Find Bid", "/find-bids", isMobile),
//         renderMenuItem("My Bids", "/bid-management", isMobile)
//       );
//     } 


//     if (hasPermission(['admin'])) {
//       // items.push(renderMenuItem("User Management", "/user-management", isMobile));
//       items.push(renderMenuItem("Co-workers", "/coworkers", isMobile));
//       items.push(renderMenuItem("Connections", "/connections", isMobile));
//     }

//     items.push(renderMenuItem("Chat", "/chat", isMobile));

//     return items;
//   };

//   return (
//     <div className="d-flex justify-content-between">
//       <div className="d-flex">
//         <div className="pt-3 hide-desktop" onClick={toggleSidebar}>
//           <BsList style={{ fontSize: '1.5rem' }} />
//         </div>
//         <div className="header-logo p-3" onClick={() => navigate("/")}>
//           Sparetan
//         </div>
//         {renderMenuItems()}
//       </div>

//       <div className="d-flex pt-4 pe-4 align-items-center">
//         <div className="pe-4 hide-mobile">
//           <SearchBar widthClass="search-size" />
//         </div>
//         <NotificationBell notifications={notifications} />
//         <ProfileDropdown />
//       </div>

//       <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
//         {renderMenuItems(true)}
//       </nav>
//     </div>
//   );
// };

// const NotificationBell: React.FC<{ notifications: any[] }> = ({ notifications }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="dropdown">
//       <button
//         type="button"
//         id="dropdownMenuButton2"
//         data-bs-toggle="dropdown"
//         aria-expanded="false"
//         className="btn btn-link p-0"
//       >
//         <i className="bi bi-bell pe-4">
//           {notifications.length > 0 && (
//             <span className="badge bg-secondary rounded-pill">
//               {notifications.length}
//             </span>
//           )}
//         </i>
//       </button>
//       <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
//         {notifications.map((notify, index) => (
//           <li key={index}>
//             <div className="dropdown-item" onClick={() => navigate("/chat/")}>
//               You have a new message
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// const ProfileDropdown: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="dropdown">
//       <button
//         className="btn btn-link dropdown-toggle p-0"
//         type="button"
//         id="dropdownMenuButton"
//         data-bs-toggle="dropdown"
//         aria-expanded="false"
//       >
//         <ImageComponent src={profile} alt="Profile" />
//       </button>
//       <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
//         <li>
//           <div className="dropdown-item" onClick={() => navigate("/profile")}>
//             Profile
//           </div>
//         </li>
//         <li>
//           <div className="dropdown-item" onClick={() => navigate("/login")}>
//             Logout
//           </div>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Header;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsList } from "react-icons/bs";
import { HeaderProps } from "../../types/types";
import { useWebSocket } from "../../context/webSocketContext";
import { SearchBar } from "../SearchBar/SearchBar";
import ImageComponent from "../../core/Image/Image";
import profile from "../../assets/profile.png";
import "./Header.scss";
import { useUserRole } from "../../hooks/HasRole";

const Header: React.FC<HeaderProps> = ({ user }) => {
  const { messages } = useWebSocket();
  const { roles, hasRole, hasOrganization } = useUserRole();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // State to track dropdown visibility
  const [taskDropdownVisible, setTaskDropdownVisible] = useState(false);
  const [bidDropdownVisible, setBidDropdownVisible] = useState(false);

  const e_userType = localStorage.getItem("e_type");
  const j_userType = localStorage.getItem("j_type");
  const isCompany = localStorage.getItem("isadmin") === "comp";
  // const roles = localStorage.getItem("roles")?.split(",") || [];
  
  const hasPermission = (requiredRoles:any)=> {
    return requiredRoles.some((role:any) => hasRole(role));
  };

  useEffect(() => {
    if (messages?.data) {
      try {
        const parsedMessage = JSON.parse(messages.data);
        setNotifications(prev => [...prev, parsedMessage]);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [messages?.data]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderMenuItem = (label: string, path: string, isMobile = false) => (
    <div
      key={path}
      className={`menu-option p-4 ${isMobile ? 'menu2 pb-2' : 'hide-mobile'}`}
      onClick={() => navigate(path)}
    >
      {label}
    </div>
  );


  const ProfileDropdown: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <button
        className="btn btn-link dropdown-toggle p-0"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <ImageComponent src={profile} alt="Profile" />
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li>
          <div className="dropdown-item" onClick={() => navigate("/profile")}>
            Profile
          </div>
        </li>
        <li>
          <div className="dropdown-item" onClick={() => navigate("/login")}>
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
};


const NotificationBell: React.FC<{ notifications: any[] }> = ({ notifications }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <button
        type="button"
        id="dropdownMenuButton2"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        className="btn btn-link p-0"
      >
        <i className="bi bi-bell pe-4">
          {notifications.length > 0 && (
            <span className="badge bg-secondary rounded-pill">
              {notifications.length}
            </span>
          )}
        </i>
      </button>
      <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
        {notifications.map((notify, index) => (
          <li key={index}>
            <div className="dropdown-item" onClick={() => navigate("/chat/")}>
              You have a new message
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

  // Dropdown component
  const renderDropdown = (label: string, options: { label: string, path: string }[], isVisible: boolean, setVisible: (val: boolean) => void) => (
    <div
      className="menu-option p-4 position-relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {label}
      {isVisible && (
        <div className="dropdown-menu show">
          {options.map((option, idx) => (
            <div
              key={idx}
              className="dropdown-item"
              onClick={() => navigate(option.path)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMenuItems = (isMobile = false) => {
    const items = [];

    // Task dropdown with hover effect
    const taskOptions = [
      { label: "My Task", path: "/my-task" },
      { label: "Accepted Tasks", path: "/accepted-task" },
  // { label: "Find Task", path: "/task-management" },
    ];

    // if(hasPermission(['customer']) && !hasOrganization() && roles.length==1){
    //   taskOptions.pop()
    // }

    // if(hasPermission(['consultant'] || hasPermission(['task_manager'])){
    //   taskOptions.pop()
    // }

    if(hasPermission(['admin']) || hasPermission(['sales']) || hasPermission(['over_employee'])  || hasPermission(['gig_worker'])){
      taskOptions.push({ label: "Find Task", path: "/task-management" })
    }
    items.push(renderDropdown("Task", taskOptions, taskDropdownVisible, setTaskDropdownVisible));

    let bidOptions:any = [];
    // Bid dropdown with hover effect
    if (hasPermission(['admin']) || hasPermission(['sales']) || hasPermission(['over_employee'])  || hasPermission(['gig_worker'])) {
       bidOptions = [
        { label: "My Bids", path: "/my-bids" },
      
      ];
      
    }

    if(hasPermission(['admin']) || hasPermission(['task_manager']) || hasPermission(['over_employee']) || hasPermission(['gig_worker'])){
      bidOptions.push(  { label: "Bids", path: "/my-bids-summary" })
    }

        if(hasPermission(['customer']) && !hasOrganization() && roles.length==1){
          bidOptions.push(  { label: "Bids", path: "/my-bids-summary" })
    }

    if(bidOptions.length>0){
      items.push(renderDropdown("Bid", bidOptions, bidDropdownVisible, setBidDropdownVisible));

    }

    if (hasPermission(['admin'])) {
      items.push(renderMenuItem("Co-workers", "/coworkers", isMobile));
      // items.push(renderMenuItem("Connections", "/connections", isMobile));
    }

    items.push(renderMenuItem("Chat", "/chat", isMobile));

    return items;
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        <div className="pt-3 hide-desktop" onClick={toggleSidebar}>
          <BsList style={{ fontSize: '1.5rem' }} />
        </div>
        <div className="header-logo p-3" onClick={() => navigate("/")}>
          Sparetan
        </div>
        {renderMenuItems()}
      </div>

      <div className="d-flex pt-4 pe-4 align-items-center">
        <div className="pe-4 hide-mobile">
          <SearchBar widthClass="search-size" />
        </div>
        <NotificationBell notifications={notifications} />
        <ProfileDropdown />
      </div>

      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {renderMenuItems(true)}
      </nav>
    </div>
  );
};

export default Header;
