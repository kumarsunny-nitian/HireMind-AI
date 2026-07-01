function WelcomeCard({
  user,
  unreadCount,
  setShowNotifications,
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex flex-col md:flex-row justify-between items-center">

        {/* Left Side */}
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            👋 Welcome back,
          </h1>

          <h2 className="text-2xl font-semibold text-blue-600 mt-2">
            {user?.name}
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {user?.email}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="font-semibold dark:text-white">
              Role:
            </span>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-semibold capitalize">
              {user?.role}
            </span>
          </div>

          <p className="mt-5 text-gray-500 dark:text-gray-400">
            Manage jobs, applicants and interviews from one dashboard.
          </p>
        </div>

        {/* Avatar */}
        <div className="mt-6 md:mt-0 flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-6xl shadow-lg">
          👨‍💼
        </div>
      </div>

      {/* Notification Bell */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="relative text-2xl"
        >
          🔔

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default WelcomeCard;