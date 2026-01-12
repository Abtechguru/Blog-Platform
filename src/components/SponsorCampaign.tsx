import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Users, 
  Calendar, 
  Heart, 
  Share2, 
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';

export function SponsorCampaign() {
  const [supporters, setSupporters] = useState(15842);
  const [donations, setDonations] = useState(65234000);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate entry
    setTimeout(() => setIsVisible(true), 100);

    // Update counters periodically
    const interval = setInterval(() => {
      setSupporters(prev => prev + Math.floor(Math.random() * 3));
      setDonations(prev => prev + Math.floor(Math.random() * 5000));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const manifesto = [
    { icon: TrendingUp, title: 'Economic Revival', desc: '50,000 new jobs in first term' },
    { icon: Award, title: 'Education Reform', desc: 'Free education up to secondary level' },
    { icon: Heart, title: 'Healthcare', desc: 'Free healthcare for children & elderly' },
  ];

  return (
    <section className={`relative py-20 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#008000]/5 via-transparent to-[#FFD700]/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#008000]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Sponsor Label */}
        <div className="text-center mb-8">
          <Badge className="bg-[#d4af37] text-[#1a365d] px-6 py-2 text-sm font-bold mb-4">
            FEATURED CAMPAIGN SPONSOR
          </Badge>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden border-2 border-[#008000]/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Column - Campaign Info */}
              <div className="bg-gradient-to-br from-[#008000] to-[#006400] text-white p-8 md:p-12 relative overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-white rounded-full -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 border-[30px] border-white rounded-full -ml-24 -mb-24" />
                </div>

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#FFD700] text-[#006400] px-4 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
                    <Target className="h-4 w-4" />
                    THE PEOPLE'S MANDATE
                  </div>

                  {/* Title */}
                  <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    DAVID <span className="text-[#FFD700]">OMBUGADU</span>
                  </h2>

                  <div className="space-y-3 mb-8">
                    <p className="text-xl font-semibold text-[#FFD700]">
                      Nasarawa State Governorship 2027
                    </p>
                    <p className="text-white/90 text-lg">
                      Former Member, House of Representatives
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-3xl font-black text-[#FFD700] mb-1">8</div>
                      <div className="text-sm text-white/80">Years in Legislature</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-3xl font-black text-[#FFD700] mb-1">47</div>
                      <div className="text-sm text-white/80">Bills Sponsored</div>
                    </div>
                  </div>

                  {/* Live Stats */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-[#FFD700]" />
                        <span className="text-sm font-medium">Supporters</span>
                      </div>
                      <span className="text-xl font-black text-[#FFD700]">
                        {supporters.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-[#FFD700]" />
                        <span className="text-sm font-medium">Campaign Fund</span>
                      </div>
                      <span className="text-xl font-black text-[#FFD700]">
                        ₦{(donations / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-[#FFD700] text-[#006400] hover:bg-[#FFD700]/90 font-bold flex-1"
                      onClick={() => window.open('https://davidombugadu2027.com', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Campaign Site
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-[#008000] flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Manifesto & Image */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                {/* Candidate Image */}
                <div className="mb-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#008000]/20 to-[#FFD700]/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
                  <img 
                    src="https://images.unsplash.com/photo-1551135049-8a33b2f2cc1b?w=600&h=400&fit=crop"
                    alt="David Ombugadu"
                    className="relative rounded-2xl w-full h-64 object-cover shadow-xl"
                  />
                  <div className="absolute bottom-4 right-4 bg-[#FFD700] text-[#006400] px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    <Award className="inline h-4 w-4 mr-1" />
                    People's Choice
                  </div>
                </div>

                {/* Manifesto Highlights */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#008000] mb-4">
                    2027 Manifesto Highlights
                  </h3>
                  
                  {manifesto.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:border-[#008000]/30"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#008000] to-[#006400] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <item.icon className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-[#FFD700] flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-r from-[#008000]/10 to-[#FFD700]/10 rounded-lg p-6 border border-[#008000]/20">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-6 w-6 text-[#008000] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                        Restoring the Mandate
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Join the movement to restore the people's mandate in Nasarawa State. 
                        Together, we can build a future of prosperity, education, and healthcare for all.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 text-center italic">
                  Sponsored Political Campaign • VERITUS INTERNATIONAL Premium Partner
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            VERITUS INTERNATIONAL proudly supports democratic participation and informed civic engagement
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-[#008000] text-[#008000]">
              Premium Campaign Partner
            </Badge>
            <Badge variant="outline" className="border-[#d4af37] text-[#d4af37]">
              Featured Through 2027
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
