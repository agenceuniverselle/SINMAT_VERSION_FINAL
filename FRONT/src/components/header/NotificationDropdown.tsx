import { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown"; 

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative z-[99999]">
      {/* Bouton */}
      <button
        onClick={toggleDropdown}
        className="dropdown-toggle relative flex items-center justify-center h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-100"
      >
        {notifying && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
        )}
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C10.3431 2 9 3.34315 9 5V6.17391C6.6141 7.06334 5 9.38652 5 12V17L3 19V20H21V19L19 17V12C19 9.38652 17.3859 7.06334 15 6.17391V5C15 3.34315 13.6569 2 12 2Z" />
        </svg>
      </button>

      {/* Dropdown PORTAL */}
      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-[360px]">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-lg font-semibold text-gray-800">Notification</h4>
          <button onClick={closeDropdown} className="text-gray-400 hover:text-gray-700">✕</button>
        </div>

        <ul className="max-h-[400px] overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
          {[...Array(6)].map((_, i) => (
            <li key={i} className="flex items-start gap-3 p-4 hover:bg-gray-50 transition">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={`/images/user/user-0${(i % 5) + 1}.jpg`}
                alt="User"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">John Doe</span> sent you an update on{" "}
                  <span className="font-semibold">Project - App</span>
                </p>
                <span className="text-xs text-gray-500">Project • 5 min ago</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="p-3 border-t border-gray-100">
          <Link
            to="/notifications"
            className="block text-center text-sm text-blue-600 font-medium hover:underline"
          >
            View All Notifications
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
