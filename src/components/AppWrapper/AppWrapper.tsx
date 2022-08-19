import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import { BasicProps } from "../../models/GenericModels";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { IF } from "../UtilityComponents/IF";
import { UserProvider } from "../../contexts/AppContext";

export const AppWrapper: FunctionComponent<BasicProps> = ({ children }) => {
  let router = useRouter();
  const [pathToRedirect, setPathToRedirect] = useState("");
  useEffect(() => {
    let splitPath = router.pathname.split("/")[1];
    if (!splitPath) {
      setPathToRedirect("");
    } else if (splitPath === "series") {
      setPathToRedirect("/");
    } else if (splitPath === "set") {
      setPathToRedirect("/series");
    }
  }, [router.pathname]);
  return (
    <div className="d-flex flex-column" style={{ height: "100vh" }}>
      <header className="container py-2">
        <div
          className={
            "d-flex align-items-center " +
            (pathToRedirect
              ? "justify-content-between"
              : "justify-content-center")
          }
        >
          <IF condition={pathToRedirect}>
            <div
              className="cursor-pointer"
              onClick={() => {
                router.push(pathToRedirect);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeftLong} size="2x" />
            </div>
          </IF>
          <h3 className="mb-0 align-self-center">Header</h3>
          <div></div>
        </div>
      </header>
      <UserProvider>
        <main className="flex-grow-1">{children}</main>
      </UserProvider>
      <footer className="container py-2 ">
        <h5 className="text-center  mb-0">Footer</h5>
      </footer>
    </div>
  );
};
