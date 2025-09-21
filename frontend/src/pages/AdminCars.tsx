import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CarManagement from "@/components/admin/CarManagement";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminCars = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    totalCars: 0,
    activeBookings: 0,
    totalUsers: 0,
    lowStockCars: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const carsAPI = (await import("@/services/api")).carsAPI;
        const bookingsAPI = (await import("@/services/api")).bookingsAPI;
        const usersAPI = (await import("@/services/api")).usersAPI;
        const [cars, bookings, users] = await Promise.all([
          carsAPI.getAll(),
          bookingsAPI.getAll(),
          usersAPI.getAll()
        ]);
        const activeBookings = bookings.filter(b => b.status === "confirmed").length;
        const lowStockCars = cars.filter(c => c.quantity <= 2).length;
        const revenue = bookings.filter(b => b.status === "confirmed").reduce((sum, b) => sum + (b.totalAmount || 0), 0);
        setStats({
          totalCars: cars.length,
          activeBookings,
          totalUsers: users.length,
          lowStockCars,
          revenue
        });
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <AdminNavbar admin={user} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Cars</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalCars}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Bookings</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.activeBookings}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Low Stock</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-500">{stats.lowStockCars}</div></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">₹{stats.revenue}</div></CardContent></Card>
        </div>
        <CarManagement onStatsUpdate={() => {}} />
      </div>
    </div>
  );
};

export default AdminCars;
