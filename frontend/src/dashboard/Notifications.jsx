function Notifications({
  notifications,
  showNotifications,
  markAsRead,
}) {
  if (!showNotifications) return null;

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">
        🔔 Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          No notifications
        </p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => !n.read && markAsRead(n._id)}
            className={`
              p-4
              mb-3
              rounded-xl
              cursor-pointer
              transition
              border
              dark:border-gray-700
              hover:bg-gray-100
              dark:hover:bg-gray-700
              ${!n.read ? "bg-blue-50 dark:bg-gray-700" : ""}
            `}
          >
            <h3 className="font-semibold dark:text-white">
              {n.title}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {n.message}
            </p>

            {!n.read && (
              <span className="inline-block mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                New
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;