import { useState, useEffect } from "react";

// Helper to format date as DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Search, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usersAPI, bookingsAPI } from "@/services/api";

const UserManagement = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const { toast } = useToast();

  const deleteUser = async (userId) => {
    try {
      setIsLoading(true);
      await usersAPI.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
      onStatsUpdate();
      toast({
        title: "User deleted",
        description: "User has been removed successfully.",
        variant: "destructive"
      });
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [usersRes, bookingsRes] = await Promise.all([
          usersAPI.getAll(),
          bookingsAPI.getAll()
        ]);
        setUsers(usersRes);
        setBookings(bookingsRes);
      } catch (error) {
        toast({
          title: "Error loading data",
          description: error.message || "Failed to load users or bookings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response);
    } catch (error) {
      toast({
        title: "Error loading users",
        description: error.message || "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newStatus = user.status === "active" ? "suspended" : "active";
      
      await usersAPI.update(userId, { status: newStatus });
      
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      );
      
      setUsers(updatedUsers);
      onStatsUpdate();
      
      toast({
        title: "User status updated",
        description: `${user.name} has been ${newStatus === "active" ? "activated" : "suspended"}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating user",
        description: error.message || "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  const sendNotificationToUser = (userId, message) => {
    const user = users.find(u => u.id === userId);
    toast({
      title: "Notification sent",
      description: `Message sent to ${user.name}: ${message}`,
    });
  };

  const getUserBookings = (userId) => {
    return bookings.filter(booking => {
      // booking.userId can be an object (populated) or string (id)
      if (!booking.userId) return false;
      if (typeof booking.userId === 'object' && booking.userId._id) {
        return booking.userId._id === userId;
      }
      return booking.userId === userId;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Badge variant="outline">{filteredUsers.filter(user => user.email !== "admin@urbandrive.com").length} users</Badge>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers
          .filter(user => user.email !== "admin@urbandrive.com")
          .map((user) => {
            const userBookings = getUserBookings(user._id);
            return (
              <Card key={user._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                    </div>
                    {user.status !== "active" && user.status !== "suspended" && (
                      <Badge variant="destructive">
                        {user.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-start space-y-3 border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone || "Not provided"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined: {formatDate(user.joinDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {userBookings.length} total bookings
                    </div>
                  </div>
                  {/* Only show buttons if not admin@urbandrive.com */}
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      size="sm"
                      className="bg-white text-red-600 border border-gray-300 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete user '${user.name}'? This action cannot be undone.`)) {
                          deleteUser(user._id);
                        }
                      }}
                    >
                      Delete
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {user.name}</p>
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                              <p><strong>Role:</strong> {user.role}</p>
                              <p><strong>Status:</strong> {user.status}</p>
                              <p><strong>Join Date:</strong> {formatDate(user.joinDate)}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        
        {filteredUsers.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">No users match your search criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
