import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Globe, RefreshCw, Clock, ExternalLink } from 'lucide-react';

interface NewsItem {
    id: string;
    source: string;
    title: string;
    summary: string;
    time: string;
    category: 'World' | 'Politics' | 'Tech' | 'Sports' | 'Business';
    imageUrl?: string;
    url: string;
}

const internationalNews: NewsItem[] = [
    {
        id: '1',
        source: 'Al Jazeera',
        title: 'Hamas calls for global rallies against Israel\'s "aggression"',
        summary: 'Group urges international support as conflict in Gaza intensifies, with UN warning of deepening humanitarian crisis.',
        time: '1 hour ago',
        category: 'World',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop'
    },
    {
        id: '2',
        source: 'Reuters',
        title: 'US shoots down Iranian drone in Arabian Sea',
        summary: 'Military officials confirm interception as tensions rise in the Middle East region.',
        time: '2 hours ago',
        category: 'World',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1587502537734-67bb49b46f50?w=500&h=300&fit=crop'
    },
    {
        id: '3',
        source: 'BBC News',
        title: 'Record-breaking snow kills 30 in Japan',
        summary: 'Unprecedented snowfall causes chaos across northern regions, disrupting transport and power.',
        time: '3 hours ago',
        category: 'World',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1548266652-99cf27701ced?w=500&h=300&fit=crop'
    },
    {
        id: '4',
        source: 'Financial Times',
        title: 'Trump and Modi announce new trade deal',
        summary: 'Leaders agree on framework to boost economic cooperation between US and India.',
        time: '4 hours ago',
        category: 'Business',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=500&h=300&fit=crop'
    },
    {
        id: '5',
        source: 'TechCrunch',
        title: 'Elon Musk summoned in French cybercrime probe',
        summary: 'X offices in Paris raided as authorities investigate potential digital violations.',
        time: '5 hours ago',
        category: 'Tech',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&h=300&fit=crop'
    }
];

const localNews: NewsItem[] = [
    {
        id: 'l1',
        source: 'Local News',
        title: 'Lagos State Government Announces New Edu-Tech Initiative',
        summary: 'Governor promises tablets for all secondary school students by 2026.',
        time: '30 mins ago',
        category: 'Politics',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&h=300&fit=crop'
    },
    {
        id: 'l2',
        source: 'Business Day',
        title: 'Naira stabilizes against Dollar in parallel market',
        summary: 'Currency sees slight gain as CBN introduces new forex policies.',
        time: '2 hours ago',
        category: 'Business',
        url: '#',
        imageUrl: 'https://images.unsplash.com/photo-1621981386071-45d08ed4a17c?w=500&h=300&fit=crop'
    }
];

export function NewsFeed() {
    const [activeTab, setActiveTab] = useState('international');
    const [isLoading, setIsLoading] = useState(false);

    const handleRefresh = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000); // Simulate refresh
    };

    const getNews = () => activeTab === 'international' ? internationalNews : localNews;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-bold font-['Playfair_Display']">Live News Feed</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <Tabs defaultValue="international" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="international">International</TabsTrigger>
                    <TabsTrigger value="local">Local</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4 space-y-4">
                    {getNews().map((news) => (
                        <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                            <div className="flex flex-col sm:flex-row h-full">
                                <div className="sm:w-40 sm:h-auto h-48 relative overflow-hidden">
                                    {news.imageUrl ? (
                                        <img
                                            src={news.imageUrl}
                                            alt={news.title}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <Globe className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white hover:bg-black/70">
                                        {news.category}
                                    </Badge>
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-primary">{news.source}</span>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {news.time}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {news.summary}
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                                            Read more <ExternalLink className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
