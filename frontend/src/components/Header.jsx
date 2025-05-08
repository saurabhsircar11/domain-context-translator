import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import ProfilePopover from "./ProfilePopover";
import { logout } from "../features/auth/auth.slice";

const Header = ({ user }) => {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        !e.target.closest("#profile-avatar")
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => setOpen(false))
      .catch((err) => console.error("Logout failed", err));
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800">
        👋 Welcome back,{" "}
        <span className="text-blue-600">{user?.name?.split(" ")[0] ?? ""}</span>
        !
      </h1>

      <div className="relative flex items-center space-x-3">
        <button
          id="profile-avatar"
          onClick={() => setOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          <img
            src={user.avatar}
            alt={`${user.name} avatar`}
            className="w-10 h-10 transition duration-200 rounded-full cursor-pointer ring-2 ring-blue-500 hover:ring-blue-600"
          />
        </button>

        {open && (
          <ProfilePopover ref={popoverRef}>
            <div className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 mx-auto mb-3 rounded-full ring-2 ring-blue-400"
              />
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              <p className="mb-4 text-sm text-gray-500">{user.email}</p>
              <button
                onClick={onLogout}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-xl hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </ProfilePopover>
        )}
      </div>
    </header>
  );
};

export default Header;
