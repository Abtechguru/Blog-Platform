import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Users, 
  Heart, 
  Share2, 
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Home
} from 'lucide-react';

export function SponsorAmbode() {
  const [supporters, setSupporters] = useState(12543);
  const [donations, setDonations] = useState(48765000);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate entry
    setTimeout(() => setIsVisible(true), 200);

    // Update counters periodically
    const interval = setInterval(() => {
      setSupporters(prev => prev + Math.floor(Math.random() * 3));
      setDonations(prev => prev + Math.floor(Math.random() * 5000));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const achievements = [
    { icon: TrendingUp, title: '181 Roads Built', desc: 'Massive infrastructure transformation' },
    { icon: Shield, title: 'Safety First', desc: '10,000 street lights & CCTV systems' },
    { icon: Award, title: '₦25B Jobs Fund', desc: 'Employment Trust Fund launched' },
  ];

  return (
    <section className={`relative py-20 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00509E]/5 via-transparent to-[#FFD700]/5" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#00509E]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Sponsor Label */}
        <div className="text-center mb-8">
          <Badge className="bg-[#d4af37] text-[#1a365d] px-6 py-2 text-sm font-bold mb-4">
            FEATURED CAMPAIGN SPONSOR
          </Badge>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden border-2 border-[#00509E]/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Column - Campaign Info */}
              <div className="bg-gradient-to-br from-[#00509E] to-[#003366] text-white p-8 md:p-12 relative overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-white rounded-full -ml-32 -mt-32" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 border-[30px] border-white rounded-full -mr-24 -mb-24" />
                </div>

                <div className="relative z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-[#FFD700] text-[#003366] px-4 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
                    <Award className="h-4 w-4" />
                    THE RETURN OF EXCELLENCE
                  </div>

                  {/* Title */}
                  <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    HIS EXCELLENCY <span className="text-[#FFD700]">AKINWUNMI AMBODE</span>
                  </h2>

                  <div className="space-y-3 mb-8">
                    <p className="text-xl font-semibold text-[#FFD700]">
                      Lagos State Governorship 2027
                    </p>
                    <p className="text-white/90 text-lg">
                      Former Governor of Lagos State
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-3xl font-black text-[#FFD700] mb-1">181</div>
                      <div className="text-xs text-white/80">Roads Built</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-3xl font-black text-[#FFD700] mb-1">1047</div>
                      <div className="text-xs text-white/80">Classrooms</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-3xl font-black text-[#FFD700] mb-1">500K+</div>
                      <div className="text-xs text-white/80">Jobs</div>
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
                      className="bg-[#FFD700] text-[#003366] hover:bg-[#FFD700]/90 font-bold flex-1"
                      onClick={() => window.open('https://akinwunmiambode.com/', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-[#00509E] flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Achievements & Vision */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                {/* Candidate Image */}
                <div className="mb-8 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00509E]/20 to-[#FFD700]/20 rounded-2xl transform group-hover:scale-105 transition-transform duration-500" />
                  <img 
                    src="/uploads/Akinwunmi-Ambode.jpg"
                    alt="His Excellency Akinwunmi Ambode"
                    className="relative rounded-2xl w-full h-64 object-cover shadow-xl"
                  />
                  <div className="absolute bottom-4 right-4 bg-[#FFD700] text-[#003366] px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    <Award className="inline h-4 w-4 mr-1" />
                    Excellence
                  </div>
                </div>

                {/* Achievement Highlights */}
                <div className="space-y-4 mb-8">
                  <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#00509E] mb-4">
                    Transformative Legacy
                  </h3>
                  
                  {achievements.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group hover:border-[#00509E]/30"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00509E] to-[#003366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
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

                {/* Vision 2027 */}
                <div className="bg-gradient-to-r from-[#00509E]/10 to-[#FFD700]/10 rounded-lg p-6 border border-[#00509E]/20">
                  <div className="flex items-start gap-3">
                    <Zap className="h-6 w-6 text-[#00509E] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Lagos 2.0 - The Future
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        Smart Lagos, Housing Revolution, 1M new jobs, Education Reform, and Africa's first carbon-neutral megacity.
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        "Restoring excellence, accountability, and transformative leadership"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sponsor Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    <span className="font-semibold">Sponsored by:</span> Lanrewaju Lawal (Odo-Ayan Movement)
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            VERITUS INTERNATIONAL supports informed civic engagement and democratic participation
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="border-[#00509E] text-[#00509E]">
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
