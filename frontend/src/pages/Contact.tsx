import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const Contact = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Reusable Navbar */}
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem('user');
          window.location.reload();
        }}
        logoComponent={
          <Link to="/" aria-label="Go to Home">
            <span className="text-2xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">UrbanDrive</span>
          </Link>
        }
      />
      {/* Padding below navbar */}
      <div className="py-6" />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? We're here to help. Get in touch with us through any of these channels.
          </p>
        </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Get in touch with us through any of these channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">Vivek@gamil.com</p>
                <p className="text-gray-600">Rishi@gamil.com</p>
                <p className="text-gray-600">Parthiv@gamil.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+91 9568878599</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">
                  
Rajkot-Morbi Road,<br />
                   Rajkot 360003 Gujarat, India
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
      </div>
    {/* Footer */}
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-gray-600">© 2025 UrbanDrive. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
};

export default Contact; 