import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import React from "react";

interface NavbarProps {
  user: any;
  onLogout: () => void;
  logoComponent?: React.ReactNode;
  minimal?: boolean;
}

const Navbar = ({ user, onLogout, logoComponent, minimal }: NavbarProps) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          {logoComponent ? (
            logoComponent
          ) : (
            <button
              className="text-2xl font-bold text-gray-900 tracking-tight focus:outline-none hover:text-blue-600 transition-colors"
              onClick={() => window.location.reload()}
              style={{ background: "none", border: "none", cursor: "pointer" }}
              aria-label="Refresh UrbanDrive"
            >
              UrbanDrive
            </button>
          )}
        </div>
        {!minimal && (
          <>
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/cars"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
              >
                Browse Cars
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
              </Link>
              {/* Show Dashboard link only for logged in user (not admin) */}
              {user && user.role === 'user' && (
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
                >
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                </Link>
              )}
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </header>
);

export default Navbar;
