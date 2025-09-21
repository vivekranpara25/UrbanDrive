"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Star, Search, Car, Fuel, Settings, Clock, Shield, Award } from "lucide-react"

const Index = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  })
  const navigate = useNavigate()
  const [featuredCars, setFeaturedCars] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  useEffect(() => {
    async function fetchFeaturedCars() {
      try {
        const cars = await import("@/services/api").then((mod) => mod.carsAPI.getAll())
        const sorted = cars.sort((a, b) => b.createdAt || b._id.localeCompare(a.createdAt || a._id)).slice(0, 6)
        setFeaturedCars(sorted)
      } catch (err) {
        setFeaturedCars([
          {
            id: 1,
            name: "Tesla Model 3",
            category: "electric",
            pricePerHour: 150,
            rating: 4.9,
            seats: 5,
            transmission: "Auto",
            fuel: "Electric",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 2,
            name: "BMW 3 Series",
            category: "luxury",
            pricePerHour: 200,
            rating: 4.8,
            seats: 5,
            transmission: "Auto",
            fuel: "Petrol",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 3,
            name: "Audi A4",
            category: "luxury",
            pricePerHour: 180,
            rating: 4.7,
            seats: 5,
            transmission: "Auto",
            fuel: "Petrol",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 4,
            name: "Honda Civic",
            category: "economy",
            pricePerHour: 80,
            rating: 4.6,
            seats: 5,
            transmission: "Manual",
            fuel: "Petrol",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 5,
            name: "Mercedes C-Class",
            category: "luxury",
            pricePerHour: 250,
            rating: 4.9,
            seats: 5,
            transmission: "Auto",
            fuel: "Petrol",
            image: "/placeholder.svg?height=300&width=400",
          },
          {
            id: 6,
            name: "Toyota Prius",
            category: "hybrid",
            pricePerHour: 120,
            rating: 4.5,
            seats: 5,
            transmission: "Auto",
            fuel: "Hybrid",
            image: "/placeholder.svg?height=300&width=400",
          },
        ])
      }
    }
    fetchFeaturedCars()
  }, [])

  const handleBrowseCars = () => {
    if (user) {
      navigate("/cars")
    } else {
      navigate("/login")
    }
  }

  const categories = [
    { id: "all", name: "All Cars", count: featuredCars.length },
    { id: "luxury", name: "Luxury", count: featuredCars.filter((car) => car.category === "luxury").length },
    { id: "electric", name: "Electric", count: featuredCars.filter((car) => car.category === "electric").length },
    { id: "hybrid", name: "Hybrid", count: featuredCars.filter((car) => car.category === "hybrid").length },
    { id: "economy", name: "Economy", count: featuredCars.filter((car) => car.category === "economy").length },
  ]

  const filteredCars = featuredCars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || car.category === selectedCategory
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && car.pricePerHour < 100) ||
      (priceRange === "medium" && car.pricePerHour >= 100 && car.pricePerHour < 200) ||
      (priceRange === "high" && car.pricePerHour >= 200)

    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="text-2xl font-bold text-gray-900 tracking-tight focus:outline-none hover:text-blue-600 transition-colors"
                onClick={() => window.location.reload()}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-label="Refresh UrbanDrive"
              >
                UrbanDrive
              </button>
            </div>

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
              {user && user.role !== 'admin' ? (
                <>
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
                    onClick={() => {
                      localStorage.removeItem("user")
                      window.location.reload()
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <a href="/login">
                    <Button variant="ghost" size="sm" className="rounded-full">
                      Login
                    </Button>
                  </a>
                  <a href="/register">
                    <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Car className="w-4 h-4 mr-2" />
            Premium Car Rental Service
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="text-blue-600"> Ride</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Choose from our curated collection of premium vehicles. Transparent pricing, instant booking, and
            exceptional service.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={handleBrowseCars}
            >
              Browse Cars
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 rounded-full border-gray-300 hover:border-gray-400 bg-transparent"
              onClick={() => navigate("/")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium service and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Premium Fleet",
                description: "Carefully maintained vehicles from trusted brands with full insurance coverage",
                color: "blue",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock customer service with instant assistance whenever you need",
                color: "green",
              },
              {
                icon: Award,
                title: "Best Rates",
                description: "Competitive pricing with transparent fees and no hidden charges",
                color: "purple",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 group-hover:scale-110 transition-transform ${
                    feature.title === "24/7 Support"
                      ? "bg-green-50"
                      : feature.title === "Premium Fleet"
                      ? "bg-blue-50"
                      : feature.title === "Best Rates"
                      ? "bg-purple-50"
                      : "bg-gray-50"
                  }`}
                >
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Section with Sidebar */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Fleet</h2>
            <p className="text-gray-600">Discover our collection of premium vehicles</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sticky Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Search */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search cars..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-full border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </Card>

                {/* Categories */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          {category.count}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Price Range */}
                <Card className="p-6 border-0 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { id: "all", name: "All Prices", range: "" },
                      { id: "low", name: "Under ₹100", range: "/hour" },
                      { id: "medium", name: "₹100 - ₹200", range: "/hour" },
                      { id: "high", name: "Above ₹200", range: "/hour" },
                    ].map((price) => (
                      <button
                        key={price.id}
                        onClick={() => setPriceRange(price.id)}
                        className={`w-full flex items-center p-3 rounded-xl text-left transition-colors ${
                          priceRange === price.id
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <span className="font-medium">{price.name}</span>
                        <span className="text-sm text-gray-500 ml-1">{price.range}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Cars Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredCars.map((car) => (
                  <Card
                    key={car._id || car.id}
                    className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-gray-100 flex items-center justify-center">
                      <img
                        src={
                          car.image
                            ? car.image.startsWith("/images/")
                              ? `http://localhost:5000${car.image}`
                              : car.image
                            : "/placeholder.svg?height=300&width=400"
                        }
                        alt={car.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
                      />
                    </div>

                    <CardHeader className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {car.name}
                        </CardTitle>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {car.seats} seats
                        </span>
                        <span className="flex items-center">
                          <Settings className="w-4 h-4 mr-1" />
                          {car.transmission}
                        </span>
                        <span className="flex items-center">
                          <Fuel className="w-4 h-4 mr-1" />
                          {car.fuel}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">₹{car.pricePerHour}</span>
                          <span className="text-gray-500 ml-1">/hour</span>
                        </div>
                        <Link to="/login">
                          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-1 text-sm">Rent Now</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCars.length === 0 && (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600">© 2025 UrbanDrive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Index
