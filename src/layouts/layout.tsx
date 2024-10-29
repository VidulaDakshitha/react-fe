import { Footer } from "../components/Footer/Footer";
import Header from "../components/Header/Header";

import { ProtectedRouteProps } from "../types/types";
// import { Header } from './header/header';
import "./layout.scss";

export const Layout = ({ children }: ProtectedRouteProps) => {
  return (
    
    <div
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      className="slide-up"
    >
      <Header user="client" />
      <div style={{ flexGrow: 1, overflowY: "auto" }} className="d-flex align-content-between flex-wrap">
        <div className="w-100">{children}</div> {/* This is your content area */}
        {<Footer />}
      </div>
    </div>
  );
};
