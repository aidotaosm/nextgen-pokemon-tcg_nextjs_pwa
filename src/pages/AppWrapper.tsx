import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const AppWrapper = () => {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    console.log(location);
    if (location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location.pathname]);
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left fs-3 cursor-pointer"></i>
          </div>
          <h3 className="mb-0 align-self-center">Header</h3>
          <div></div>
        </div>
      </header>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="container py-2 ">
        <h5 className="text-center  mb-0">Footer</h5>
      </footer>
    </div>
  );
};
