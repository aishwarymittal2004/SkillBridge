import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/history": "Resume History",
  "/progress": "Progress",
};

function getTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/resume/")) return "Resume Report";
  return "SkillBridge";
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "Logged In";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-ink-700 bg-cream-50/90 backdrop-blur px-6 py-3.5">

      <h1 className="text-lg font-extrabold text-ink-700">
        {getTitle(location.pathname)}
      </h1>

      <div className="relative">

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 rounded-full border-2 border-ink-700 bg-cream-50 px-3 py-1.5 shadow-hard-sm transition-base hover:bg-white"
        >

          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 font-black">
            {avatarLetter}
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-ink-700">
              {displayName}
            </p>

            <p className="text-xs text-ink-500/60">
              {displayEmail}
            </p>
          </div>

          <svg
            className={`h-4 w-4 text-ink-700 transition-base ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>

        </button>

        {open && (

          <div className="absolute right-0 mt-3 w-56 rounded-2xl border-2 border-ink-700 bg-cream-50 shadow-hard overflow-hidden">

            <div className="border-b-2 border-ink-700/10 p-4">

              <p className="font-bold text-ink-700">
                {displayName}
              </p>

              <p className="text-sm text-ink-500/60">
                {displayEmail}
              </p>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-ink-700 transition-base hover:bg-lime-100"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate("/history")}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-ink-700 transition-base hover:bg-lime-100"
            >
              Resume History
            </button>

            <button
              onClick={logout}
              className="w-full border-t-2 border-ink-700/10 px-4 py-3 text-left text-sm font-semibold text-danger-500 transition-base hover:bg-danger-100"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
}