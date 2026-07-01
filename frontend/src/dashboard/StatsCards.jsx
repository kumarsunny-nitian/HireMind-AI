function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: "💼",
      color: "bg-blue-500",
      subtitle: "Jobs Posted",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: "📄",
      color: "bg-green-500",
      subtitle: "Applications Received",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: "⭐",
      color: "bg-yellow-500",
      subtitle: "Candidates",
    },
    {
      title: "Selected",
      value: stats.selected,
      icon: "🎯",
      color: "bg-purple-500",
      subtitle: "Final Hires",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.color} text-white rounded-2xl p-6 shadow-xl hover:scale-105 transition duration-300`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">
                {card.subtitle}
              </p>

              <h2 className="text-xl font-bold mt-2">
                {card.title}
              </h2>

              <h1 className="text-4xl font-bold mt-4">
                {card.value}
              </h1>
            </div>

            <div className="text-5xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;