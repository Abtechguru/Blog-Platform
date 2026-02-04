import { useState, useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { projectId, publicAnonKey } from '../utils/supabase/info';

import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Eye,
  Bookmark,
  Share2,
  ThumbsUp,
  Heart,
  Lightbulb,
  Flame,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
  MessageCircle
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    articles: number;
    followers: number;
    following: number;
  };
  publishDate: string;
  readTime: number;
  views: number;
  featured: boolean;
  bookmarked: boolean;
  likes: number;
  tags: string[];
}

const mockArticles: Article[] = [
  {
    id: 'ombugadu-2027-declaration',
    title: 'Editorial: See Why David Ombugadu Is The Right Man For The Job',
    excerpt: 'A Direct Pronouncement Reorients the Political Narrative and Nullifies Deputy Ticket Rumors',
    content: `In the prelude to every major electoral cycle, conjecture often competes with fact, and rumor attempts to masquerade as reality. The unfolding political discourse surrounding the 2027 Nasarawa State governorship race has been no exception. Persistent claims suggesting that David Ombugadu is positioning himself for a deputy governorship slot have circulated in various quarters. That narrative, however, has now been authoritatively extinguished. Ombugadu himself has made an explicit and unambiguous declaration: his aspiration is for the office of Governor.

Such a forthright proclamation carries decisive weight. In political communication, there exists no higher evidentiary standard than a candidate’s own categorical statement of intent. Ombugadu’s declaration is neither implied nor speculative — it is deliberate, direct, and dispositive. It reconfigures the conversation and renders contrary insinuations untenable.

The endurance of the deputy governorship rumor illustrates a familiar electoral phenomenon: premature projections and strategically seeded interpretations often seek to define candidacies before aspirants define themselves. These narratives, while sometimes politically motivated, frequently generate avoidable confusion among supporters and the broader electorate. In this instance, the candidate’s own voice has superseded the rumor mill, restoring clarity where ambiguity had been allowed to fester.

Moreover, Ombugadu’s stated ambition coheres with his political pedigree, electoral history, and leadership profile. Figures who have operated at the apex of gubernatorial contests seldom recalibrate toward subordinate roles absent a formal coalition framework or negotiated alliance — neither of which has been credibly advanced here. Instead, what has emerged is a self-articulated, principal-ticket ambition that aligns with his established political trajectory.

This clarification should serve as a pivot point for more substantive civic engagement. Electoral dialogue in Nasarawa State ought now to transcend speculative ticket permutations and instead interrogate matters of governance philosophy, developmental strategy, institutional reform, and administrative competence. Democracies are strengthened when voter attention is directed toward vision and viability rather than rumor and conjecture.

Political commentators, stakeholders, and opinion shapers bear a corresponding obligation to elevate factual accuracy above sensational repetition. To perpetuate a disproven narrative after a candidate’s unequivocal declaration is not merely imprecise — it is intellectually negligent.

With his personal and public pronouncement, David Ombugadu has conclusively settled the matter of his 2027 electoral objective. The proposition is no longer interpretive; it is declarative. His candidacy, by his own words, is aimed squarely at the governorship — unequivocally, unapologetically, and unmistakably.`,
    category: 'Politics',
    image: '/uploads/David.jpeg',
    author: {
      id: 'editorial-board',
      name: 'Veritus Editorial Board',
      avatar: '/uploads/David.jpeg',
      bio: 'Official Editorial Voice of Veritus International',
      articles: 1024,
      followers: 85400,
      following: 12
    },
    publishDate: '2026-02-03',
    readTime: 5,
    views: 45200,
    featured: true,
    bookmarked: false,
    likes: 1542,
    tags: ['Politics', 'Nasarawa 2027', 'Ombugadu', 'Clarification']
  },
  {
    id: '1',
    title: 'The Future of Global Markets in 2025',
    excerpt: 'An in-depth analysis of emerging trends shaping international trade and investment.',
    content: 'Full article content here...',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    author: {
      id: 'lanre-lawal',
      name: 'Lanrewaju Lawal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      bio: 'Main Author & Admin of VERITUS INTERNATIONAL',
      articles: 186,
      followers: 52100,
      following: 240
    },
    publishDate: '2024-01-15',
    readTime: 8,
    views: 5420,
    featured: false,
    bookmarked: false,
    likes: 234,
    tags: ['Business', 'Markets', 'Investment']
  },
];

interface ArticleDetailPageProps {
  articleId: string;
  onBack: () => void;
  onArticleClick: (articleId: string) => void;
}

