import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to make API calls to our server
const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-302887ca`;

async function callServer(endpoint: string, method: string = 'GET', body?: any) {
  const response = await fetch(`${serverUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Server request failed');
  }

  return response.json();
}

// Database types
export interface Newsletter {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  preferences?: {
    weekly_digest: boolean;
    article_updates: boolean;
    exclusive_content: boolean;
  };
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_id: string;
  category_id: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publish_date: string;
  view_count: number;
  read_time: number;
  meta_description?: string;
  meta_keywords?: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'author' | 'contributor' | 'reader';
  bio?: string;
  display_name?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  is_approved: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  article_count: number;
  created_at: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  mime_type: string;
  alt_text?: string;
  uploaded_by: string;
  usage_count: number;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
  };
  created_at: string;
}

export interface Analytics {
  id: string;
  article_id?: string;
  event_type: 'page_view' | 'article_view' | 'article_read' | 'share' | 'download';
  user_id?: string;
  session_id: string;
  metadata?: any;
  created_at: string;
}

// Newsletter API
export const newsletterAPI = {
  async subscribe(email: string) {
    return callServer('/newsletter/subscribe', 'POST', { email });
  },

  async unsubscribe(email: string) {
    return callServer('/newsletter/unsubscribe', 'POST', { email });
  },

  async getAll() {
    return callServer('/newsletter/list', 'GET');
  },

  async getStats() {
    return callServer('/newsletter/stats', 'GET');
  },
};

// Articles API
export const articlesAPI = {
  async create(article: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Article>) {
    const { data, error } = await supabase
      .from('articles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:users!author_id(*),
        category:categories!category_id(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll(filters?: { status?: string; category?: string; limit?: number }) {
    let query = supabase
      .from('articles')
      .select(`
        *,
        author:users!author_id(*),
        category:categories!category_id(*)
      `)
      .order('publish_date', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:users!author_id(*),
        category:categories!category_id(*)
      `)
      .eq('is_featured', true)
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .limit(6);
    
    if (error) throw error;
    return data;
  },

  async incrementViewCount(id: string) {
    const { error } = await supabase.rpc('increment_article_views', { article_id: id });
    if (error) throw error;
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:users!author_id(*),
        category:categories!category_id(*)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('status', 'published')
      .limit(20);
    
    if (error) throw error;
    return data;
  },
};

// Users API
export const usersAPI = {
  async create(user: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) throw error;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll(filters?: { role?: string; is_active?: boolean }) {
    let query = supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getStats() {
    const { count: total } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: active } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const { count: authors } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'author');

    return { total: total || 0, active: active || 0, authors: authors || 0 };
  },
};

// Comments API
export const commentsAPI = {
  async create(comment: Partial<Comment>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Comment>) {
    const { data, error } = await supabase
      .from('comments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getByArticleId(articleId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users!user_id(*)
      `)
      .eq('article_id', articleId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async approve(id: string) {
    const { data, error } = await supabase
      .from('comments')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(category: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Category>) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
};

// Media API
export const mediaAPI = {
  async upload(file: File, uploadedBy: string) {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${uploadedBy}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Save metadata to database
    const { data, error } = await supabase
      .from('media')
      .insert([{
        filename: file.name,
        url: publicUrl,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy,
        usage_count: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(filters?: { type?: string }) {
    let query = supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async delete(id: string, filePath: string) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Analytics API
export const analyticsAPI = {
  async trackEvent(event: Partial<Analytics>) {
    const { data, error } = await supabase
      .from('analytics')
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getArticleViews(articleId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('analytics')
      .select('created_at')
      .eq('article_id', articleId)
      .eq('event_type', 'article_view')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    return data;
  },

  async getTotalViews(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { count, error } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;
    return count || 0;
  },
};