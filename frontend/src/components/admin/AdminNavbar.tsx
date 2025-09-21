import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AdminNavbar = ({ admin }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="text-2xl font-bold text-gray-900 tracking-tight focus:outline-none hover:text-blue-600 transition-colors"
              onClick={() => navigate("/admin/dashboard")}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-label="Admin Dashboard"
            >
              Admin Panel
            </button>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/admin/cars"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Cars
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/admin/bookings"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Bookings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/admin/users"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Users
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/admin/analytics"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Analytics
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {admin ? (
              <>
                <span className="font-medium text-gray-700">{admin.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
