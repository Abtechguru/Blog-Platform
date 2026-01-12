import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-302887ca/health", (c) => {
  return c.json({ status: "ok" });
});

// Newsletter endpoints
app.post("/make-server-302887ca/newsletter/subscribe", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400);
    }

    // Check if email already exists
    const existing = await kv.get(`newsletter:${email}`);
    if (existing && existing.is_active) {
      return c.json({ error: 'This email is already subscribed!' }, 409);
    }

    // Create subscriber record
    const subscriber = {
      id: crypto.randomUUID(),
      email,
      subscribed_at: new Date().toISOString(),
      is_active: true,
      preferences: {
        weekly_digest: true,
        article_updates: true,
        exclusive_content: true,
      },
    };

    // Save to KV store
    await kv.set(`newsletter:${email}`, subscriber);

    console.log(`Newsletter subscription successful: ${email}`);
    return c.json(subscriber);
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

app.post("/make-server-302887ca/newsletter/unsubscribe", async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const subscriber = await kv.get(`newsletter:${email}`);
    if (!subscriber) {
      return c.json({ error: 'Email not found' }, 404);
    }

    // Mark as inactive
    subscriber.is_active = false;
    await kv.set(`newsletter:${email}`, subscriber);

    console.log(`Newsletter unsubscribe successful: ${email}`);
    return c.json(subscriber);
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return c.json({ error: 'Failed to unsubscribe' }, 500);
  }
});

app.get("/make-server-302887ca/newsletter/list", async (c) => {
  try {
    const subscribers = await kv.getByPrefix('newsletter:');
    
    // Sort by subscribed_at descending
    subscribers.sort((a, b) => 
      new Date(b.subscribed_at).getTime() - new Date(a.subscribed_at).getTime()
    );

    return c.json(subscribers);
  } catch (error) {
    console.error('Newsletter list error:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

app.get("/make-server-302887ca/newsletter/stats", async (c) => {
  try {
    const subscribers = await kv.getByPrefix('newsletter:');
    
    const total = subscribers.length;
    const active = subscribers.filter(s => s.is_active).length;

    return c.json({ total, active });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Article endpoints
app.post("/make-server-302887ca/articles", async (c) => {
  try {
    const articleData = await c.req.json();
    
    if (!articleData.title || !articleData.content) {
      return c.json({ error: 'Title and content are required' }, 400);
    }

    const article = {
      id: articleData.id || crypto.randomUUID(),
      title: articleData.title,
      excerpt: articleData.excerpt || '',
      content: articleData.content,
      category: articleData.category || 'Uncategorized',
      author: articleData.author || {
        id: '1',
        name: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
        bio: 'Administrator',
        followers: 0,
        following: 0,
        articles: 0,
      },
      readTime: articleData.readTime || 5,
      publishDate: articleData.publishDate || new Date().toISOString(),
      image: articleData.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop',
      featured: articleData.featured || false,
      views: articleData.views || 0,
      likes: articleData.likes || 0,
      bookmarked: false,
      tags: articleData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: articleData.status || 'published',
    };

    // Save to KV store
    await kv.set(`article:${article.id}`, article);

    console.log(`Article created successfully: ${article.id}`);
    return c.json(article);
  } catch (error) {
    console.error('Article creation error:', error);
    return c.json({ error: 'Failed to create article' }, 500);
  }
});

app.get("/make-server-302887ca/articles", async (c) => {
  try {
    const articles = await kv.getByPrefix('article:');
    
    // Sort by publishDate descending
    articles.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return c.json(articles);
  } catch (error) {
    console.error('Articles list error:', error);
    return c.json({ error: 'Failed to fetch articles' }, 500);
  }
});

app.get("/make-server-302887ca/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const article = await kv.get(`article:${id}`);
    
    if (!article) {
      return c.json({ error: 'Article not found' }, 404);
    }

    // Increment views
    article.views = (article.views || 0) + 1;
    await kv.set(`article:${article.id}`, article);

    return c.json(article);
  } catch (error) {
    console.error('Article fetch error:', error);
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

app.put("/make-server-302887ca/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`article:${id}`);
    if (!existing) {
      return c.json({ error: 'Article not found' }, 404);
    }

    const article = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve original ID
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`article:${id}`, article);

    console.log(`Article updated successfully: ${id}`);
    return c.json(article);
  } catch (error) {
    console.error('Article update error:', error);
    return c.json({ error: 'Failed to update article' }, 500);
  }
});

app.delete("/make-server-302887ca/articles/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`article:${id}`);
    if (!existing) {
      return c.json({ error: 'Article not found' }, 404);
    }

    await kv.del(`article:${id}`);

    console.log(`Article deleted successfully: ${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Article delete error:', error);
    return c.json({ error: 'Failed to delete article' }, 500);
  }
});

// Get articles by category
app.get("/make-server-302887ca/articles/category/:category", async (c) => {
  try {
    const category = c.req.param('category');
    const articles = await kv.getByPrefix('article:');
    
    const filtered = articles.filter(a => 
      a.category.toLowerCase() === category.toLowerCase()
    );

    // Sort by publishDate descending
    filtered.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return c.json(filtered);
  } catch (error) {
    console.error('Articles by category error:', error);
    return c.json({ error: 'Failed to fetch articles' }, 500);
  }
});

// Get featured articles
app.get("/make-server-302887ca/articles/featured/list", async (c) => {
  try {
    const articles = await kv.getByPrefix('article:');
    
    const featured = articles.filter(a => a.featured);

    // Sort by publishDate descending
    featured.sort((a, b) => 
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );

    return c.json(featured);
  } catch (error) {
    console.error('Featured articles error:', error);
    return c.json({ error: 'Failed to fetch featured articles' }, 500);
  }
});

Deno.serve(app.fetch);