export function ArticleDetailPage({ articleId, onBack, onArticleClick }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchArticle(controller.signal);
    return () => controller.abort();
  }, [articleId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchArticle = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles/${articleId}`,
        {
          signal,
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        fetchRelatedArticles(data.category, signal);
      } else {
        // Fallback to mock data
        console.warn('Article not found on server, using mock data');
        const mockArticle = mockArticles.find(a => a.id === articleId);
        setArticle(mockArticle || null);
        if (mockArticle) {
          fetchRelatedArticles(mockArticle.category, signal);
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Network error fetching article, using mock data:', error);
      const mockArticle = mockArticles.find(a => a.id === articleId);
      setArticle(mockArticle || null);
      if (mockArticle) {
        const related = mockArticles.filter(
          a => a.category === mockArticle.category && a.id !== mockArticle.id
        ).slice(0, 3);
        setRelatedArticles(related);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const fetchRelatedArticles = async (category: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles`,
        {
          signal,
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const related = data.filter(
          (a: Article) => a.category === category && a.id !== articleId
        ).slice(0, 3);
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const reactions = [
    { icon: ThumbsUp, label: 'Like', count: 1234 },
    { icon: Heart, label: 'Love', count: 892 },
    { icon: Lightbulb, label: 'Insightful', count: 456 },
    { icon: Flame, label: 'Fire', count: 234 },
  ];

  return (
    <div className="min-h-screen">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Progress value={readProgress} className="h-1 rounded-none" />
      </div>

      {/* Article Header */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          {/* Back Button & Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <ChevronRight className="h-4 w-4" />
            <span>{article.category}</span>
          </div>

          {/* Category Badge */}
          <Badge className="mb-4 text-sm px-4 py-1">
            {article.category}
          </Badge>

          {/* Title */}
          <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author & Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-16 h-16 rounded-full border-2 border-primary/20"
              />
              <div>
                <p className="font-semibold text-lg">{article.author.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{new Date(article.publishDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime} min read
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={isBookmarked ? 'fill-current' : ''} />
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>

                {showShareMenu && (
                  <Card className="absolute right-0 top-12 p-4 w-48 space-y-2 shadow-lg z-10 animate-in fade-in slide-in-from-top-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Separator />
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <Link2 className="h-4 w-4" />
                      Copy Link
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="px-4 sm:px-6 lg:px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl shadow-2xl"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Media Gallery (Provision for video and pictures) */}
          <div className="mt-12">
            <h3 className="font-['Playfair_Display'] text-2xl font-bold mb-6">Media & Press Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo Placeholder */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
                <img src={article.image} alt="Gallery 1" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <Badge className="absolute bottom-4 left-4">Photo</Badge>
              </div>
              {/* Video Placeholder */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer flex items-center justify-center bg-gray-900">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                </div>
                <Badge className="absolute bottom-4 left-4 bg-red-600 hover:bg-red-700">Video</Badge>
              </div>
              {/* More Photos */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
                <img src="/uploads/David.jpeg" alt="Gallery 2" className="object-cover w-full h-full transition-transform group-hover:scale-105" onError={(e) => e.currentTarget.src = article.image} />
                <Badge className="absolute bottom-4 left-4">Photo</Badge>
              </div>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1541872703-9993309a67a0?auto=format&fit=crop&q=80" alt="Gallery 3" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                <Badge className="absolute bottom-4 left-4">Photo</Badge>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-4 py-1">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reactions */}
          <div className="mt-8">
            <p className="text-sm font-semibold mb-4">What did you think of this article?</p>
            <div className="flex flex-wrap gap-3">
              {reactions.map((reaction, index) => {
                const Icon = reaction.icon;
                return (
                  <Button
                    key={index}
                    variant={selectedReaction === reaction.label ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedReaction(reaction.label)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {reaction.label}
                    <span className="text-muted-foreground ml-1">({reaction.count})</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Author Bio */}
          <Card className="mt-12 p-6">
            <div className="flex items-start gap-6">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">About {article.author.name}</h3>
                <p className="text-muted-foreground mb-4">{article.author.bio}</p>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-primary">{article.author.articles}</span>
                    <span className="text-muted-foreground ml-1">Articles</span>
                  </div>
                  <div>
                    <span className="font-semibold text-primary">{(article.author.followers / 1000).toFixed(1)}k</span>
                    <span className="text-muted-foreground ml-1">Followers</span>
                  </div>
                  <Button size="sm" className="ml-auto bg-[#1a365d] hover:bg-[#2d4a7c]">
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Comment Section Placeholder */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-['Playfair_Display'] text-2xl font-bold">
                Discussion ({Math.floor(Math.random() * 100)})
              </h3>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
            <Card className="p-8 text-center bg-muted/30">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Be the first to share your thoughts on this article
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-['Playfair_Display'] text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    onArticleClick(relatedArticle.id);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}