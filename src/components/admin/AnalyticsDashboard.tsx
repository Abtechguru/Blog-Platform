import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Target, MousePointer, Users, TrendingUp } from 'lucide-react';

const campaignData = [
    { day: 'Mon', impressions: 4000, clicks: 240 },
    { day: 'Tue', impressions: 3000, clicks: 139 },
    { day: 'Wed', impressions: 2000, clicks: 980 },
    { day: 'Thu', impressions: 2780, clicks: 390 },
    { day: 'Fri', impressions: 1890, clicks: 480 },
    { day: 'Sat', impressions: 2390, clicks: 380 },
    { day: 'Sun', impressions: 3490, clicks: 430 },
];

const newsReadershipData = [
    { category: 'Politics', readers: 4000 },
    { category: 'Business', readers: 3000 },
    { category: 'Tech', readers: 2000 },
    { category: 'Sports', readers: 2780 },
    { category: 'Entertainment', readers: 1890 },
];

export function AnalyticsDashboard() {
    return (
        <div className="space-y-8">
            <h1 className="font-['Playfair_Display'] text-3xl font-bold">Analytics & Performance</h1>

            {/* Campaign Performance Section */}
            <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Campaign Performance (David Ombugadu 2027)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Impressions</p>
                                <h3 className="text-2xl font-bold">128.4k</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-700 rounded-full">
                                <MousePointer className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Clicks</p>
                                <h3 className="text-2xl font-bold">14.2k</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 text-yellow-700 rounded-full">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">CTR</p>
                                <h3 className="text-2xl font-bold">11.05%</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="p-6">
                    <CardHeader>
                        <CardTitle>Campaign Engagement Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={campaignData}>
                                <defs>
                                    <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="impressions" stroke="#8884d8" fillOpacity={1} fill="url(#colorImp)" />
                                <Area type="monotone" dataKey="clicks" stroke="#82ca9d" fillOpacity={1} fill="url(#colorClick)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </section>

            {/* News Readership Section */}
            <section>
                <h2 className="text-xl font-bold mb-4">News Readership by Category</h2>
                <Card className="p-6">
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={newsReadershipData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="category" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="readers" fill="#1a365d" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
