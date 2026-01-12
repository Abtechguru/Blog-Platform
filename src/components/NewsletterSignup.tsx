import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { X, Mail, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { newsletterAPI } from '../lib/supabase-client';

interface NewsletterSignupProps {
  onClose: () => void;
}

export function NewsletterSignup({ onClose }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Animate in after a short delay
    const timer = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Save to backend via server
        await newsletterAPI.subscribe(email);
        
        // Store in localStorage for UI state
        localStorage.setItem('newsletter_subscribed', 'true');
        localStorage.setItem('subscriber_email', email);
        setIsSubmitted(true);
        
        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err: any) {
        console.error('Newsletter subscription error:', err);
        // Extract error message from response
        const errorMessage = err.message || 'Failed to subscribe. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('newsletter_dismissed', 'true');
    onClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
          >
            <Card className="p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1a365d]/20 to-[#d4af37]/20 rounded-full blur-3xl -z-10" />
              
              {!isSubmitted ? (
                <>
                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-2">
                      Welcome to VERITUS
                    </h2>
                    <p className="text-muted-foreground">
                      Stay updated with our latest articles and insights. Join our community of readers.
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <span>Weekly digest of top articles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <span>Exclusive content and early access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <span>No spam, unsubscribe anytime</span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] hover:from-[#2d4a7c] hover:to-[#1a365d]"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Subscribing...' : 'Subscribe for Free'}
                    </Button>
                  </form>

                  {/* Footer */}
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    By subscribing, you agree to our Privacy Policy
                  </p>
                </>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground mb-4">
                    Welcome to the VERITUS community. Check your inbox for a confirmation email.
                  </p>
                  <Badge className="gap-2">
                    <Sparkles className="h-3 w-3" />
                    Subscription Confirmed
                  </Badge>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}