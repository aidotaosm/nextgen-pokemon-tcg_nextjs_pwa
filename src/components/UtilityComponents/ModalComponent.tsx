import {
  Fragment,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { ModalProps } from "../../models/GenericModels";
import { ImageComponent } from "../ImageComponent/ImageComponent";
export const ModalComponent: FunctionComponent<ModalProps> = ({
  primaryClasses = "",
  secondaryClasses = "",
  id = "bootstrap-modal",
  children,
  handleModalClose,
  modalCloseButton,
}) => {
  useEffect(() => {
    let modal = document.getElementById("list-view-card-modal");
    modal?.addEventListener("hidden.bs.modal", handleModalClose);
    return () => {
      modal?.removeEventListener("hidden.bs.modal", handleModalClose);
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
          <div className="modal-body">{children}</div>
          <div className="modal-footer p-1 d-none">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              data-bs-dismiss="modal"
              ref={modalCloseButton}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
