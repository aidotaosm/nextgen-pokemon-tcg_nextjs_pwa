import { FunctionComponent, memo, useEffect } from "react";
import { ModalProps } from "../../models/GenericModels";
const ModalComponent: FunctionComponent<ModalProps> = ({
  primaryClasses = "",
  secondaryClasses = "",
  id = "bootstrap-modal",
  children,
  handleModalClose = () => {},
  modalCloseButton = null,
  hideFooter = true,
  hideHeader = true,
  modalTitle = "Modal Title",
  showOkButton = false,
  okButtonText = "Ok",
  handleOkButtonPress = () => {},
}) => {
  // console.log("modal component rendered");
  useEffect(() => {
    let modal = document.getElementById(id);
    modal?.addEventListener("hidden.bs.modal", handleModalClose);
    return () => {
      modal?.removeEventListener("hidden.bs.modal", handleModalClose);
      let bodyElement = document.getElementsByTagName("body")[0] as HTMLElement;
      let modalBackdrop = document.getElementsByClassName(
        "modal-backdrop"
      )[0] as HTMLElement;
      if (modalBackdrop && bodyElement) {
        modalBackdrop.parentNode?.removeChild(modalBackdrop);
        bodyElement.classList.remove("modal-open");
        bodyElement.style.overflow = "";
        bodyElement.style.paddingRight = "";
      }
    };
  }, []);
  return (
    <div
      className="modal fade"
      id={id}
      aria-hidden="true"
      aria-labelledby="exampleModalLabel"
    >
      <div className={"modal-dialog " + primaryClasses}>
        <div className={"modal-content " + secondaryClasses}>
          <div className={"modal-header " + (hideHeader && "d-none")}>
            <h5 className="modal-title">{modalTitle}</h5>
            <button
              type="button"
              className="btn btn-close btn-sm"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className={"modal-footer " + (hideFooter && "d-none")}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
              ref={modalCloseButton}
            >
              Close
            </button>
            <button
              type="button"
              className={"btn btn-primary btn-sm " + (showOkButton && "d-none")}
              onClick={handleOkButtonPress}
            >
              {okButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const MemoizedModalComponent = memo(ModalComponent);
export default MemoizedModalComponent;
