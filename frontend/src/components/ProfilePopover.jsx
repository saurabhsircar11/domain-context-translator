import { createPortal } from "react-dom";
import { forwardRef } from "react";

const ProfilePopover = forwardRef(({ children }, ref) => {
  const portalRoot = document.getElementById("portal-root");

  return createPortal(
    <div
      ref={ref}
      className="absolute z-50 transition-all duration-200 transform bg-white border border-gray-200 shadow-xl right-4 top-16 w-72 rounded-2xl backdrop-blur-sm animate-fadeIn"
    >
      <div className="p-5">{children}</div>
    </div>,
    portalRoot
  );
});

export default ProfilePopover;
