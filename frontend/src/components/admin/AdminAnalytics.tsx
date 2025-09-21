import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Car, Users } from "lucide-react";
import { carsAPI, bookingsAPI, usersAPI } from "@/services/api";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlyRevenue: [],
    carUtilization: [],
    bookingTrends: [],
    topCars: [],
    userGrowth: [],
    categoryDistribution: []
  });

  useEffect(() => {
    async function fetchAndGenerateAnalytics() {
      const [cars, bookings, users] = await Promise.all([
        carsAPI.getAll(),
        bookingsAPI.getAll(),
        usersAPI.getAll()
      ]);

      // Monthly Revenue
      const monthlyRevenue = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        const monthBookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt || booking.bookingDate);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        });
        const revenue = monthBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        monthlyRevenue.push({ month, revenue, bookings: monthBookings.length });
      }

      // Car Utilization
      const carUtilization = cars.map(car => {
        const carBookings = bookings.filter(b => {
          if (!b.carId) return false;
          if (typeof b.carId === 'object' && b.carId._id) {
            return b.carId._id === car._id && b.status === "confirmed";
          }
          return b.carId === car._id && b.status === "confirmed";
        });
        const utilizationRate = car.quantity > 0 ? ((car.quantity - car.available) / car.quantity) * 100 : 0;
        return {
          name: car.name,
          utilization: Math.round(utilizationRate),
          bookings: carBookings.length,
          revenue: carBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        };
      });

      // Top Cars by Revenue
      const topCars = carUtilization
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Booking Trends (last 30 days)
      const bookingTrends = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayBookings = bookings.filter(booking => {
          const bookingDate = new Date(booking.createdAt || booking.bookingDate);
          return bookingDate.toDateString() === date.toDateString();
        });
        bookingTrends.push({
          date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
          bookings: dayBookings.length
        });
      }

      // User Growth
      const userGrowth = [];
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const month = date.toLocaleString('default', { month: 'short' });
        const monthUsers = users.filter(user => {
          const joinDate = new Date(user.joinDate);
          return joinDate.getMonth() === date.getMonth() && 
                 joinDate.getFullYear() === date.getFullYear();
        });
        userGrowth.push({ month, users: monthUsers.length });
      }

      // Category Distribution
      const categoryDistribution = cars.reduce((acc, car) => {
        const existing = acc.find(item => item.name === car.category);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: car.category, value: 1 });
        }
        return acc;
      }, []);

      setAnalytics({
        monthlyRevenue,
        carUtilization,
        bookingTrends,
        topCars,
        userGrowth,
        categoryDistribution
      });
    }
    fetchAndGenerateAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const currentMonth = analytics.monthlyRevenue[analytics.monthlyRevenue.length - 1];
  const lastMonth = analytics.monthlyRevenue[analytics.monthlyRevenue.length - 2];
  const revenueGrowth = lastMonth ? ((currentMonth?.revenue - lastMonth.revenue) / lastMonth.revenue * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <span className="h-4 w-4 text-muted-foreground font-bold text-xl">₹</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentMonth?.revenue || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              {Math.abs(revenueGrowth).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Utilization</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.carUtilization.length > 0 
                ? Math.round(analytics.carUtilization.reduce((sum, car) => sum + car.utilization, 0) / analytics.carUtilization.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Fleet utilization rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth?.bookings || 0}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.topCars[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Top Selling Car
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Booking Trends</CardTitle>
            <CardDescription>Bookings over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#FFBB28" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Category Distribution</CardTitle>
            <CardDescription>Distribution of car categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Cars */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Cars</CardTitle>
            <CardDescription>Cars ranked by revenue generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCars.map((car, index) => (
                <div key={car.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div>
                      <p className="font-semibold">{car.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
