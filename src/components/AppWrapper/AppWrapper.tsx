import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { BasicProps } from "../../models/GenericModels";

export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  let router = useRouter();

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="" onClick={() => router.back()}>
            {/* <i className="fa-solid fa-arrow-left fs-3 cursor-pointer"></i> */}
          </div>
          <h3 className="mb-0 align-self-center">Header</h3>
          <div></div>
        </div>
      </header>
      <main className="flex-grow-1">{children}</main>
      <footer className="container py-2 ">
        <h5 className="text-center  mb-0">Footer</h5>
      </footer>
    </div>
  );
};
