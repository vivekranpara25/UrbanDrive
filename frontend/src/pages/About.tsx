import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, Users, Star, Award, Car as CarIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

const About = () => {
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

      {/* About Us Heading */}
      <div className="py-6" />
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn more about UrbanDrive, our mission, and why we are the trusted choice for car rentals.
        </p>
      </div>

      <div className="container mx-auto px-4 py-8">
      {/* Removed About Car Rental heading and description */}

{/* How It Works Timeline */}
      <Card className="mb-8 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l-4 border-blue-200 ml-4">
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white"><CarIcon /></span>
              <h4 className="font-semibold text-blue-600 mb-1">Choose Your Car</h4>
              <p className="text-lg text-gray-700 mb-4">Browse and select from a wide range of vehicles for every occasion.</p>
            </li>
            <li className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white"><Clock /></span>
              <h4 className="font-semibold text-blue-600 mb-1">Book Instantly</h4>
              <p className="text-lg text-gray-700 mb-4">Reserve your car online in minutes with instant confirmation.</p>
            </li>
            <li className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white"><Users /></span>
              <h4 className="font-semibold text-blue-600 mb-1">Enjoy the Ride</h4>
              <p className="text-lg text-gray-700 mb-4">Pick up or get your car delivered, and hit the road with confidence!</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Why UrbanDrive? Section */}
      <Card className="mb-8 border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">Why UrbanDrive?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-red-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Award-Winning Service</h4>
                <p className="text-lg text-gray-700 mb-4">Recognized for excellence in customer satisfaction and innovation.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Safety First</h4>
                <p className="text-lg text-gray-700 mb-4">All vehicles are sanitized, serviced, and insured for your peace of mind.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-orange-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">24/7 Support</h4>
                <p className="text-lg text-gray-700 mb-4">Our team is always available to help, wherever you are.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="w-8 h-8 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-semibold text-lg">Transparent Pricing</h4>
                <p className="text-lg text-gray-700 mb-4">No hidden fees. What you see is what you pay.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      
      {/* Customer Testimonials Carousel */}
      <Card className="mb-8 border-0 shadow-md">
        
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">What Our Customers Say</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow">
              <p className="italic text-lg text-gray-700 mb-4">"UrbanDrive made my business trip so easy! The car was spotless and the process was seamless."</p>
              <span className="block mt-4 font-semibold text-blue-800">– Nilay</span>
            </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow">
              <p className="italic text-lg text-gray-700 mb-4">"Best rates and excellent customer support. Highly recommended for family vacations."</p>
              <span className="block mt-4 font-semibold text-blue-800">– Kushal</span>
            </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 shadow">
              <p className="italic text-lg text-gray-700 mb-4">"The doorstep delivery option saved me so much time. Will use again!"</p>
              <span className="block mt-4 font-semibold text-blue-800">– Jenil</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Award className="w-12 h-12 text-red-600 mb-4" />
            <CardTitle>Premium Fleet</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Choose from our extensive collection of well-maintained vehicles, from economy to luxury.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="w-12 h-12 text-green-600 mb-4" />
            <CardTitle>Safe & Secure</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              All our vehicles are regularly serviced and insured for your peace of mind.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="w-12 h-12 text-orange-600 mb-4" />
            <CardTitle>24/7 Support</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Our customer service team is available round the clock to assist you.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Users className="w-12 h-12 text-purple-600 mb-4" />
            <CardTitle>Professional Drivers</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Experienced and licensed drivers available for your convenience.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Star className="w-12 h-12 text-yellow-600 mb-4" />
            <CardTitle>Best Rates</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Competitive pricing with no hidden charges and flexible rental periods.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Award className="w-12 h-12 text-red-600 mb-4" />
            <CardTitle>Quality Service</CardTitle>
            <CardDescription className="text-lg text-gray-700 mb-4">
              Award-winning service recognized by industry experts and satisfied customers.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
        <div className="p-4">
          <h3 className="text-3xl font-bold text-blue-600">10+</h3>
          <p className="text-gray-600">Years Experience</p>
        </div>
        <div className="p-4">
          <h3 className="text-3xl font-bold text-blue-600">50+</h3>
          <p className="text-gray-600">Vehicle Models</p>
        </div>
        <div className="p-4">
          <h3 className="text-3xl font-bold text-blue-600">10k+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="p-4">
          <h3 className="text-3xl font-bold text-blue-600">24/7</h3>
          <p className="text-gray-600">Customer Support</p>
        </div>
      </div>
    {/* Footer */}
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-gray-600">© 2025 UrbanDrive. All rights reserved.</p>
      </div>
    </footer>
    </div>
  </div>
  );
};

export default About; 