import React, { useState, useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { TrendingUp, ArrowRight, Sparkles, Mail } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { FeaturedSponsors } from './FeaturedSponsors';

interface HomePageProps {
  onArticleClick: (articleId: string) => void;
}

const categories = [
  { id: '1', name: 'Business', slug: 'business', color: '#3b82f6' },
  { id: '2', name: 'Technology', slug: 'technology', color: '#8b5cf6' },
  { id: '3', name: 'Finance', slug: 'finance', color: '#10b981' },
  { id: '4', name: 'Politics', slug: 'politics', color: '#ef4444' },
  { id: '5', name: 'Culture', slug: 'culture', color: '#f59e0b' },
  { id: '6', name: 'Science', slug: 'science', color: '#06b6d4' },
];

const mockArticles = [
  {
    id: '1',
    title: 'The Future of Global Markets in 2025',
    excerpt: 'An in-depth analysis of emerging trends shaping international trade and investment.',
    content: 'Full article content here...',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    author: {
      name: 'Lanrewaju Lawal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      bio: 'Main Author & Admin of VERITUS INTERNATIONAL',
      articles: 186,
      followers: 52100
    },
    publishedDate: '2024-01-15',
    readTime: 8,
    featured: true,
    bookmarked: false,
    likes: 234,
    views: 5420
  },
  {
    id: '2',
    title: 'AI Revolution: Transforming Industries',
    excerpt: 'How artificial intelligence is reshaping business operations and creating new opportunities.',
    content: 'Full article content here...',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    author: {
      name: 'Lanrewaju Lawal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      bio: 'Main Author & Admin of VERITUS INTERNATIONAL',
      articles: 186,
      followers: 52100
    },
    publishedDate: '2024-01-14',
    readTime: 6,
    featured: true,
    bookmarked: true,
    likes: 189,
    views: 4230
  },
  {
    id: '3',
    title: 'Sustainable Finance: The Path Forward',
    excerpt: 'Exploring how ESG principles are becoming central to modern investment strategies.',
    content: 'Full article content here...',
    category: 'Finance',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=600&fit=crop',
    author: {
      name: 'Lateef Abiodun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      bio: 'Web Developer & Technology Architect',
      articles: 42,
      followers: 18900
    },
    publishedDate: '2024-01-13',
    readTime: 7,
    featured: false,
    bookmarked: false,
    likes: 156,
    views: 3890
  },
];

export function HomePage({ onArticleClick }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [email, setEmail] = React.useState('');
  const [articles, setArticles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // If no articles in DB, use mock data
        setArticles(data.length > 0 ? data : mockArticles);
      } else {
        // Fallback to mock data on error
        console.error('Failed to fetch articles, using mock data');
        setArticles(mockArticles);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
        localStorage.setItem('newsletter_subscribed', 'true');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredArticle = articles.find(a => a.featured);
  const trendingArticles = articles.filter(a => a.featured).slice(0, 4);
  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Featured Article */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {featuredArticle && (
            <ArticleCard
              article={featuredArticle}
              variant="featured"
              onClick={() => onArticleClick(featuredArticle.id)}
            />
          )}
        </div>
      </section>

      {/* Featured Campaign Sponsors - Prominently at Top */}
      <section id="featured-sponsors">
        <FeaturedSponsors />
      </section>

      {/* Trending Section */}
      <section id="trending" className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-['Playfair_Display'] text-3xl font-bold">Trending Now</h2>
                <p className="text-muted-foreground">Most popular articles this week</p>
              </div>
            </div>
            <Button variant="ghost" className="hidden sm:flex">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trendingArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="horizontal"
                onClick={() => onArticleClick(article.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="h-6 w-6 text-[#d4af37]" />
            <h2 className="font-['Playfair_Display'] text-3xl font-bold">Explore by Category</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <Badge
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={`cursor-pointer px-6 py-2 text-sm transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#1a365d] text-white hover:bg-[#2d4a7c]'
                  : 'hover:border-primary'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              All Articles
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.slug ? 'default' : 'outline'}
                className={`cursor-pointer px-6 py-2 text-sm transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-[#1a365d] text-white hover:bg-[#2d4a7c]'
                    : 'hover:border-primary'
                }`}
                onClick={() => setSelectedCategory(category.slug)}
                style={
                  selectedCategory === category.slug
                    ? { backgroundColor: category.color, borderColor: category.color }
                    : {}
                }
              >
                {category.name}
              </Badge>
            ))}
          </div>

          {/* Latest Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 9).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article.id)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-[#1a365d] hover:bg-[#2d4a7c] text-white">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a365d] to-[#2d4a7c] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#d4af37] mb-6">
            <Mail className="h-8 w-8 text-[#1a365d]" />
          </div>

          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-4">
            Stay in the Know
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Get the latest insights, analysis, and stories delivered to your inbox every week.
            Join 50,000+ readers who trust VERITUS for premium content.
          </p>

          <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleNewsletterSubmit}>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white dark:bg-white text-gray-900 border-0 text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-[#d4af37] hover:bg-[#c49d2f] text-[#1a365d] font-semibold h-12 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-white/70 text-sm mt-4">
              No spam, unsubscribe anytime. By subscribing, you agree to our Privacy Policy.
            </p>
          </Card>
        </div>
      </section>

      {/* Authors Showcase */}
      <section id="authors" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold mb-4">
              Featured Authors
            </h2>
            <p className="text-muted-foreground text-lg">
              Learn from leading voices across industries
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.slice(0, 4).map((article) => (
              <Card key={article.id} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/10 group-hover:border-primary/30 transition-colors"
                />
                <h3 className="font-semibold text-lg mb-1">{article.author.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {article.author.bio}
                </p>
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <div className="font-semibold text-primary">{article.author.articles}</div>
                    <div className="text-muted-foreground">Articles</div>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{(article.author.followers / 1000).toFixed(1)}k</div>
                    <div className="text-muted-foreground">Followers</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}