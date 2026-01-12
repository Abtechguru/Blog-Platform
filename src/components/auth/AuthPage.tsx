import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    ArrowLeft,
    Sparkles,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

interface AuthPageProps {
    onBack: () => void;
    onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'magic-link' | 'verify-otp' | 'forgot-password';

export function AuthPage({ onBack, onSuccess }: AuthPageProps) {
    const { signUp, signIn, signInWithMagicLink, verifyOtp, resetPassword } = useAuth();

    const [mode, setMode] = useState<AuthMode>('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Form fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await signIn(email, password);

        if (error) {
            toast.error(error.message || 'Failed to sign in');
            setIsLoading(false);
            return;
        }

        toast.success('Welcome back!');
        setIsLoading(false);
        onSuccess?.();
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!fullName.trim()) {
            toast.error('Please enter your full name');
            setIsLoading(false);
            return;
        }

        const { error } = await signUp(email, password, fullName);

        if (error) {
            toast.error(error.message || 'Failed to create account');
            setIsLoading(false);
            return;
        }

        toast.success('Account created! Please check your email to verify.');
        setIsLoading(false);
        onSuccess?.();
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await signInWithMagicLink(email);

        if (error) {
            toast.error(error.message || 'Failed to send magic link');
            setIsLoading(false);
            return;
        }

        setOtpSent(true);
        setMode('verify-otp');
        toast.success('Check your email for the verification code!');
        setIsLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);

        const { error } = await verifyOtp(email, otpCode);

        if (error) {
            toast.error(error.message || 'Invalid verification code');
            setIsLoading(false);
            return;
        }

        toast.success('Successfully signed in!');
        setIsLoading(false);
        onSuccess?.();
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            toast.error(error.message || 'Failed to send reset email');
            setIsLoading(false);
            return;
        }

        toast.success('Password reset email sent!');
        setIsLoading(false);
        setMode('signin');
    };

    const renderSignInForm = () => (
        <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
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
                        placeholder="Enter your password"
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
                    <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                        Remember me
                    </label>
                </div>
                <Button
                    type="button"
                    variant="link"
                    className="px-0 text-sm"
                    onClick={() => setMode('forgot-password')}
                >
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
                    'Sign In'
                )}
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setMode('magic-link')}
            >
                <Sparkles className="mr-2 h-4 w-4" />
                Sign in with Magic Link
            </Button>
        </form>
    );

    const renderSignUpForm = () => (
        <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="signupEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="signupPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
            </div>

            <Button
                type="submit"
                className="w-full bg-[#1a365d] hover:bg-[#2d4a7c] text-white"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                    </>
                ) : (
                    'Create Account'
                )}
            </Button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setMode('magic-link')}
            >
                <Sparkles className="mr-2 h-4 w-4" />
                Sign up with Magic Link
            </Button>
        </form>
    );

    const renderMagicLinkForm = () => (
        <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-bold text-2xl mb-2">Magic Link</h2>
                <p className="text-muted-foreground text-sm">
                    We'll send you a one-time code to sign in instantly
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="magicEmail">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="magicEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Code...
                    </>
                ) : (
                    'Send Magic Code'
                )}
            </Button>

            <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode('signin')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
            </Button>
        </form>
    );

    const renderOtpVerification = () => (
        <div className="space-y-6">
            <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="font-bold text-2xl mb-2">Check Your Email</h2>
                <p className="text-muted-foreground text-sm">
                    We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                </p>
            </div>

            <div className="flex justify-center">
                <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>

            <Button
                className="w-full bg-[#1a365d] hover:bg-[#2d4a7c] text-white"
                disabled={isLoading || otpCode.length !== 6}
                onClick={handleVerifyOtp}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                    </>
                ) : (
                    'Verify Code'
                )}
            </Button>

            <div className="text-center">
                <Button
                    type="button"
                    variant="link"
                    className="text-sm"
                    onClick={() => {
                        setOtpCode('');
                        handleMagicLink({ preventDefault: () => { } } as React.FormEvent);
                    }}
                    disabled={isLoading}
                >
                    Didn't receive the code? Resend
                </Button>
            </div>

            <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                    setMode('signin');
                    setOtpSent(false);
                    setOtpCode('');
                }}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
            </Button>
        </div>
    );

    const renderForgotPassword = () => (
        <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-6">
                <h2 className="font-bold text-2xl mb-2">Reset Password</h2>
                <p className="text-muted-foreground text-sm">
                    Enter your email and we'll send you a reset link
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="resetEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-[#1a365d] hover:bg-[#2d4a7c] text-white"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    'Send Reset Link'
                )}
            </Button>

            <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setMode('signin')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
            </Button>
        </form>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#1a365d]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

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

                    {mode === 'verify-otp' ? (
                        renderOtpVerification()
                    ) : mode === 'magic-link' ? (
                        renderMagicLinkForm()
                    ) : mode === 'forgot-password' ? (
                        renderForgotPassword()
                    ) : (
                        <>
                            <div className="text-center mb-6">
                                <h1 className="font-bold text-3xl mb-2">
                                    {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                                </h1>
                                <p className="text-muted-foreground">
                                    {mode === 'signup'
                                        ? 'Join VERITUS INTERNATIONAL today'
                                        : 'Sign in to VERITUS INTERNATIONAL'
                                    }
                                </p>
                            </div>

                            <Tabs value={mode} onValueChange={(v) => setMode(v as AuthMode)} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                                </TabsList>
                                <TabsContent value="signin">
                                    {renderSignInForm()}
                                </TabsContent>
                                <TabsContent value="signup">
                                    {renderSignUpForm()}
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
