
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle2, Calendar, MapPin, Globe, Facebook, Twitter, Instagram, Trophy, Heart } from 'lucide-react';
import { Progress } from './ui/progress';

interface CampaignPageProps {
    onBack: () => void;
}

export function CampaignPage({ onBack }: CampaignPageProps) {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/uploads/David.jpeg"
                        alt="David Ombugadu"
                        className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </div>

                <div className="absolute top-6 left-6 z-20">
                    <Button variant="ghost" className="text-white hover:bg-white/20" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10">
                    <div className="max-w-7xl mx-auto">
                        <Badge className="bg-[#d4af37] text-black mb-4 hover:bg-[#c49d2f]">
                            Official Campaign 2027
                        </Badge>
                        <h1 className="font-['Playfair_Display'] text-5xl md:text-7xl font-bold text-white mb-4">
                            David Ombugadu
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mb-8">
                            Restoring the People's Mandate. A vision for a prosperous, secure, and unified Nasarawa State.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="bg-[#008000] hover:bg-[#006400] text-white px-8">
                                Join the Movement
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8">
                                Download Manifesto
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Stats & Quick Info */}
                    <div className="space-y-6">
                        <Card className="shadow-xl border-t-4 border-t-[#d4af37]">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-[#d4af37]" />
                                    Campaign Progress
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Donation Goal</span>
                                            <span className="font-bold">₦100M</span>
                                        </div>
                                        <Progress value={65} className="h-2 mb-2" />
                                        <p className="text-xs text-muted-foreground text-right">₦65.2M Raised</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-[#008000]">15.8k</div>
                                            <div className="text-xs text-muted-foreground">Volunteers</div>
                                        </div>
                                        <div className="bg-muted/50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold text-[#008000]">42</div>
                                            <div className="text-xs text-muted-foreground">Rallies Held</div>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-[#d4af37] text-[#1a365d] hover:bg-[#c49d2f]">
                                        <Heart className="mr-2 h-4 w-4" />
                                        Donate Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-lg mb-4">Connect</h3>
                                <div className="flex justify-center gap-4">
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600">
                                        <Facebook className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-sky-500">
                                        <Twitter className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:text-pink-600">
                                        <Instagram className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Globe className="h-5 w-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Detailed Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Candidate Bio */}
                        <Card className="shadow-md">
                            <CardContent className="p-8">
                                <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-6 text-[#1a365d]">Meet David Ombugadu</h2>
                                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                                    <p className="mb-4">
                                        David Emmanuel Ombugadu represents a new generation of leadership for Nasarawa State.
                                        With a track record of integrity and service as a Member of the House of Representatives,
                                        he brings a vision of rapid development, transparency, and inclusive governance.
                                    </p>
                                    <p className="mb-4">
                                        Born in 1978, Ombugadu's journey from student activism to national legislative duties demonstrates
                                        his lifelong commitment to the welfare of his people. His tenure in the National Assembly was marked
                                        by impactful bills focused on education reform, healthcare access, and youth empowerment.
                                    </p>
                                    <blockquote className="border-l-4 border-[#008000] pl-4 italic text-foreground my-6">
                                        "We need leadership that listens, plans, and delivers. My pact with the people of Nasarawa is simple:
                                        A government that works for everyone, not just the privileged few."
                                    </blockquote>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Platform Points */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#008000]">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-[#008000]" />
                                        Economic Revival
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Attracting investment to our solid minerals sector and boosting agriculture through mechanized farming incentives.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#008000]">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-[#008000]" />
                                        Education First
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Complete renovation of public schools and digital literacy programs for 100,000 youths in the first year.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#008000]">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-[#008000]" />
                                        Healthcare Access
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Establishing primary healthcare centers in every ward and free maternal care for all residents.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#008000]">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-[#008000]" />
                                        Security
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Community policing initiatives and technology-driven surveillance to ensure safety for farmers and businesses.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Upcoming Events */}
                        <Card>
                            <CardContent className="p-8">
                                <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-6">Upcoming Rallies</h3>
                                <div className="space-y-4">
                                    {[
                                        { date: 'OCT 15', city: 'Lafia', venue: 'Lafia Township Stadium', time: '10:00 AM' },
                                        { date: 'OCT 22', city: 'Keffi', venue: 'Keffi Polo Club', time: '11:00 AM' },
                                        { date: 'NOV 05', city: 'Akwanga', venue: 'City Square', time: '09:00 AM' }
                                    ].map((event, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                                            <div className="flex-shrink-0 bg-[#1a365d] text-white p-3 rounded-lg text-center min-w-[70px]">
                                                <div className="text-xs font-bold opacity-80">{event.date.split(' ')[0]}</div>
                                                <div className="text-xl font-bold">{event.date.split(' ')[1]}</div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg">{event.city} Mega Rally</h4>
                                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.venue}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {event.time}</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm">RSVP</Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
