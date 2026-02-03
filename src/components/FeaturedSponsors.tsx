import { SponsorCampaign } from './SponsorCampaign';
import { SponsorAmbode } from './SponsorAmbode';
import { Badge } from './ui/badge';
import { Megaphone, Star } from 'lucide-react';

export function FeaturedSponsors({ onViewCampaign }: { onViewCampaign?: () => void }) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#c49d2f] mb-6 shadow-lg">
            <Megaphone className="h-8 w-8 text-white" />
          </div>

          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#1a365d] via-[#d4af37] to-[#1a365d] bg-clip-text text-transparent">
            Featured Campaign Partners
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
            VERITUS INTERNATIONAL proudly supports democratic participation and civic engagement through our featured campaign partnerships.
            These sponsored campaigns represent the voices of change and transformation across Nigeria.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-[#1a365d] text-white px-6 py-2 text-sm">
              <Star className="h-3 w-3 mr-2 inline" />
              Premium Sponsors
            </Badge>
            <Badge variant="outline" className="border-[#d4af37] text-[#d4af37] px-6 py-2 text-sm">
              2027 Election Cycle
            </Badge>
            <Badge variant="outline" className="border-gray-400 text-gray-600 dark:text-gray-400 px-6 py-2 text-sm">
              Sponsored Content
            </Badge>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent max-w-md mx-auto" />
        </div>

        {/* Sponsors Grid */}
        <div className="space-y-12">
          {/* First Sponsor - Ambode 2027 */}
          <div className="animate-fadeIn">
            <SponsorAmbode />
          </div>

          {/* Divider */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-900 px-6 py-2 text-sm text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-800">
                Featured Campaign Partner
              </span>
            </div>
          </div>

          {/* Second Sponsor - Ombugadu 2027 */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <SponsorCampaign onViewCampaign={onViewCampaign} />
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="font-semibold">Editorial Independence Notice:</span> Sponsored campaign content is
              clearly labeled and does not influence VERITUS INTERNATIONAL's editorial coverage or reporting.
              Our journalism remains independent and objective.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              All campaign information is provided by the respective campaign organizations. VERITUS INTERNATIONAL
              does not endorse candidates but supports civic engagement and informed democratic participation.
            </p>
          </div>
        </div>
      </div>
    </section >
  );
}
