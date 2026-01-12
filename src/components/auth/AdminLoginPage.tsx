import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
  const { signIn, profile } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || 'Invalid credentials. Please try again.');
      setIsLoading(false);
      return;
    }

    // Check if user has admin role after login
    // The auth state will be updated by the context
    // We need to wait a moment for the profile to be fetched
    setTimeout(() => {
      // The profile check happens in the parent component (App.tsx)
      // which will verify if the logged-in user has admin role
      toast.success('Welcome back, Admin!');
      onLogin();
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#dc2626]/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <div className="p-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#dc2626] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-bold text-3xl mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage VERITUS INTERNATIONAL
            </p>
            <Badge className="mt-3 bg-[#1a365d] hover:bg-[#1a365d]">
              Administrator Portal
            </Badge>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@veritus.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Button type="button" variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1a365d] hover:bg-[#2d4a7c] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                'Sign In as Admin'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-[#1a365d] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Secure Admin Portal</p>
                <p className="text-muted-foreground text-xs">
                  This area is restricted to authorized administrators only.
                  Access is verified through Supabase authentication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}