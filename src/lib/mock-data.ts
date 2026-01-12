// Mock data for VERITUS INTERNATIONAL Blog Platform

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  readTime: number;
  publishDate: string;
  image: string;
  featured: boolean;
  views: number;
  likes: number;
  bookmarked: boolean;
  tags: string[];
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  articles: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', color: '#3b82f6' },
  { id: '2', name: 'Business', slug: 'business', color: '#d4af37' },
  { id: '3', name: 'Science', slug: 'science', color: '#10b981' },
  { id: '4', name: 'Culture', slug: 'culture', color: '#8b5cf6' },
  { id: '5', name: 'Politics', slug: 'politics', color: '#ef4444' },
  { id: '6', name: 'Health', slug: 'health', color: '#ec4899' },
];

export const authors: Author[] = [
  {
    id: '1',
    name: 'Lanrewaju Lawal',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Main Author & Admin of VERITUS INTERNATIONAL. Expert in global affairs, business strategy, and technology trends.',
    followers: 52100,
    following: 328,
    articles: 186,
  },
  {
    id: '2',
    name: 'Lateef Abiodun',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    bio: 'Web Developer & Technology Architect. Building the future of digital publishing platforms.',
    followers: 18900,
    following: 156,
    articles: 42,
  },
];

export const articles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence: Beyond Machine Learning',
    excerpt: 'Exploring the next frontier of AI technology and its implications for society, from AGI to quantum computing integration.',
    content: `Artificial Intelligence has evolved beyond our wildest dreams...`,
    category: 'Technology',
    author: authors[0],
    readTime: 8,
    publishDate: '2026-01-10',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
    featured: true,
    views: 45231,
    likes: 2341,
    bookmarked: false,
    tags: ['AI', 'Machine Learning', 'Technology'],
  },
  {
    id: '2',
    title: 'Global Markets React to New Economic Policies',
    excerpt: 'An in-depth analysis of how recent monetary policy changes are reshaping international trade dynamics.',
    content: `The global economic landscape is shifting...`,
    category: 'Business',
    author: authors[0],
    readTime: 6,
    publishDate: '2026-01-09',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop',
    featured: true,
    views: 32145,
    likes: 1823,
    bookmarked: true,
    tags: ['Economics', 'Markets', 'Finance'],
  },
  {
    id: '3',
    title: 'Breakthrough in Renewable Energy Storage',
    excerpt: 'Scientists develop new battery technology that could revolutionize solar and wind power efficiency.',
    content: `A team of researchers has announced...`,
    category: 'Science',
    author: authors[0],
    readTime: 7,
    publishDate: '2026-01-08',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop',
    featured: false,
    views: 28934,
    likes: 1654,
    bookmarked: false,
    tags: ['Energy', 'Climate', 'Innovation'],
  },
  {
    id: '4',
    title: 'The Renaissance of Independent Cinema',
    excerpt: 'How streaming platforms and digital tools are empowering a new generation of filmmakers.',
    content: `Independent cinema is experiencing...`,
    category: 'Culture',
    author: authors[0],
    readTime: 5,
    publishDate: '2026-01-07',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
    featured: false,
    views: 19234,
    likes: 987,
    bookmarked: false,
    tags: ['Film', 'Art', 'Media'],
  },
  {
    id: '5',
    title: 'Quantum Computing: From Theory to Practice',
    excerpt: 'Major tech companies announce commercial quantum computing services, marking a new era in computational power.',
    content: `The quantum revolution is here...`,
    category: 'Technology',
    author: authors[0],
    readTime: 10,
    publishDate: '2026-01-06',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop',
    featured: false,
    views: 41267,
    likes: 2156,
    bookmarked: true,
    tags: ['Quantum', 'Computing', 'Science'],
  },
  {
    id: '6',
    title: 'The Evolution of Remote Work Culture',
    excerpt: 'Five years after the pandemic, we examine how remote work has permanently transformed corporate culture.',
    content: `Remote work has evolved...`,
    category: 'Business',
    author: authors[0],
    readTime: 6,
    publishDate: '2026-01-05',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop',
    featured: false,
    views: 15678,
    likes: 834,
    bookmarked: false,
    tags: ['Work', 'Culture', 'Business'],
  },
  {
    id: '7',
    title: 'Biotech Advances in Personalized Medicine',
    excerpt: 'CRISPR and AI combine to create truly personalized treatment plans for complex diseases.',
    content: `The future of medicine is personal...`,
    category: 'Health',
    author: authors[0],
    readTime: 9,
    publishDate: '2026-01-04',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&h=600&fit=crop',
    featured: false,
    views: 23456,
    likes: 1432,
    bookmarked: false,
    tags: ['Health', 'Biotech', 'Medicine'],
  },
  {
    id: '8',
    title: 'Urban Design for the Climate Crisis',
    excerpt: 'Cities around the world are reimagining infrastructure to adapt to extreme weather and rising temperatures.',
    content: `Urban planners are getting creative...`,
    category: 'Science',
    author: authors[0],
    readTime: 7,
    publishDate: '2026-01-03',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=600&fit=crop',
    featured: false,
    views: 18923,
    likes: 1045,
    bookmarked: true,
    tags: ['Climate', 'Architecture', 'Urban Planning'],
  },
];

export const dashboardStats = {
  totalViews: 1234567,
  totalArticles: 342,
  totalUsers: 89234,
  revenue: 45678,
  viewsChange: 12.5,
  articlesChange: 8.3,
  usersChange: 15.7,
  revenueChange: -3.2,
};

export const trafficData = [
  { month: 'Jul', views: 45000, users: 12000 },
  { month: 'Aug', views: 52000, users: 15000 },
  { month: 'Sep', views: 48000, users: 14000 },
  { month: 'Oct', views: 61000, users: 18000 },
  { month: 'Nov', views: 55000, users: 16000 },
  { month: 'Dec', views: 67000, users: 21000 },
  { month: 'Jan', views: 73000, users: 24000 },
];

export const categoryData = [
  { name: 'Technology', value: 35, fill: '#3b82f6' },
  { name: 'Business', value: 25, fill: '#d4af37' },
  { name: 'Science', value: 20, fill: '#10b981' },
  { name: 'Culture', value: 12, fill: '#8b5cf6' },
  { name: 'Other', value: 8, fill: '#64748b' },
];

export const recentActivity = [
  { id: '1', type: 'article', user: 'Lanrewaju Lawal', action: 'published', title: 'The Future of AI', time: '5 minutes ago' },
  { id: '2', type: 'comment', user: 'John Doe', action: 'commented on', title: 'Global Markets React', time: '23 minutes ago' },
  { id: '3', type: 'user', user: 'Emma Wilson', action: 'joined', title: '', time: '1 hour ago' },
  { id: '4', type: 'article', user: 'Lanrewaju Lawal', action: 'updated', title: 'Remote Work Culture', time: '2 hours ago' },
  { id: '5', type: 'like', user: '234 users', action: 'liked', title: 'Quantum Computing', time: '3 hours ago' },
];