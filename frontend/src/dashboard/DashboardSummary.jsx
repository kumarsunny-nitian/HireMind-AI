function DashboardSummary({ stats }) {
  const cards = [
    {
      title: "Jobs Posted",
      value: stats.totalJobs,
      color: "bg-blue-500",
      width: Math.min(stats.totalJobs * 20, 100),
      icon: "💼",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      color: "bg-green-500",
      width: Math.min(stats.totalApplications * 10, 100),
      icon: "📄",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      color: "bg-yellow-500",
      width: Math.min(stats.shortlisted * 20, 100),
      icon: "⭐",
    },
    {
      title: "Selected",
      value: stats.selected,
      color: "bg-purple-500",
      width: Math.min(stats.selected * 25, 100),
      icon: "🎯",
    },
  ];

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        📈 Recruitment Overview
      </h2>

      <div className="space-y-6">
        {cards.map((card) => (
          <div key={card.title}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold dark:text-white">
                {card.icon} {card.title}
              </span>

              <span className="font-bold dark:text-white">
                {card.value}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`${card.color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${card.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSummary;