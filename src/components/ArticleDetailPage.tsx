import { useState, useEffect } from 'react';
import { ArticleCard } from './ArticleCard';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
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
    name: string;
    avatar: string;
    bio: string;
    articles: number;
    followers: number;
  };
  publishDate: string;
  readTime: number;
  views: number;
  tags: string[];
}

const mockArticles: Article[] = [
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
    publishDate: '2024-01-15',
    readTime: 8,
    views: 5420,
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
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchArticle();
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

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles/${articleId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        fetchRelatedArticles(data.category);
      } else {
        // Fallback to mock data
        const mockArticle = mockArticles.find(a => a.id === articleId);
        setArticle(mockArticle || null);
        if (mockArticle) {
          fetchRelatedArticles(mockArticle.category);
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      const mockArticle = mockArticles.find(a => a.id === articleId);
      setArticle(mockArticle || null);
      if (mockArticle) {
        const related = mockArticles.filter(
          a => a.category === mockArticle.category && a.id !== mockArticle.id
        ).slice(0, 3);
        setRelatedArticles(related);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async (category: string) => {
    try {
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
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Artificial Intelligence has fundamentally transformed from a speculative concept into an integral 
              part of our daily lives. From the moment we wake up to smart alarms that analyze our sleep patterns, 
              to the recommendation systems that curate our evening entertainment, AI has woven itself into the 
              fabric of modern existence.
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl font-bold mt-12 mb-6">
              The Evolution of Machine Learning
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              The journey from rule-based systems to neural networks represents one of the most significant 
              technological leaps in human history. Traditional programming required explicit instructions for 
              every possible scenario. Machine learning, by contrast, enables systems to learn patterns from 
              data and make decisions independently.
            </p>

            <Card className="my-8 p-8 bg-muted/50 border-l-4 border-primary">
              <p className="text-xl italic leading-relaxed">
                "The question is not whether AI will change our world, but how we choose to shape that change. 
                We stand at a crossroads between utopia and dystopia, and our decisions today will echo through 
                generations."
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                — Dr. Yann LeCun, Chief AI Scientist at Meta
              </p>
            </Card>

            <p className="text-lg leading-relaxed mb-6">
              Recent breakthroughs in large language models, computer vision, and reinforcement learning have 
              accelerated capabilities beyond what many experts predicted even five years ago. GPT-4 and its 
              successors demonstrate reasoning abilities that blur the line between narrow and general intelligence.
            </p>

            <h2 className="font-['Playfair_Display'] text-3xl font-bold mt-12 mb-6">
              Practical Applications Today
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Healthcare leads the charge in AI adoption, with diagnostic systems achieving accuracy rates that 
              rival or exceed human specialists in specific domains. Radiology, pathology, and drug discovery 
              have all been revolutionized by deep learning architectures.
            </p>

            <ul className="space-y-3 my-6 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">→</span>
                <span>Medical imaging analysis detecting cancers at earlier stages</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">→</span>
                <span>Personalized treatment recommendations based on genetic profiles</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">→</span>
                <span>Drug discovery accelerated from years to months through molecular simulation</span>
              </li>
            </ul>

            <h2 className="font-['Playfair_Display'] text-3xl font-bold mt-12 mb-6">
              Ethical Considerations and Challenges
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              With great power comes great responsibility. The rapid advancement of AI raises critical questions 
              about privacy, bias, accountability, and the future of human labor. Algorithmic bias in criminal 
              justice, lending, and hiring demonstrates how AI can perpetuate and amplify existing societal inequalities.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              The path forward requires multidisciplinary collaboration between technologists, ethicists, 
              policymakers, and affected communities. We must build AI systems that are not just powerful, 
              but also fair, transparent, and aligned with human values.
            </p>
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