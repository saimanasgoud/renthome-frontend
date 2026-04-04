export default function AdminDashboard() {
  return (
    <div className="p-6 mt-16">
      <h1 className="text-3xl font-bold text-red-600">
        Admin Panel 👑
      </h1>

      <p className="mt-4 text-lg">
        Welcome Admin Sai Manas Goud 🚀
      </p>

      <div className="mt-6 space-y-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          View All Users
        </button>

        <button className="px-4 py-2 bg-green-500 text-white rounded">
          View All Properties
        </button>

        <button className="px-4 py-2 bg-yellow-500 text-white rounded">
          Analytics
        </button>
      </div>
    </div>
  );
}