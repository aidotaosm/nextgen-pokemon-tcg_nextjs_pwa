import { Fragment, FunctionComponent } from "react";

interface ToastProps {
  autoHide: boolean;
  id: string;
  toastTitle: string;
  children: JSX.Element;
  toastPosition?: "top-0 end-0" | "bottom-0 end-0";
}
export const ToastComponent: FunctionComponent<ToastProps> = ({
  autoHide = false,
  id,
  toastTitle,
  children,
  toastPosition = "top-0 end-0",
}) => {
  return (
    <Fragment>
      <div className={"toast-container position-fixed p-3 " + toastPosition}>
        <div
          id={id}
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-autohide={autoHide}
        >
          <div className="toast-header">
            {/* <img src="..." className="rounded me-2" alt="..." /> */}
            <strong className="me-auto">{toastTitle}</strong>
            {/* <small>11 mins ago</small> */}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">{children}</div>
        </div>
      </div>
    </Fragment>
  );
};
