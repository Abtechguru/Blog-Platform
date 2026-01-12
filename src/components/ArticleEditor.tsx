import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

interface ArticleEditorProps {
  onBack: () => void;
  editArticleId?: string;
}

export function ArticleEditor({ onBack, editArticleId }: ArticleEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [featuredImage, setFeaturedImage] = useState('');
  const [publishScheduled, setPublishScheduled] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleContentChange = (value: string) => {
    setContent(value);
    const words = value.trim().split(/\s+/).length;
    setWordCount(words);
    setReadTime(Math.ceil(words / 200)); // Average reading speed
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please add a title before saving');
      return;
    }

    try {
      setIsSaving(true);
      
      const articleData = {
        title,
        excerpt,
        content,
        category: selectedCategory || 'Uncategorized',
        tags,
        image: featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop',
        featured: isFeatured,
        readTime,
        status: 'draft',
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(articleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Draft saved successfully!');
      } else {
        toast.error(data.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a category');
      return;
    }

    try {
      setIsPublishing(true);
      
      const articleData = {
        title,
        excerpt,
        content,
        category: selectedCategory,
        tags,
        image: featuredImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop',
        featured: isFeatured,
        readTime,
        status: 'published',
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-302887ca/articles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(articleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success('Article published successfully!');
        // Reset form
        setTitle('');
        setContent('');
        setExcerpt('');
        setSelectedCategory('');
        setTags([]);
        setFeaturedImage('');
        setIsFeatured(false);
        // Go back to dashboard after short delay
        setTimeout(() => {
          onBack();
        }, 1500);
      } else {
        toast.error(data.error || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('An error occurred while publishing');
    } finally {
      setIsPublishing(false);
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => {} },
    { icon: Italic, label: 'Italic', action: () => {} },
    { icon: Underline, label: 'Underline', action: () => {} },
    { type: 'separator' },
    { icon: Heading1, label: 'Heading 1', action: () => {} },
    { icon: Heading2, label: 'Heading 2', action: () => {} },
    { type: 'separator' },
    { icon: List, label: 'Bullet List', action: () => {} },
    { icon: ListOrdered, label: 'Numbered List', action: () => {} },
    { type: 'separator' },
    { icon: Quote, label: 'Quote', action: () => {} },
    { icon: Code, label: 'Code Block', action: () => {} },
    { icon: Link, label: 'Insert Link', action: () => {} },
    { icon: Image, label: 'Insert Image', action: () => {} },
  ];

  if (showAIAssistant) {
    return <AIContentAssistant onClose={() => setShowAIAssistant(false)} />;
  }

  if (showMediaLibrary) {
    return <MediaLibrary onClose={() => setShowMediaLibrary(false)} />;
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-semibold">New Article</h1>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Autosaved 2 min ago
                </span>
                <span>•</span>
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIAssistant(true)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMediaLibrary(true)}
              className="gap-2"
            >
              <Image className="h-4 w-4" />
              Media
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSaveDraft()} disabled={isSaving}>
              {isSaving ? <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button size="sm" className="bg-[#1a365d] hover:bg-[#2d4a7c]" onClick={() => handlePublish()} disabled={isPublishing}>
              {isPublishing ? <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              {isPublishing ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Editor */}
        <div className="flex-1 px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {!showPreview ? (
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Input
                    placeholder="Article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-4xl font-['Playfair_Display'] font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <Textarea
                    placeholder="Write a compelling excerpt (this will appear in article previews)..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="text-lg text-muted-foreground border-0 px-0 focus-visible:ring-0 resize-none min-h-[80px]"
                  />
                </div>

                <Separator />

                {/* Enhanced AI Toolbar */}
                <Card className="p-2 sticky top-20 z-10 bg-card/95 backdrop-blur-sm">
                  <div className="flex items-center gap-1 flex-wrap">
                    {/* Basic Formatting */}
                    {toolbarButtons.map((button, index) => {
                      if (button.type === 'separator') {
                        return <Separator key={index} orientation="vertical" className="h-6 mx-1" />;
                      }
                      const Icon = button.icon!;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={button.action}
                          className="h-8 w-8 p-0"
                          title={button.label}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      );
                    })}
                    
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    
                    {/* AI Writing Tools */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-400">
                          <Sparkles className="h-4 w-4" />
                          AI Tools
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Improve Writing
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Zap className="h-4 w-4 mr-2" />
                          Simplify Language
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Maximize className="h-4 w-4 mr-2" />
                          Expand Text
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Minimize className="h-4 w-4 mr-2" />
                          Shorten Text
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Paraphrase
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Fix Grammar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Languages className="h-4 w-4 mr-2" />
                          Translate...
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyze Content
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>

                {/* Content Editor */}
                <div>
                  <Textarea
                    placeholder="Start writing your article... Use '/' for commands"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="min-h-[600px] text-lg leading-relaxed border-0 px-0 focus-visible:ring-0 resize-none"
                  />
                </div>

                {/* Helper Text */}
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-6">
                    <span>Press <kbd className="px-2 py-1 bg-muted rounded">Tab</kbd> to indent</span>
                    <span>Press <kbd className="px-2 py-1 bg-muted rounded">/</kbd> for commands</span>
                    <span>Press <kbd className="px-2 py-1 bg-muted rounded">Ctrl+S</kbd> to save</span>
                  </div>
                </div>
              </div>
            ) : (
              // Preview Mode
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <h1 className="font-['Playfair_Display'] text-5xl font-bold mb-4">
                  {title || 'Untitled Article'}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {excerpt || 'No excerpt provided'}
                </p>
                <Separator className="my-8" />
                <div className="whitespace-pre-wrap">
                  {content || 'Start writing to see your preview...'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Settings Panel */}
        {showSettings && (
          <aside className="w-96 border-l border-border bg-card p-6 space-y-6 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
            <div>
              <h3 className="font-semibold text-lg mb-4">Publishing Settings</h3>

              {/* Category */}
              <div className="space-y-2 mb-4">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2 mb-4">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button size="sm" onClick={handleAddTag}>
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-2 mb-4">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                {featuredImage && (
                  <div className="mt-2">
                    <img src={featuredImage} alt="Featured" className="rounded-lg w-full" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Schedule Publishing */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Schedule Publishing</Label>
                  <Switch
                    checked={publishScheduled}
                    onCheckedChange={setPublishScheduled}
                  />
                </div>

                {publishScheduled && (
                  <div className="space-y-2">
                    <Label>Publish Date</Label>
                    <Input type="datetime-local" />
                  </div>
                )}
              </div>

              <Separator />

              {/* SEO Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold">SEO Settings</h4>
                
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    placeholder="Brief description for search engines..."
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    0/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input placeholder="article-url-slug" />
                </div>
              </div>

              <Separator />

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="font-semibold">Advanced Options</h4>
                
                <div className="flex items-center justify-between">
                  <Label>Allow Comments</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Featured Article</Label>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Send Newsletter</Label>
                  <Switch />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}