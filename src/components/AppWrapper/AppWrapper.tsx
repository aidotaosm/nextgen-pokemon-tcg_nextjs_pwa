import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  let router = useRouter();

  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="cursor-pointer" onClick={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeftLong} size="2x" />
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
