import React, { useEffect, useState } from "react";
import { FaBell, FaTrash } from "react-icons/fa";
import notificationApi from "../api/notificationApi";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );
    if (!confirmDelete) return;

    try {
      await notificationApi.deletNotification(id);
      // Remove deleted notification from the list
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      notificationApi
        .getNotificationsByUserId(userId)
        .then((data) => {
          setNotifications(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching notifications:", err);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaBell className="text-emerald-600" />
        Your Notifications
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">You have no notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white shadow rounded-lg p-4 border-l-4 border-emerald-500 relative"
            >
              <button
                onClick={() => handleDeleteNotification(notif.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Delete notification"
              >
                <FaTrash />
              </button>
              <h2 className="text-lg font-medium text-gray-800">
                {notif.title}
              </h2>
              <p className="text-gray-600 text-sm">{notif.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;