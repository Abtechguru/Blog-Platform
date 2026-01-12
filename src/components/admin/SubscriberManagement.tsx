import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
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
  Search,
  Download,
  Mail,
  Trash2,
  Users,
  TrendingUp,
  UserCheck,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { newsletterAPI, Newsletter } from '../../lib/supabase-client';

export function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState<Newsletter[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Newsletter[]>([]);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0 });

  useEffect(() => {
    loadSubscribers();
    loadStats();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchQuery, filterStatus]);

  const loadSubscribers = async () => {
    try {
      setIsLoading(true);
      const data = await newsletterAPI.getAll();
      setSubscribers(data || []);
    } catch (error) {
      console.error('Failed to load subscribers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await newsletterAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const filterSubscribers = () => {
    let filtered = [...subscribers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus === 'active') {
      filtered = filtered.filter(sub => sub.is_active);
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter(sub => !sub.is_active);
    }

    setFilteredSubscribers(filtered);
  };

  const toggleSelection = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Subscribed At', 'Status'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.is_active ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-2">
          Newsletter Subscribers
        </h1>
        <p className="text-muted-foreground">
          Manage your email subscribers and send campaigns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              All Time
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Total Subscribers
          </h3>
          <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Active Subscribers
          </h3>
          <p className="text-3xl font-bold">{stats.active.toLocaleString()}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <UserX className="h-6 w-6 text-red-500" />
            </div>
            <Badge variant="secondary">Unsubscribed</Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Inactive
          </h3>
          <p className="text-3xl font-bold">
            {(stats.total - stats.active).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscribers</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadSubscribers} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedSubscribers.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedSubscribers.length} subscriber{selectedSubscribers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubscribers([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No subscribers found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedSubscribers.length === filteredSubscribers.length}
                        onCheckedChange={(checked) => {
                          setSelectedSubscribers(
                            checked ? filteredSubscribers.map(s => s.id) : []
                          );
                        }}
                      />
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscribed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Preferences</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedSubscribers.includes(subscriber.id)}
                          onCheckedChange={() => toggleSelection(subscriber.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.subscribed_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {subscriber.is_active ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {subscriber.preferences?.weekly_digest && (
                            <Badge variant="outline" className="text-xs">
                              Weekly
                            </Badge>
                          )}
                          {subscriber.preferences?.article_updates && (
                            <Badge variant="outline" className="text-xs">
                              Updates
                            </Badge>
                          )}
                          {subscriber.preferences?.exclusive_content && (
                            <Badge variant="outline" className="text-xs">
                              Exclusive
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredSubscribers.length} of {subscribers.length} subscribers
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
