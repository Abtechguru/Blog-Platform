import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowLeft } from 'lucide-react';
import { Toaster } from "sonner";



interface AdminLoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

// Hardcoded admin credentials for constant access
const ADMIN_CREDENTIALS = {
  username: 'admin@veritus',
  password: 'adminveritus'
};

export function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate credentials
    if (email === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store admin session if remember me is checked
      if (rememberMe) {
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_email', email);
      }
      
      toast.success('Welcome back, Admin!');
      setTimeout(() => {
        onLogin();
      }, 500);
    } else {
      setIsLoading(false);
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#dc2626]/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <div className="p-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Site
          </Button>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1a365d] to-[#dc2626] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold mb-2">
              Admin Access
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage VERITUS INTERNATIONAL
            </p>
            <Badge className="mt-3 bg-[#1a365d]">
              Administrator Portal
            </Badge>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@veritus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Button variant="link" className="px-0 text-sm">
                Forgot password?
              </Button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-[#1a365d] hover:bg-[#2d4a7c]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In as Admin'}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-[#1a365d] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Secure Admin Portal</p>
                <p className="text-muted-foreground text-xs">
                  This area is restricted to authorized administrators only. All login attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}