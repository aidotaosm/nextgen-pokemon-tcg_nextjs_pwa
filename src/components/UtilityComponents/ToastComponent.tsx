import { Fragment, FunctionComponent } from "react";

interface ToastProps {
  autoHide: boolean;
  id: string;
  toastTriggerId: string;
  toastTitle: string;
  children: JSX.Element;
}
export const ToastComponent: FunctionComponent<ToastProps> = ({
  autoHide = false,
  toastTriggerId,
  id,
  toastTitle,
  children,
}) => {
  return (
    <Fragment>
      <button type="button" className="btn btn-primary" id={toastTriggerId}>
        Toast
      </button>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
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
