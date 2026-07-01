import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Post Job",
      icon: "➕",
      color: "bg-blue-500",
      path: "/jobs",
    },
    {
      title: "Applicants",
      icon: "👥",
      color: "bg-green-500",
      path: "/applicants",
    },
    {
      title: "Interviews",
      icon: "📅",
      color: "bg-yellow-500",
      path: "/interviews",
    },
    {
      title: "Analytics",
      icon: "📊",
      color: "bg-purple-500",
      path: "/dashboard",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className={`${action.color}
              text-white
              rounded-xl
              p-6
              hover:scale-105
              transition
              duration-300
              shadow-lg`}
          >
            <div className="text-4xl mb-3">
              {action.icon}
            </div>

            <p className="font-semibold">
              {action.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;