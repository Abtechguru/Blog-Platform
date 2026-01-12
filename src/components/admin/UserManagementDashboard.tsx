import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  User,
  Users,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  Ban,
  Mail,
  Shield,
  PenTool,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Activity,
  FileText,
  CreditCard,
  Lock,
  Eye,
  X,
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, CartesianGrid } from 'recharts';

interface UserData {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'contributor' | 'user';
  status: 'active' | 'suspended' | 'banned';
  registrationDate: string;
  lastActive: string;
  articlesPublished: number;
  engagementScore: number;
  subscriptionTier: 'free' | 'basic' | 'premium';
  totalSpent: number;
}

export function UserManagementDashboard() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const stats = {
    totalUsers: 25847,
    activeToday: 1234,
    newThisWeek: 342,
    subscribers: 5678,
    growthRate: 12,
  };

  const growthData = [
    { month: 'Jul', users: 18000, active: 8000 },
    { month: 'Aug', users: 19500, active: 9200 },
    { month: 'Sep', users: 21000, active: 10500 },
    { month: 'Oct', users: 22800, active: 11800 },
    { month: 'Nov', users: 24200, active: 12900 },
    { month: 'Dec', users: 25847, active: 14234 },
  ];

  const roleDistribution = [
    { name: 'Users', value: 21450, fill: '#3b82f6' },
    { name: 'Authors', value: 2876, fill: '#d4af37' },
    { name: 'Contributors', value: 1234, fill: '#10b981' },
    { name: 'Admins', value: 287, fill: '#8b5cf6' },
  ];

  const users: UserData[] = [
    {
      id: '1',
      avatar: '/uploads/Abiodun Lateef.JPG',
      name: 'Abiodun Lateef',
      email: 'Careernig24@gmail.com',
      role: 'author',
      status: 'active',
      registrationDate: '2024-01-15',
      lastActive: '2026-01-12T10:30:00',
      articlesPublished: 142,
      engagementScore: 95,
      subscriptionTier: 'premium',
      totalSpent: 240,
    },
    {
      id: '2',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      name: 'James Chen',
      email: 'james.chen@example.com',
      role: 'author',
      status: 'active',
      registrationDate: '2024-02-20',
      lastActive: '2026-01-12T09:15:00',
      articlesPublished: 98,
      engagementScore: 88,
      subscriptionTier: 'premium',
      totalSpent: 180,
    },
    {
      id: '3',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      role: 'contributor',
      status: 'active',
      registrationDate: '2024-03-10',
      lastActive: '2026-01-11T18:45:00',
      articlesPublished: 23,
      engagementScore: 76,
      subscriptionTier: 'basic',
      totalSpent: 60,
    },
    {
      id: '4',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      name: 'Marcus Thompson',
      email: 'marcus.t@example.com',
      role: 'user',
      status: 'active',
      registrationDate: '2024-05-22',
      lastActive: '2026-01-12T11:20:00',
      articlesPublished: 0,
      engagementScore: 45,
      subscriptionTier: 'free',
      totalSpent: 0,
    },
    {
      id: '5',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      role: 'admin',
      status: 'active',
      registrationDate: '2023-11-05',
      lastActive: '2026-01-12T12:00:00',
      articlesPublished: 45,
      engagementScore: 92,
      subscriptionTier: 'premium',
      totalSpent: 360,
    },
  ];

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { icon: Shield, label: 'Admin', color: 'bg-red-500' },
      author: { icon: PenTool, label: 'Author', color: 'bg-[#d4af37]' },
      contributor: { icon: Edit, label: 'Contributor', color: 'bg-green-500' },
      user: { icon: User, label: 'User', color: 'bg-blue-500' },
    };
    const badge = badges[role as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <Badge className={`${badge.color} text-white gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: 'Active', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
      suspended: { label: 'Suspended', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
      banned: { label: 'Banned', color: 'bg-red-500/10 text-red-700 dark:text-red-400' },
    };
    const badge = badges[status as keyof typeof badges];
    return <Badge className={badge.color}>{badge.label}</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage and monitor all registered users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <Badge className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {stats.growthRate}%
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-500" />
            </div>
            <Badge variant="secondary">Live</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Today</h3>
          <p className="text-3xl font-bold">{stats.activeToday.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-500" />
            </div>
            <Badge className="bg-purple-500">+23%</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">New This Week</h3>
          <p className="text-3xl font-bold">{stats.newThisWeek.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-amber-500" />
            </div>
            <Badge className="bg-amber-500">Active</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Subscribers</h3>
          <p className="text-3xl font-bold">{stats.subscribers.toLocaleString()}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-lg mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#1a365d" strokeWidth={2} name="Total Users" />
              <Line type="monotone" dataKey="active" stroke="#d4af37" strokeWidth={2} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">User Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Directory */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="contributor">Contributor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Change Role
                </Button>
                <Button variant="outline" size="sm">
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* User Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      onCheckedChange={(checked) => {
                        setSelectedUsers(checked ? filteredUsers.map(u => u.id) : []);
                      }}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </TableCell>
                    <TableCell onClick={() => {
                      setSelectedUser(user);
                      setShowUserPanel(true);
                    }}>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{new Date(user.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {new Date(user.lastActive).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={user.engagementScore} className="w-16 h-2" />
                        <span className="text-sm text-muted-foreground">{user.engagementScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setShowUserPanel(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setShowRoleChangeDialog(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* User Detail Panel */}
      {showUserPanel && selectedUser && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-card border-l border-border shadow-2xl z-50 animate-in slide-in-from-right duration-300">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl">User Details</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowUserPanel(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full border-4 border-primary/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedUser.email}</p>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <Tabs defaultValue="overview" className="p-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Joined:</span>
                        <span className="font-medium">
                          {new Date(selectedUser.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Active:</span>
                        <span className="font-medium">
                          {new Date(selectedUser.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Account Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verified</span>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2FA Enabled</span>
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Subscription</span>
                        <Badge>{selectedUser.subscriptionTier}</Badge>
                      </div>
                    </div>
                  </Card>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Edit className="h-4 w-4" />
                      Edit User Info
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Lock className="h-4 w-4" />
                      Reset Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 text-sm">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Published article</p>
                            <p className="text-muted-foreground text-xs">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-4 mt-4">
                  {selectedUser.role !== 'user' && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3">Content Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Articles Published:</span>
                          <span className="font-medium">{selectedUser.articlesPublished}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Views:</span>
                          <span className="font-medium">245.3K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg. Engagement:</span>
                          <span className="font-medium">{selectedUser.engagementScore}%</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="security" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3">Security Settings</h4>
                    <div className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Enable 2FA
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        View Login History
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Role Change Dialog */}
      <Dialog open={showRoleChangeDialog} onOpenChange={setShowRoleChangeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change role for: {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="mb-2 block">Current Role: {selectedUser && getRoleBadge(selectedUser.role)}</Label>
            </div>
            <div className="space-y-2">
              <Label>New Role:</Label>
              <Select defaultValue={selectedUser?.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="contributor">Contributor</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason (optional):</Label>
              <Input placeholder="Enter reason for role change..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleChangeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowRoleChangeDialog(false)}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
