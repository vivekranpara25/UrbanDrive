import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bookingsAPI } from "@/services/api";

const BookingManagement = ({ onStatsUpdate }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getAll();
      setBookings(data);
    } catch (error) {
      toast({
        title: "Error loading bookings",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.carId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    if (dateFilter) {
      filtered = filtered.filter(booking => 
        booking.startDate === dateFilter
      );
    }
    
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await bookingsAPI.update(bookingId, { status: newStatus });
      await loadBookings();
      onStatsUpdate();
      
      toast({
        title: "Booking updated",
        description: `Booking status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating booking",
        description: error.message || "Failed to update booking status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", icon: Clock, label: "Pending" },
      confirmed: { variant: "default", icon: CheckCircle, label: "Confirmed" },
      completed: { variant: "default", icon: CheckCircle, label: "Completed" },
      cancelled: { variant: "destructive", icon: XCircle, label: "Cancelled" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const sendNotification = (bookingId, message) => {
    toast({
      title: "Notification sent",
      description: message,
    });
  };

  if (loading && bookings.length === 0) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <Badge variant="outline">{filteredBookings.length} bookings</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by car or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
            />
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                  {booking.carId?.image && (
                    <img 
                      src={booking.carId.image.startsWith('/images/') ? `http://localhost:5000${booking.carId.image}` : booking.carId.image}
                      alt={booking.carId.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{booking.carId?.name || 'Unknown Car'}</CardTitle>
                    <CardDescription>
                      Booking ID: {booking._id} | User: {booking.userId?.name} ({booking.userId?.email})
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(booking.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Rental Period</p>
                  <p className="font-semibold">
                    {booking.startDate} {booking.startTime} - {booking.endDate} {booking.endTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold text-green-600">₹{booking.totalAmount}</p>
                  {booking.needDriver && (
                    <p className="text-xs text-gray-500">Includes driver service</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-semibold">
                    {booking.createdAt && !isNaN(new Date(booking.createdAt).getTime())
                      ? (() => {
                          const d = new Date(booking.createdAt);
                          const day = String(d.getDate()).padStart(2, '0');
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const year = d.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                {booking.status === "pending" && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => updateBookingStatus(booking._id, "confirmed")}
                      disabled={loading}
                    >
                      Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updateBookingStatus(booking._id, "cancelled")}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => updateBookingStatus(booking._id, "completed")}
                      disabled={loading}
                    >
                      Mark Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => updateBookingStatus(booking._id, "cancelled")}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {/* Delete button removed as per request */}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match your current filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
