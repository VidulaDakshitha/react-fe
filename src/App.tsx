import React from "react";
import "./config/i18n";
import "./App.scss";
import { Layout } from "./layouts/layout";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRouteProps } from "./types/types";
import { Login } from "./pages/Login/Login";
import { Dashbaord } from "./pages/Dashboard/Dashboard";
import { Register } from "./pages/Register/Register";
import { RegisterType } from "./pages/Register/RegisterType/RegisterType";
import { PasswordConfirm } from "./pages/Register/PasswordConfirm/PasswordConfirm";
import { TaskManagement } from "./pages/TaskManagement/TaskManagement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ViewTask } from "./pages/TaskManagement/ViewTask/ViewTask";
import { ClientType } from "./pages/Register/RegisterClient/RegisterClient";
import { Profile } from "./pages/UserManagement/profile/Profile";
import { BidManagement } from "./pages/BidManagement/BidManagement";
import { FindBids } from "./pages/FindBids/FindBids";
import { Submission } from "./pages/Submission/Submission";
import { CustomProfile } from "./pages/UserManagement/CustomProfile/CustomProfile";
import { Chat } from "./pages/Chat/Chat";
// import { MyProvider } from "./context/Mycontext";
import { WebSocketProvider } from "./context/webSocketContext";
import { WorkerType } from "./pages/Register/RegisterWorker/RegisterWorker";
import { EmployeeManagement } from "./pages/UserManagement/EmployeeManagement/EmployeeManagement";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import { Coworkers } from "./pages/Coworkers/Coworkers";
import { Connections } from "./pages/Connections/Connections";
import { AcceptConnection } from "./pages/Connections/AcceptConnection/AcceptConnection";
import { MyTasks } from "./pages/TaskManagement/MyTasks/MyTasks";
import { AcceptedTasks } from "./pages/TaskManagement/AcceptedTasks/AcceptedTasks";
import { MyBidsSummary } from "./pages/BidManagement/MyBidsSummary/MyBidsSummary";
import { MyBids } from "./pages/BidManagement/MyBids/MyBids";

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   if (!localStorage.getItem("utoken")) {
//     // User is not authenticated, redirect to login page
//     return <Navigate to="/login" />;
//   }
//   return (
//     <WebSocketProvider>
//       {" "}
//       <Layout> {children}</Layout>
//     </WebSocketProvider>
//   );
// };

// Define an interface for the props that the component will accept
// interface ProtectedRouteProps {
//   children: JSX.Element;
//   requiredRoles?: string[]; // Roles allowed for this route
// }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
}) => {
  const token = localStorage.getItem("utoken");
  const roles = localStorage.getItem("roles")?.split(",") || [];

  if (!token) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // Check if the user's role is allowed to access the route
  const hasPermission = requiredRoles.some((role) => roles.includes(role));

  if (!hasPermission) {
    // User doesn't have the required role, redirect to unauthorized or homepage
    return <Navigate to="/unauthorized" />;
  }

  return (
    <WebSocketProvider>
      <Layout>
        {" "}
        <>{children}</>
      </Layout>
    </WebSocketProvider>
  );
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register/:type" element={<Register />} />
          <Route path="/register/type" element={<RegisterType />} />
          <Route path="/client/:type" element={<ClientType />} />
          <Route path="/worker/:type" element={<WorkerType />} />
          <Route
            path="/register-confirm/:id/:token"
            element={<PasswordConfirm />}
          />

          <Route
            path="/connection-accept/:id/:token"
            element={<AcceptConnection />}
          />
          {/* <Route path="/unauth" element={<UnauthPage />} /> */}

          <Route
            path="*"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "customer", "gig_worker"]}
              >
                <Dashbaord />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "customer", "gig_worker"]}
              >
                <Profile />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="view-profile/:id"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "customer", "gig_worker"]}
              >
                <CustomProfile />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="task-management"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "customer", "gig_worker"]}
              >
                <TaskManagement />
              </ProtectedRoute>
            }
          >
            {" "}
          </Route>

          <Route
            path="bid-management"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "sales", "task_manager"]}
              >
                <BidManagement />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="find-bids"
            element={
              <ProtectedRoute>
                <FindBids />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="task-management/:id"
            element={
              <ProtectedRoute  requiredRoles={["admin", "customer", "gig_worker"]}>
                <ViewTask />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="my-task"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "sales", "customer"]}
              >
                <MyTasks />
              </ProtectedRoute>
            }
          ></Route>


<Route
            path="accepted-task"
            element={
              <ProtectedRoute
                requiredRoles={["admin", "sales", "task_manager", "customer"]}
              >
                <AcceptedTasks />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="submission/:id"
            element={
              <ProtectedRoute requiredRoles={["admin","consultant","billing"]}>
                <Submission />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="chat"
            element={
              <ProtectedRoute requiredRoles={["admin", "sales", "task_manager", "customer"]}>
                <Chat />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="user-management"
            element={
              <ProtectedRoute>
                <EmployeeManagement />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="coworkers"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Coworkers />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="connections"
            element={
              <ProtectedRoute requiredRoles={["admin"]}>
                <Connections />
              </ProtectedRoute>
            }
          ></Route>

<Route
            path="my-bids-summary"
            element={
              <ProtectedRoute  requiredRoles={["admin", "sales", "task_manager", "consultant_manager"]}>
                <MyBidsSummary />
              </ProtectedRoute>
            }
          ></Route>


<Route
            path="my-bids"
            element={
              <ProtectedRoute  requiredRoles={["admin", "sales", "task_manager", "consultant_manager"]}>
                <MyBids />
              </ProtectedRoute>
            }
          ></Route>


<Route
            path="my-payments"
            element={
              <ProtectedRoute  requiredRoles={["admin", "customer", "billing", "consultant_manager"]}>
                <MyBids />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
