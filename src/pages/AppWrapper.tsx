import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { HomePage } from "./homepage";

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
      <header className="h3 text-center">Header</header>
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="h5 text-center">Footer</footer>
    </div>
  );
};
