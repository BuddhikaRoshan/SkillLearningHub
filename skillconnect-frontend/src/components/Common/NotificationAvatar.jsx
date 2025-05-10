import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import notificationApi from "../../api/notificationApi";
import { Link } from "react-router-dom";

const NotificationAvatar = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      notificationApi
        .getNotificationCountByUserId(userId)
        .then((count) => {
          setNotificationCount(count);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load notifications");
          setLoading(false);
          console.error(err);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="relative cursor-pointer">
        <FaBell className="text-2xl text-gray-700 animate-spin" />
      </div>
    );
  }

  return (
    <Link to="/notifications">
      <div className="relative cursor-pointer">
        <FaBell className="text-2xl text-gray-700" />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
            {notificationCount}
          </span>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
      </div>
    </Link>
  );
};

export default NotificationAvatar;
