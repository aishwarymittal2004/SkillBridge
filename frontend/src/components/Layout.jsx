import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />
        <div className="flex-1 px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}