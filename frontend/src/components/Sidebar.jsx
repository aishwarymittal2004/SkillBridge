import { NavLink } from "react-router-dom";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 11-1.06 1.06l-.97-.97V19.5a2.25 2.25 0 01-2.25 2.25h-3a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-2.25a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75h-3A2.25 2.25 0 013 19.5v-6.88l-.97.97a.75.75 0 01-1.06-1.06l8.69-8.69z",
  },
  {
    to: "/history",
    label: "History",
    icon: "M12 6a.75.75 0 01.75.75v4.94l3.28 1.89a.75.75 0 11-.75 1.3l-3.66-2.1a.75.75 0 01-.37-.65V6.75A.75.75 0 0112 6zM12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM3.75 12a8.25 8.25 0 1116.5 0 8.25 8.25 0 01-16.5 0z",
  },
  {
    to: "/progress",
    label: "Progress",
    icon: "M5 3.75A2.25 2.25 0 007.25 6h9.5A2.25 2.25 0 0019 3.75V3H5v.75zM5 7.5v8.75A2.75 2.75 0 007.75 19h8.5A2.75 2.75 0 0019 16.25V7.5H5zm3 7a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 018 14.5zm0-3a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 018 11.5z",
  },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-2.5 rounded-full px-3.5 py-2 text-sm font-bold transition-base border-2 ${
    isActive
      ? "bg-lime-400 border-ink-700 text-ink-700"
      : "border-transparent text-ink-500/70 hover:bg-cream-100 hover:text-ink-700"
  }`;

export default function Sidebar() {
  return (
    <div className="hidden sm:flex w-56 shrink-0 flex-col border-r-2 border-ink-700 bg-cream-50 px-3 py-5">
      <div className="flex items-center gap-2 px-2 mb-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink-700 bg-lime-400 text-ink-700 text-xs font-black">
          S
        </span>
        <span className="text-[15px] font-extrabold tracking-tight text-ink-700">
          SkillBridge
        </span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {links.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0">
              <path d={icon} />
            </svg>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}