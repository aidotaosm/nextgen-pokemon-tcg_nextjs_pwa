import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { AppContext } from "../../contexts/AppContext";
interface CopyToClipboardComponentProps {
  copyText: string;
  children?: HTMLElement;
  classes?: string;
  popOverId: string;
  card: any;
}
export const CopyToClipboardComponent: FunctionComponent<
  CopyToClipboardComponentProps
> = ({ copyText, children, classes, popOverId, card }) => {
  const [isCopied, setIsCopied] = useState(false);
  const appContextValues = useContext(AppContext);
  useEffect(() => {
    let bootStrapMasterClass = appContextValues?.appState?.bootstrap;
    const popoverTrigger = document.getElementById(popOverId) as any;
    if (bootStrapMasterClass && popoverTrigger) {
      new bootStrapMasterClass.Popover(popoverTrigger);
    }
  }, [appContextValues?.appState?.bootstrap]);

  // This is the function we wrote earlier
  const copyTextToClipboard = async (text: string) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <input type="text" value={copyText} readOnly className="d-none" />
      {/* Bind our handler function to the onClick button property */}
      <a
        tabIndex={0}
        // title={isCopied ? "Copied!" : "Copy to clipboard."}
        id={popOverId}
        data-bs-toggle="popover"
        //data-bs-title="Copy to clipboard."
        onClick={(e) => {
          e.stopPropagation();
        }}
        // data-bs-custom-class="bg-grey"
        data-bs-trigger=" focus"
        data-bs-content={`Link of ${card.name} Copied to clipboard!`}
        className="text-warning white-hover"
      >
        <FontAwesomeIcon
          className={"cursor-pointer user-select-none " + classes}
          icon={faCopy}
          onClick={handleCopyClick}
        />
      </a>
    </Fragment>
  );
};
