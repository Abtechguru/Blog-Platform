import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

export function CampaignPopup({ onOpenCampaign }: { onOpenCampaign?: () => void }) {
    const [isVisible, setIsVisible] = useState(false);
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        // Show after 10 seconds initially
        const initialTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10000);

        // Then show every minute
        const interval = setInterval(() => {
            setIsVisible(true);
            setMinimized(false); // Re-expand if minimized
        }, 60000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    if (!isVisible && !minimized) return null;

    if (minimized) {
        return (
            <div
                className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500 cursor-pointer"
                onClick={() => setMinimized(false)}
            >
                <div className="bg-[#1a365d] text-white p-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#2d4a7c] transition-colors border-2 border-[#d4af37]">
                    <span className="font-bold text-[#d4af37]">VOTE</span>
                    <ArrowRight className="h-4 w-4" />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-10 fade-in duration-500">
            <Card className="overflow-hidden shadow-2xl border-2 border-[#d4af37] relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 z-10 hover:bg-black/10 rounded-full"
                    onClick={() => {
                        setIsVisible(false);
                        setMinimized(true);
                    }}
                >
                    <X className="h-3 w-3" />
                </Button>

                <div className="p-0">
                    <div className="relative h-32 w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex flex-col justify-end p-4">
                            <Badge className="self-start bg-[#d4af37] text-[#1a365d] mb-1 text-xs">SPONSORED</Badge>
                            <h3 className="text-white font-bold text-lg leading-tight">David Ombugadu 2027</h3>
                        </div>
                        <img
                            src="/uploads/David.jpeg"
                            alt="Campaign"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop';
                            }}
                        />
                    </div>

                    <div className="p-4">
                        <p className="text-sm text-muted-foreground mb-3">
                            Join the movement to restore the mandate. Education, Healthcare, and Prosperity for all.
                        </p>
                        <Button
                            className="w-full bg-[#008000] hover:bg-[#006400] text-white"
                            onClick={() => {
                                if (onOpenCampaign) onOpenCampaign();
                                setIsVisible(false);
                            }}
                        >
                            View Campaign Details <ExternalLink className="ml-2 h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </Card>

        </div>
    );
}
