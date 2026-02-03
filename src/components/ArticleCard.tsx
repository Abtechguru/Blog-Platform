import { Clock, Bookmark, TrendingUp, Eye } from 'lucide-react';
import { Article } from '../lib/mock-data';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'featured';
  onClick?: () => void;
}

export function ArticleCard({ article, variant = 'default', onClick }: ArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(article.bookmarked);
  const [isHovered, setIsHovered] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  if (variant === 'featured') {
    return (
      <div
        className="relative h-[600px] rounded-2xl overflow-hidden group cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <img
          src={article.image}
          alt={article.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
            }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#d4af37] text-[#1a365d] hover:bg-[#d4af37]/90 font-semibold">
                FEATURED
              </Badge>
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                {article.category}
              </Badge>
            </div>

            <h1 className="font-['Playfair_Display'] text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
              {article.title}
            </h1>

            <p className="text-white/90 text-sm sm:text-lg max-w-2xl line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full border-2 border-white/50"
                />
                <div>
                  <p className="font-semibold text-white">{article.author.name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min read
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="ml-auto text-white hover:bg-white/20"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        className="flex flex-col sm:flex-row gap-4 group cursor-pointer"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
          />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
            {article.featured && (
              <TrendingUp className="h-3 w-3 text-accent" />
            )}
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{article.author.name}</span>
            <span>•</span>
            <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime} min
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ${isHovered ? 'transform -translate-y-2' : ''
        }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-card rounded-2xl overflow-hidden border border-border shadow-sm ${isHovered ? 'shadow-xl shadow-primary/10' : ''
        } transition-all duration-300`}>
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/95 dark:bg-black/80 text-foreground hover:bg-white shadow-lg">
              {article.category}
            </Badge>
          </div>

          {/* Bookmark Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="absolute top-4 right-4 bg-white/95 dark:bg-black/80 hover:bg-white shadow-lg"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current text-accent' : ''}`} />
          </Button>

          {/* Stats Overlay on Hover */}
          {isHovered && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-1 text-sm">
                <Eye className="h-4 w-4" />
                {article.views.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <h3 className="font-['Playfair_Display'] text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3">
            {article.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{article.author.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime} min
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}