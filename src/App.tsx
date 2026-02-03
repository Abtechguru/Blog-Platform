import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ArticleEditor } from './components/ArticleEditor';
import { UserProfile } from './components/UserProfile';
import { AuthPage } from './components/auth/AuthPage';
import { NewsletterSignup } from './components/NewsletterSignup';
import { UserManagementDashboard } from './components/admin/UserManagementDashboard';
import { CampaignPopup } from './components/CampaignPopup';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './contexts/AuthContext';
import { CampaignPage } from './components/CampaignPage';


type Page = 'home' | 'article' | 'admin' | 'editor' | 'profile' | 'users' | 'auth' | 'campaign';

export default function App() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string>('');
  const [showDevMenu, setShowDevMenu] = useState(true);
  const [showNewsletterSignup, setShowNewsletterSignup] = useState(false);

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
    // Only show if user is not logged in
    if (!hasSubscribed && !hasDismissed && !user) {
      const timer = setTimeout(() => {
        setShowNewsletterSignup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Update Page Title for SEO
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Home | VERITUS INTERNATIONAL',
      article: 'Article | VERITUS INTERNATIONAL',
      admin: 'Admin Dashboard | VERITUS INTERNATIONAL',
      editor: 'Article Editor | VERITUS INTERNATIONAL',
      profile: 'User Profile | VERITUS INTERNATIONAL',
      users: 'User Management | VERITUS INTERNATIONAL',

      auth: 'Sign In | VERITUS INTERNATIONAL',
      campaign: 'David Ombugadu 2027 | VERITUS INTERNATIONAL',
    };
    document.title = titles[currentPage] || 'VERITUS INTERNATIONAL';
  }, [currentPage]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
      // Redirect to auth if not admin
      setCurrentPage('auth');
    }
  };

  const navigateToEditor = () => {
    setCurrentPage('editor');
  };

  const navigateToProfile = () => {
    if (user) {
      setCurrentPage('profile');
    } else {
      setCurrentPage('auth');
    }
  };

  const navigateToUsers = () => {
    setCurrentPage('users');
  };

  const navigateToAuth = () => {
    setCurrentPage('auth');
  };

  const navigateToCampaign = () => {
    setCurrentPage('campaign');
  };

  const handleAuthSuccess = () => {
    setCurrentPage('home');
  };

  // Show auth page
  if (currentPage === 'auth') {
    return (
      <>
        <Toaster position="top-center" richColors />
        <AuthPage
          onBack={navigateToHome}
          onSuccess={handleAuthSuccess}
        />
      </>
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
      {user ? (
        <Button
          size="sm"
          variant={currentPage === 'profile' ? 'default' : 'ghost'}
          onClick={navigateToProfile}
          className={currentPage === 'profile' ? 'bg-[#1a365d] hover:bg-[#2d4a7c]' : ''}
        >
          Profile
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={navigateToAuth}
          className="border-[#1a365d] text-[#1a365d] hover:bg-[#1a365d] hover:text-white"
        >
          Sign In
        </Button>
      )}
      {isAdmin && (
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
        isAdmin ? (
          <AdminDashboard onNewArticle={navigateToEditor} />
        ) : (
          <AuthPage onBack={navigateToHome} onSuccess={() => setCurrentPage('admin')} />
        )
      ) : currentPage === 'editor' ? (
        isAdmin ? (
          <ArticleEditor onBack={navigateToAdmin} />
        ) : (
          <AuthPage onBack={navigateToHome} onSuccess={() => setCurrentPage('editor')} />
        )
      ) : currentPage === 'users' ? (
        isAdmin ? (
          <div className="min-h-screen bg-background">
            <UserManagementDashboard />
          </div>
        ) : (
          <AuthPage onBack={navigateToHome} onSuccess={() => setCurrentPage('users')} />
        )
      ) : currentPage === 'campaign' ? (
        <CampaignPage onBack={navigateToHome} />
      ) : (
        <Layout
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onNewsletterClick={() => setShowNewsletterSignup(true)}
          onAuthClick={navigateToAuth}
          onProfileClick={navigateToProfile}
        >
          {currentPage === 'home' && (
            <HomePage
              onArticleClick={navigateToArticle}
              onViewCampaign={navigateToCampaign}
            />
          )}
          {currentPage === 'article' && (
            <ArticleDetailPage
              articleId={selectedArticleId}
              onBack={navigateToHome}
              onArticleClick={navigateToArticle}
            />
          )}
          {currentPage === 'profile' && (
            user ? (
              <UserProfile
                onBack={navigateToHome}
                onArticleClick={navigateToArticle}
              />
            ) : (
              <AuthPage onBack={navigateToHome} onSuccess={() => setCurrentPage('profile')} />
            )
          )}
        </Layout>
      )}

      {/* Developer Navigation Menu */}
      {showDevMenu && <DevMenu />}

      {/* Quick toggle button if menu is hidden */}
      {
        !showDevMenu && (
          <Button
            size="sm"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 shadow-2xl"
            onClick={() => setShowDevMenu(true)}
          >
            Show Navigation
          </Button>
        )
      }
      {/* Campaign Popup */}
      <CampaignPopup onOpenCampaign={navigateToCampaign} />
    </div >
  );
}