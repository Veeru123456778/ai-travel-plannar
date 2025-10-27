"use client";

import { useNotification } from "@/context/NotificationContext";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const { notifications, setNotifications } = useNotification(); // ✅ FIXED: added setNotifications
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef();
  const router = useRouter();
  const user = useUser()?.user;

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications?userId=${user.id}`);
        const data = await res.json();
        setNotifications(data); // ✅ Load old notifications on mount
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [user, setNotifications]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNotificationClick = (roomId) => {
    router.push(`/trip/ai/${roomId}`);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={toggleDropdown} className="relative">
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-md shadow-lg z-50">
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-300">
              No notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className="p-3 border-b border-gray-200 dark:border-gray-600 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleNotificationClick(notif.roomId)}
              >
                📩 <strong>{notif.inviterEmail}</strong> invited you to join a
                room as <em>{notif.permission}</em>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
