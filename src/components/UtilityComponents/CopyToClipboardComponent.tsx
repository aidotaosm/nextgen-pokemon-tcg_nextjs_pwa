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
}
export const CopyToClipboardComponent: FunctionComponent<
  CopyToClipboardComponentProps
> = ({ copyText, children, classes }) => {
  const [isCopied, setIsCopied] = useState(false);
  const appContextValues = useContext(AppContext);

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
      <span title={isCopied ? "Copied!" : "Copy to clipboard."}>
        <FontAwesomeIcon
          className={"cursor-pointer user-select-none " + classes}
          icon={faCopy}
          onClick={handleCopyClick}
        />
      </span>
    </Fragment>
  );
};
