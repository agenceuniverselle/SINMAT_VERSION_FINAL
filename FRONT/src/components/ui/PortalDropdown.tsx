import { createPortal } from "react-dom";

export default function PortalDropdown({ children }) {
  return createPortal(
    <div className="fixed top-14 right-10 z-[999999999]">
      {children}
    </div>,
    document.body
  );
}
