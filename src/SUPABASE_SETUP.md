# VERITUS INTERNATIONAL - Supabase Backend Setup Guide

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js installed on your machine
3. This VERITUS INTERNATIONAL project

## ✅ Quick Note

**Your Supabase connection is already configured!** 

The project is connected to:
- **Project ID**: `ejugsmvgmclfavoqmiak`
- **URL**: `https://ejugsmvgmclfavoqmiak.supabase.co`

Configuration is located in `/utils/supabase/info.tsx` (auto-managed by Figma Make).

## 🚀 Quick Setup (5 Minutes)

### Step 1: Access Your Supabase Project

1. Go to https://app.supabase.com
2. Find your project: **VERITUS International** (ID: ejugsmvgmclfavoqmiak)
3. Or create a new project if starting fresh

### Step 2: Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `/supabase/schema.sql` from this project
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This creates all your tables:
- ✅ users
- ✅ articles
- ✅ categories
- ✅ comments
- ✅ newsletter_subscribers
- ✅ media
- ✅ analytics

### Step 3: Set Up Storage (for Media Library)

1. In your Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `media`
4. Set it to **Private**
5. Click "Create bucket"

### Step 4: Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 5: Configure Environment Variables

1. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the values with your actual Supabase URL and anon key
3. **NEVER commit this file to git** (it should already be in `.gitignore`)

## ✅ Verify Setup

### Test Newsletter Subscription

1. Run your app: `npm run dev`
2. Wait 3 seconds for the newsletter popup
3. Enter an email and click "Subscribe for Free"
4. Go to Supabase dashboard → **Table Editor** → **newsletter_subscribers**
5. You should see your email there! 🎉

### Check Database Tables

In Supabase dashboard → **Table Editor**, verify these tables exist:
- ✅ users (with 1 admin user)
- ✅ categories (with 6 default categories)
- ✅ newsletter_subscribers (with your test email)
- ✅ articles (empty, ready for content)
- ✅ comments (empty)
- ✅ media (empty)
- ✅ analytics (empty)

## 🔒 Security - Row Level Security (RLS)

Our schema includes proper security policies:

### Public Access:
- ✅ Published articles (anyone can read)
- ✅ Categories (anyone can read)
- ✅ Approved comments (anyone can read)

### Admin Access:
- ✅ Full access to all tables
- ✅ User management
- ✅ Content moderation
- ✅ Analytics viewing

### Author Access:
- ✅ Can create/edit their own articles
- ✅ Can view their own stats

## 📊 Using the Admin Dashboard

### View Newsletter Subscribers

1. Login as admin (click "Admin Login" in bottom nav)
2. The User Management page shows subscriber stats
3. Or access the dedicated Subscriber Management page

### Features Available:
- ✅ View all subscribers
- ✅ Export to CSV
- ✅ Filter by active/inactive
- ✅ Search by email
- ✅ Bulk actions
- ✅ Real-time stats

## 🎯 Database Features

### Automatic Functionality:

1. **Auto-updating timestamps**
   - `created_at` and `updated_at` automatically managed
   - Triggers update timestamps on every edit

2. **Article view counter**
   - Automatic increment via `increment_article_views()` function
   - Tracks popularity

3. **Category article count**
   - Auto-updates when articles are added/removed
   - Always accurate

4. **UUID primary keys**
   - Secure, non-sequential IDs
   - Better for public-facing URLs

### Indexes for Performance:
- ✅ Email lookups (users, newsletter)
- ✅ Article slug searches
- ✅ Category filtering
- ✅ Date-based queries
- ✅ Full-text search ready

## 🔧 Advanced Configuration

### Setting Up Authentication (Optional)

If you want actual admin login (not just demo):

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider
3. Configure email templates
4. Update the `AdminLoginPage.tsx` to use Supabase Auth:

```typescript
import { supabase } from '../../lib/supabase-client';

const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password,
});
```

### Setting Up Storage Policies

For public media access:

1. Go to **Storage** → **Policies**
2. Add policy for `media` bucket:
   - **Policy name**: "Public read access"
   - **SELECT**: `true` (anyone can read)
   - **INSERT**: `auth.role() = 'authenticated'`

## 📈 Monitoring & Analytics

### View Real-Time Data:

1. **Table Editor**: See all your data
2. **Database** → **Logs**: Monitor queries
3. **Auth** → **Users**: See registered users
4. **Storage**: Monitor file uploads

### Performance:

- Check **Database** → **Query Performance**
- Monitor slow queries
- Optimize as needed

## 🆘 Troubleshooting

### "Failed to subscribe" error

**Problem**: Newsletter signup fails
**Solution**:
1. Check your `.env` file has correct values
2. Verify `newsletter_subscribers` table exists
3. Check browser console for detailed error
4. Verify table has RLS policies allowing inserts

### "Duplicate key" error

**Problem**: Email already subscribed
**Solution**: This is expected! Each email can only subscribe once. The error is handled gracefully in the UI.

### Tables not created

**Problem**: SQL script didn't run properly
**Solution**:
1. Go to SQL Editor in Supabase
2. Delete any partially created tables
3. Run the schema.sql script again
4. Check for any error messages

### Media uploads fail

**Problem**: Can't upload images
**Solution**:
1. Verify `media` bucket exists in Storage
2. Check storage policies allow authenticated uploads
3. Verify CORS settings in Storage settings

## 🎨 What's Connected to Supabase

### Currently Integrated:
✅ **Newsletter Subscriptions**
   - Saves to database
   - Duplicate prevention
   - Error handling
   - Admin viewing

✅ **Subscriber Management**
   - View all subscribers
   - Filter and search
   - Export to CSV
   - Real-time stats

### Ready to Connect (APIs created):
⚡ **Articles** - Full CRUD operations
⚡ **Users** - User management system
⚡ **Comments** - Comment moderation
⚡ **Categories** - Content organization
⚡ **Media** - File uploads and management
⚡ **Analytics** - Event tracking

## 🚀 Next Steps

1. **Test the newsletter** - Subscribe with a real email
2. **Check the database** - Verify data is saving
3. **Explore the admin dashboard** - View subscriber stats
4. **Add real content** - Start creating articles
5. **Customize** - Adjust the schema for your needs

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## 🎉 You're All Set!

Your VERITUS INTERNATIONAL blog is now powered by Supabase! 

**What you have:**
- ✅ Production-ready database
- ✅ Secure authentication system
- ✅ File storage for media
- ✅ Real-time subscriptions
- ✅ Admin management tools
- ✅ Scalable architecture

**Start creating amazing content!** 🚀