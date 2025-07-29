export default function NavDashboard() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Dashboard</div>
        <div className="space-x-4">
          <a href="/dashboard/students" className="text-gray-300 hover:text-white">
            Students
          </a>
          <a href="/dashboard/teachers" className="text-gray-300 hover:text-white">
            Teachers
          </a>
          <a href="/dashboard/classes" className="text-gray-300 hover:text-white">
            Classes
          </a>
          <a href="/dashboard/attendance" className="text-gray-300 hover:text-white">
            Attendance
          </a>
          <a href="/dashboard/violations" className="text-gray-300 hover:text-white">
            Violations
          </a>
          <a href="/dashboard/payments" className="text-gray-300 hover:text-white">
            Payments
          </a>
          <a href="/dashboard/academic-years" className="text-gray-300 hover:text-white">
            Academic Years
          </a>
          <a href="/dashboard/majors" className="text-gray-300 hover:text-white">
            Majors
          </a>
          <a href="/dashboard/users" className="text-gray-300 hover:text-white">
            Users
          </a>
        </div>
      </div>
    </nav>
  );
}
