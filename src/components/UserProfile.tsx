import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  Mail,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Award,
  Star,
  TrendingUp,
  CheckCircle2,
  Settings,
  Share2,
} from 'lucide-react';
import { authors, articles } from '../lib/mock-data';
import { ArticleCard } from './ArticleCard';

interface UserProfileProps {
  onBack: () => void;
  onArticleClick: (articleId: string) => void;
}

export function UserProfile({ onBack, onArticleClick }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const author = authors[0]; // Using first author as example
  const userArticles = articles.filter(a => a.author.id === author.id);

  const achievements = [
    { icon: Star, label: 'Top Writer', color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Trending Author', color: 'text-blue-500' },
    { icon: Award, label: '100+ Articles', color: 'text-purple-500' },
    { icon: CheckCircle2, label: 'Verified', color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative h-80 bg-gradient-to-br from-[#1a365d] to-[#3b82f6]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=400&fit=crop')] bg-cover bg-center opacity-20" />
        
        {/* Profile Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <img
              src={author.avatar}
              alt={author.name}
              className="w-40 h-40 rounded-full border-4 border-background shadow-xl"
            />

            {/* Name & Bio */}
            <div className="flex-1 bg-card rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-2">
                    {author.name}
                  </h1>
                  <p className="text-muted-foreground mb-3">
                    {author.bio}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      San Francisco, CA
                    </span>
                    <span className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      sarahmitchell.com
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined January 2024
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={isFollowing ? 'outline' : 'default'}
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={!isFollowing ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-border">
                <div>
                  <div className="text-2xl font-bold text-primary">{author.articles}</div>
                  <div className="text-sm text-muted-foreground">Articles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {(author.followers / 1000).toFixed(1)}k
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{author.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">2.4M</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold text-lg mb-4">Achievements & Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${achievement.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm">{achievement.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="articles" className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-['Playfair_Display'] text-2xl font-bold">
                Published Articles ({userArticles.length})
              </h2>
              <div className="flex gap-2">
                <Badge variant="outline">Latest</Badge>
                <Badge variant="outline">Most Viewed</Badge>
                <Badge variant="outline">Top Rated</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => onArticleClick(article.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-8">
            <div className="space-y-4">
              {[
                { action: 'Published', title: 'The Future of Artificial Intelligence', time: '2 days ago' },
                { action: 'Updated', title: 'Quantum Computing: Theory to Practice', time: '5 days ago' },
                { action: 'Commented on', title: 'Global Markets Analysis', time: '1 week ago' },
                { action: 'Liked', title: 'Breakthrough in Renewable Energy', time: '1 week ago' },
                { action: 'Published', title: 'Machine Learning Evolution', time: '2 weeks ago' },
              ].map((activity, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">
                        {author.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="mb-1">
                        <span className="font-semibold">{author.name}</span>
                        {' '}{activity.action.toLowerCase()}{' '}
                        <span className="font-semibold">{activity.title}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Biography</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {author.bio}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Sarah has been covering the technology sector for over a decade, with a particular 
                  focus on artificial intelligence, machine learning, and emerging technologies. 
                  She holds a Master's degree in Computer Science from Stanford University and has 
                  worked with leading tech companies including Google and Microsoft before transitioning 
                  to full-time journalism.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Artificial Intelligence', 'Machine Learning', 'Technology', 'Innovation', 
                    'Research', 'Data Science', 'Future Tech'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <h3 className="font-semibold text-lg mb-4 mt-6">Featured In</h3>
                <div className="space-y-3">
                  {['TechCrunch', 'Wired', 'The Verge', 'MIT Technology Review'].map((publication) => (
                    <div key={publication} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                        <span className="text-xs font-semibold">{publication[0]}</span>
                      </div>
                      <span className="text-sm">{publication}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
