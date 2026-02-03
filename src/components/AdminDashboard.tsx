import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AnalyticsDashboard } from './admin/AnalyticsDashboard';
import { UserManagementDashboard } from './admin/UserManagementDashboard';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  Settings,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Plus,
  Search,
  Bell,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { dashboardStats, trafficData, categoryData, recentActivity, articles } from '../lib/mock-data';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AdminDashboardProps {
  onNewArticle: () => void;
}

export function AdminDashboard({ onNewArticle }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, change, icon: Icon }: any) => {
    const isPositive = change >= 0;
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${title === 'Total Views' ? 'bg-blue-500/10 text-blue-500' :
            title === 'Articles' ? 'bg-green-500/10 text-green-500' :
              title === 'Active Users' ? 'bg-purple-500/10 text-purple-500' :
                'bg-amber-500/10 text-amber-500'
            }`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant={isPositive ? 'default' : 'destructive'} className="gap-1">
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(change)}%
          </Badge>
        </div>
        <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
        <p className="text-3xl font-bold">{value.toLocaleString()}</p>
      </Card>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1a365d] to-[#3b82f6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h2 className="font-['Playfair_Display'] text-lg font-bold">VERITUS</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
              </Button>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
                  alt="Admin"
                  className="w-10 h-10 rounded-full border-2 border-primary/20"
                />
                <div className="text-sm">
                  <p className="font-semibold">Admin User</p>
                  <p className="text-muted-foreground">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-2">Dashboard Overview</h1>
                  <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={onNewArticle}>
                    <Sparkles className="h-4 w-4" />
                    AI Assistant
                  </Button>
                  <Button className="bg-[#1a365d] hover:bg-[#2d4a7c]" onClick={onNewArticle}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Views"
                  value={dashboardStats.totalViews}
                  change={dashboardStats.viewsChange}
                  icon={Eye}
                />
                <StatCard
                  title="Articles"
                  value={dashboardStats.totalArticles}
                  change={dashboardStats.articlesChange}
                  icon={FileText}
                />
                <StatCard
                  title="Active Users"
                  value={dashboardStats.totalUsers}
                  change={dashboardStats.usersChange}
                  icon={Users}
                />
                <StatCard
                  title="Revenue"
                  value={`$${(dashboardStats.revenue / 1000).toFixed(1)}k`}
                  change={dashboardStats.revenueChange}
                  icon={DollarSign}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Chart */}
                <Card className="col-span-2 p-6">
                  <h3 className="font-semibold text-lg mb-6">Traffic Overview</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
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
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#1a365d"
                        strokeWidth={2}
                        name="Page Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#d4af37"
                        strokeWidth={2}
                        name="Unique Users"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Category Distribution */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Content by Category</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Recent Articles & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Articles Table */}
                <Card className="col-span-2 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Recent Articles</h3>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {articles.slice(0, 5).map((article) => (
                        <TableRow key={article.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {article.title}
                          </TableCell>
                          <TableCell>{article.author.name}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Published
                            </Badge>
                          </TableCell>
                          <TableCell>{article.views.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>

                {/* Activity Feed */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'article' ? 'bg-blue-500/10 text-blue-500' :
                          activity.type === 'comment' ? 'bg-green-500/10 text-green-500' :
                            activity.type === 'user' ? 'bg-purple-500/10 text-purple-500' :
                              'bg-pink-500/10 text-pink-500'
                          }`}>
                          {activity.type === 'article' ? <FileText className="h-4 w-4" /> :
                            activity.type === 'comment' ? <Edit className="h-4 w-4" /> :
                              activity.type === 'user' ? <Users className="h-4 w-4" /> :
                                <TrendingUp className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-semibold">{activity.user}</span>
                            {' '}{activity.action}{' '}
                            {activity.title && <span className="text-muted-foreground">{activity.title}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2" onClick={onNewArticle}>
                    <Plus className="h-6 w-6" />
                    <span>New Article</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>View Reports</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex-col gap-2">
                    <Settings className="h-6 w-6" />
                    <span>Settings</span>
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="font-['Playfair_Display'] text-3xl font-bold">All Articles</h1>
                <Button className="bg-[#1a365d] hover:bg-[#2d4a7c]" onClick={onNewArticle}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Article
                </Button>
              </div>

              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-md">
                          <div className="flex items-center gap-3">
                            <img src={article.image} alt="" className="w-12 h-12 rounded object-cover" />
                            <span className="truncate">{article.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{article.category}</Badge>
                        </TableCell>
                        <TableCell>{article.author.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(article.publishDate).toLocaleDateString()}</TableCell>
                        <TableCell>{article.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={onNewArticle}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsDashboard />}

          {activeTab === 'users' && <UserManagementDashboard />}

          {activeTab === 'settings' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h3>
                <p className="text-muted-foreground">
                  This section is under construction
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}