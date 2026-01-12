import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ArticleEditor } from './components/ArticleEditor';
import { UserProfile } from './components/UserProfile';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { NewsletterSignup } from './components/NewsletterSignup';
import { UserManagementDashboard } from './components/admin/UserManagementDashboard';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

type Page = 'home' | 'article' | 'admin' | 'editor' | 'profile' | 'users';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [showDevMenu, setShowDevMenu] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showNewsletterSignup, setShowNewsletterSignup] = useState(false);

  // Check for stored admin session on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Check if user has already subscribed or dismissed the newsletter
    const hasSubscribed = localStorage.getItem('newsletter_subscribed');
    const hasDismissed = localStorage.getItem('newsletter_dismissed');
    
    // Show newsletter popup for first-time visitors after 3 seconds
    if (!hasSubscribed && !hasDismissed) {
      const timer = setTimeout(() => {
        setShowNewsletterSignup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
    setCurrentPage('admin');
    localStorage.setItem('admin_session', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setCurrentPage('home');
    localStorage.removeItem('admin_session');
  };

  const navigateToArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentPage('article');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedArticleId('');
  };

  const navigateToAdmin = () => {
    if (isAdmin) {
      setCurrentPage('admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const navigateToEditor = () => {
    setCurrentPage('editor');
  };

  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const navigateToUsers = () => {
    setCurrentPage('users');
  };

  // Show admin login screen
  if (showAdminLogin) {
    return (
      <AdminLoginPage
        onLogin={handleAdminLogin}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  // Developer navigation menu (for demo purposes)
  const DevMenu = () => (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-full shadow-2xl px-6 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
      <span className="text-sm font-semibold text-muted-foreground">Navigate:</span>
      <Button
        size="sm"
        variant={currentPage === 'home' ? 'default' : 'ghost'}
        onClick={navigateToHome}
        className={currentPage === 'home' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
      >
        Home
      </Button>
      <Button
        size="sm"
        variant={currentPage === 'article' ? 'default' : 'ghost'}
        onClick={() => navigateToArticle('1')}
        className={currentPage === 'article' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
      >
        Article
      </Button>
      <Button
        size="sm"
        variant={currentPage === 'profile' ? 'default' : 'ghost'}
        onClick={navigateToProfile}
        className={currentPage === 'profile' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
      >
        Profile
      </Button>
      {!isAdmin ? (
        <Button
          size="sm"
          variant="outline"
          onClick={navigateToAdmin}
          className="border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white"
        >
          Admin Login
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            variant={currentPage === 'admin' ? 'default' : 'ghost'}
            onClick={navigateToAdmin}
            className={currentPage === 'admin' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'users' ? 'default' : 'ghost'}
            onClick={navigateToUsers}
            className={currentPage === 'users' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
          >
            Users
          </Button>
          <Button
            size="sm"
            variant={currentPage === 'editor' ? 'default' : 'ghost'}
            onClick={navigateToEditor}
            className={currentPage === 'editor' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
          >
            Editor
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdminLogout}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Logout
          </Button>
        </>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowDevMenu(false)}
        className="ml-2"
      >
        ✕
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Newsletter Signup Modal for First-Time Visitors */}
      {showNewsletterSignup && (
        <NewsletterSignup onClose={() => setShowNewsletterSignup(false)} />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />

      {/* Admin-only pages have their own layouts */}
      {currentPage === 'admin' ? (
        <AdminDashboard onNewArticle={navigateToEditor} />
      ) : currentPage === 'editor' ? (
        <ArticleEditor onBack={navigateToAdmin} />
      ) : currentPage === 'users' ? (
        <div className="min-h-screen bg-background">
          <UserManagementDashboard />
        </div>
      ) : (
        <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onNewsletterClick={() => setShowNewsletterSignup(true)}>
          {currentPage === 'home' && (
            <HomePage onArticleClick={navigateToArticle} />
          )}
          {currentPage === 'article' && (
            <ArticleDetailPage
              articleId={selectedArticleId}
              onBack={navigateToHome}
              onArticleClick={navigateToArticle}
            />
          )}
          {currentPage === 'profile' && (
            <UserProfile
              onBack={navigateToHome}
              onArticleClick={navigateToArticle}
            />
          )}
        </Layout>
      )}

      {/* Developer Navigation Menu */}
      {showDevMenu && <DevMenu />}

      {/* Quick toggle button if menu is hidden */}
      {!showDevMenu && (
        <Button
          size="sm"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-2xl"
          onClick={() => setShowDevMenu(true)}
        >
          Show Navigation
        </Button>
      )}
    </div>
  );
}