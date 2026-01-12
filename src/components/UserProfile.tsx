import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import {
    ArrowLeft,
    User,
    Mail,
    Bell,
    Shield,
    Settings,
    Camera,
    Loader2,
    Save,
    LogOut,
    BookOpen,
    Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase-client';

interface UserProfileProps {
    onBack: () => void;
    onArticleClick?: (articleId: string) => void;
}

export function UserProfile({ onBack, onArticleClick }: UserProfileProps) {
    const { user, profile, isSubscribed, subscribeToPage, unsubscribeFromPage, signOut, refreshProfile } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');

    // Subscription preferences
    const [weeklyDigest, setWeeklyDigest] = useState(true);
    const [articleUpdates, setArticleUpdates] = useState(true);
    const [exclusiveContent, setExclusiveContent] = useState(true);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name);
            setDisplayName(profile.display_name || '');
            setBio(profile.bio || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        if (!user) return;

        setIsSaving(true);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: fullName,
                    display_name: displayName,
                    bio: bio,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) {
                toast.error('Failed to update profile');
                console.error(error);
            } else {
                toast.success('Profile updated successfully!');
                await refreshProfile();
            }
        } catch (err) {
            toast.error('An error occurred');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubscriptionToggle = async (subscribed: boolean) => {
        setIsLoading(true);

        if (subscribed) {
            const { error } = await subscribeToPage();
            if (error) {
                toast.error('Failed to subscribe');
            } else {
                toast.success('Subscribed to updates!');
            }
        } else {
            const { error } = await unsubscribeFromPage();
            if (error) {
                toast.error('Failed to unsubscribe');
            } else {
                toast.success('Unsubscribed from updates');
            }
        }

        setIsLoading(false);
    };

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out successfully');
        onBack();
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!user) {
        return (
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardContent className="p-12 text-center">
                        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Not Signed In</h2>
                        <p className="text-muted-foreground mb-6">
                            Please sign in to view your profile.
                        </p>
                        <Button onClick={onBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" onClick={onBack} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                {/* Sidebar - Profile Card */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={avatarUrl} alt={fullName} />
                                    <AvatarFallback className="text-2xl bg-[#1a365d] text-white">
                                        {getInitials(fullName || user.email || 'U')}
                                    </AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-[#1a365d] text-white rounded-full hover:bg-[#2d4a7c] transition-colors">
                                    <Camera className="h-4 w-4" />
                                </button>
                            </div>
                            <h2 className="font-bold text-xl mb-1">{displayName || fullName}</h2>
                            <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                            <Badge variant="secondary" className="capitalize">
                                {profile?.role || 'reader'}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">12 articles read</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">5 bookmarks</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Bell className={`h-4 w-4 ${isSubscribed ? 'text-green-500' : 'text-muted-foreground'}`} />
                                <span className="text-sm">
                                    {isSubscribed ? 'Subscribed' : 'Not subscribed'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sign Out */}
                    <Button
                        variant="outline"
                        className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>

                {/* Main Content */}
                <Card>
                    <Tabs defaultValue="profile" className="w-full">
                        <CardHeader>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile" className="gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Profile</span>
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="gap-2">
                                    <Bell className="h-4 w-4" />
                                    <span className="hidden sm:inline">Notifications</span>
                                </TabsTrigger>
                                <TabsTrigger value="security" className="gap-2">
                                    <Shield className="h-4 w-4" />
                                    <span className="hidden sm:inline">Security</span>
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>

                        <CardContent>
                            {/* Profile Tab */}
                            <TabsContent value="profile" className="space-y-6 mt-0">
                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                value={fullName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                                                placeholder="johndoe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={user.email || ''}
                                            disabled
                                            className="bg-muted"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Contact support to change your email address
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            placeholder="Tell us a bit about yourself..."
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-muted-foreground text-right">
                                            {bio.length}/500 characters
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="avatarUrl">Avatar URL</Label>
                                        <Input
                                            id="avatarUrl"
                                            value={avatarUrl}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarUrl(e.target.value)}
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="bg-[#1a365d] hover:bg-[#2d4a7c]"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Notifications Tab */}
                            <TabsContent value="notifications" className="space-y-6 mt-0">
                                <div>
                                    <h3 className="font-semibold mb-4">Page Subscription</h3>
                                    <Card className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium">Subscribe to Updates</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Get notified about new articles and exclusive content
                                                </p>
                                            </div>
                                            <Switch
                                                checked={isSubscribed}
                                                onCheckedChange={handleSubscriptionToggle}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </Card>
                                </div>

                                {isSubscribed && (
                                    <div>
                                        <h3 className="font-semibold mb-4">Email Preferences</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Weekly Digest</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive a summary of the week's best content
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={weeklyDigest}
                                                    onCheckedChange={setWeeklyDigest}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Article Updates</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Get notified when new articles are published
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={articleUpdates}
                                                    onCheckedChange={setArticleUpdates}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Exclusive Content</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Receive access to members-only content
                                                    </p>
                                                </div>
                                                <Switch
                                                    checked={exclusiveContent}
                                                    onCheckedChange={setExclusiveContent}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6 mt-0">
                                <div>
                                    <h3 className="font-semibold mb-4">Account Security</h3>
                                    <div className="space-y-4">
                                        <Card className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Change Password</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Update your password for enhanced security
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Update
                                                </Button>
                                            </div>
                                        </Card>

                                        <Card className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Two-Factor Authentication</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Add an extra layer of security to your account
                                                    </p>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    Enable
                                                </Button>
                                            </div>
                                        </Card>

                                        <Card className="p-4 border-destructive/50">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="font-medium text-destructive">Delete Account</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Permanently delete your account and all data
                                                    </p>
                                                </div>
                                                <Button variant="destructive" size="sm">
                                                    Delete
                                                </Button>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </CardContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
