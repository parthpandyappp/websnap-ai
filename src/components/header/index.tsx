import { useState } from "react";
import { IoMdClipboard } from "react-icons/io";

export const Header = ({
  favicon,
  source,
  copyToClipboardFn,
  showCopyToClipboard,
}: {
  favicon?: string;
  source?: string;
  showCopyToClipboard: boolean;
  copyToClipboardFn: () => void;
}) => {
  const [showCopiedPopup, setShowCopiedPopup] = useState<boolean>(false);

  const copyToClipboard = () => {
    setShowCopiedPopup(true);
    copyToClipboardFn();
    setTimeout(() => {
      setShowCopiedPopup(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-between relative">
      <div className="flex items-center gap-2">
        {favicon && (
          <img src={favicon} alt="Website favicon" className="h-6 w-6" />
        )}
        <p className="text-sm font-semibold">source: {source}</p>
      </div>

      {showCopyToClipboard && (
        <div className="relative flex items-center">
          <IoMdClipboard
            size="16"
            className="cursor-pointer"
            onClick={copyToClipboard}
            title="copy summary to clipboard"
          />
          <span
            className={`absolute -bottom-6 right-0 bg-slate-600 text-teal-200 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap p-1
              transition-all duration-300 ease-in-out transform
              ${
                showCopiedPopup
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            summary copied to clipboard
          </span>
        </div>
      )}
    </div>
  );
};
