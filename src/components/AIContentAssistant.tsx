import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import {
  FileText,
  Upload,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Crop,
  Eraser,
  Maximize,
  Download,
  Tag,
  Hash,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Target,
  Clock,
  Zap,
  X,
  Plus,
  RefreshCw,
  Eye,
  Lightbulb,
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface AIContentAssistantProps {
  onClose?: () => void;
}

export function AIContentAssistant({ onClose }: AIContentAssistantProps) {
  const [activeTab, setActiveTab] = useState('parser');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageEnhanced, setImageEnhanced] = useState(false);
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [compression, setCompression] = useState([85]);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // Document Parser State
  const [documentUploaded, setDocumentUploaded] = useState(false);

  // Metadata Generator State
  const [titleSuggestions] = useState([
    'The Ultimate Guide to AI-Powered Content Creation',
    'How AI is Revolutionizing Digital Publishing in 2026',
    'Mastering AI Tools: A Complete Content Strategy Guide',
  ]);
  const [excerptOptions] = useState([
    'Discover how artificial intelligence is transforming the way we create, edit, and publish content. Learn practical strategies for leveraging AI in your workflow.',
    'From automated text generation to smart image enhancement, AI is reshaping digital content creation. Explore the tools that are changing the game.',
    'Modern content creators need AI-powered tools to stay competitive. This comprehensive guide covers everything you need to know.',
  ]);
  const [suggestedTags] = useState([
    'AI', 'Content Creation', 'Digital Publishing', 'Automation',
    'Machine Learning', 'Productivity', 'Technology', 'Innovation'
  ]);

  // Content Quality Analyzer State
  const [readabilityScore] = useState(72);
  const [grammarIssues] = useState(3);
  const [toneAnalysis] = useState('Professional');
  const [engagementScore] = useState(84);

  const handleFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setDocumentUploaded(true);
          setExtractedText(`# Introduction to AI-Powered Content

Artificial intelligence has fundamentally transformed the landscape of digital content creation. Modern AI tools can now assist with everything from writing and editing to image enhancement and SEO optimization.

## Key Benefits of AI in Content Creation

- **Speed**: Generate drafts in minutes instead of hours
- **Quality**: Consistent, error-free output
- **Scalability**: Handle multiple projects simultaneously
- **Optimization**: Automatic SEO and readability improvements

## Getting Started

To begin leveraging AI in your content workflow, start with these essential tools...`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImageUpload = () => {
    setSelectedImage('https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop');
  };

  const applyEnhancement = () => {
    setImageEnhanced(true);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold">AI Content Assistant</h2>
                <p className="text-sm text-muted-foreground">Powered by advanced AI models</p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b border-border bg-muted/30 px-6">
              <TabsList className="h-12">
                <TabsTrigger value="parser" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Document Parser
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Image Enhancement
                </TabsTrigger>
                <TabsTrigger value="metadata" className="gap-2">
                  <Hash className="h-4 w-4" />
                  Metadata Generator
                </TabsTrigger>
                <TabsTrigger value="quality" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Quality Analyzer
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1">
              {/* Document Parser Tab */}
              <TabsContent value="parser" className="p-6 m-0">
                <div className="max-w-5xl mx-auto space-y-6">
                  {!documentUploaded ? (
                    <Card className="p-12 border-2 border-dashed border-border hover:border-primary/50 transition-colors">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Upload Document</h3>
                        <p className="text-muted-foreground mb-6">
                          Support for PDF, DOCX, TXT, and MD files
                        </p>
                        <Button onClick={handleFileUpload} className="gap-2">
                          <Upload className="h-4 w-4" />
                          Choose File
                        </Button>
                      </div>
                    </Card>
                  ) : null}

                  {isProcessing && (
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center animate-pulse">
                              <Sparkles className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-semibold">Processing with AI...</p>
                              <p className="text-sm text-muted-foreground">
                                Extracting text and preserving formatting
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">{uploadProgress}%</Badge>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Analyzing document structure</span>
                        </div>
                      </div>
                    </Card>
                  )}

                  {documentUploaded && !isProcessing && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Original Document</h3>
                          <Badge className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Processed
                          </Badge>
                        </div>
                        <div className="aspect-[8.5/11] bg-muted rounded-lg flex items-center justify-center">
                          <FileText className="h-20 w-20 text-muted-foreground" />
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pages:</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Words:</span>
                            <span className="font-medium">3,247</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Characters:</span>
                            <span className="font-medium">18,902</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Extracted Content</h3>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export
                          </Button>
                        </div>
                        <ScrollArea className="h-[400px] border border-border rounded-lg p-4">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
                          </div>
                        </ScrollArea>
                        <div className="mt-4 flex gap-2">
                          <Button className="flex-1 gap-2">
                            <Sparkles className="h-4 w-4" />
                            Use as Article
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Reprocess
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Image Enhancement Tab */}
              <TabsContent value="image" className="p-6 m-0">
                <div className="max-w-5xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Image Enhancement Suite</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered image optimization and editing tools
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="batch">Batch Processing</Label>
                      <Switch
                        id="batch"
                        checked={batchProcessing}
                        onCheckedChange={setBatchProcessing}
                      />
                    </div>
                  </div>

                  {!selectedImage ? (
                    <Card className="p-12 border-2 border-dashed">
                      <div className="text-center">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold mb-2">Upload Image</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          JPG, PNG, WEBP up to 10MB
                        </p>
                        <Button onClick={handleImageUpload} className="gap-2">
                          <Upload className="h-4 w-4" />
                          Select Image
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Image Preview */}
                      <div className="lg:col-span-2 space-y-4">
                        <Card className="p-4">
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              style={{
                                filter: imageEnhanced
                                  ? `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`
                                  : 'none',
                              }}
                            />
                            {imageEnhanced && (
                              <Badge className="absolute top-4 right-4 gap-1 bg-green-500">
                                <CheckCircle2 className="h-3 w-3" />
                                Enhanced
                              </Badge>
                            )}
                          </div>
                        </Card>

                        {/* AI Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={applyEnhancement}>
                            <Wand2 className="h-5 w-5" />
                            <span className="text-xs">Auto-Enhance</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                            <Crop className="h-5 w-5" />
                            <span className="text-xs">Smart Crop</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                            <Eraser className="h-5 w-5" />
                            <span className="text-xs">Remove BG</span>
                          </Button>
                          <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                            <Maximize className="h-5 w-5" />
                            <span className="text-xs">Upscale</span>
                          </Button>
                        </div>
                      </div>

                      {/* Enhancement Controls */}
                      <div className="space-y-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-4">Adjustments</h4>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-2">
                                <Label>Brightness</Label>
                                <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
                              </div>
                              <Slider
                                value={brightness}
                                onValueChange={setBrightness}
                                min={0}
                                max={200}
                                step={1}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-2">
                                <Label>Contrast</Label>
                                <span className="text-sm text-muted-foreground">{contrast[0]}%</span>
                              </div>
                              <Slider
                                value={contrast}
                                onValueChange={setContrast}
                                min={0}
                                max={200}
                                step={1}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between mb-2">
                                <Label>Saturation</Label>
                                <span className="text-sm text-muted-foreground">{saturation[0]}%</span>
                              </div>
                              <Slider
                                value={saturation}
                                onValueChange={setSaturation}
                                min={0}
                                max={200}
                                step={1}
                              />
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-semibold mb-4">Compression</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between mb-2">
                                <Label>Quality</Label>
                                <span className="text-sm text-muted-foreground">{compression[0]}%</span>
                              </div>
                              <Slider
                                value={compression}
                                onValueChange={setCompression}
                                min={1}
                                max={100}
                                step={1}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Original:</span>
                              <span className="font-medium">2.4 MB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Optimized:</span>
                              <span className="font-medium text-green-500">892 KB</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h4 className="font-semibold mb-4">AI Alt Text</h4>
                          <div className="space-y-3">
                            <Textarea
                              placeholder="AI-generated alt text will appear here..."
                              value="A modern workspace with a laptop, coffee cup, and notebook on a wooden desk near a window"
                              className="min-h-[80px]"
                            />
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Sparkles className="h-4 w-4" />
                              Regenerate
                            </Button>
                          </div>
                        </Card>

                        <div className="flex gap-2">
                          <Button className="flex-1 gap-2">
                            <Download className="h-4 w-4" />
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setSelectedImage(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Metadata Generator Tab */}
              <TabsContent value="metadata" className="p-6 m-0">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">AI Metadata Generator</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate optimized metadata for your content
                    </p>
                  </div>

                  {/* Title Suggestions */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold">AI-Suggested Titles</h4>
                    </div>
                    <div className="space-y-3">
                      {titleSuggestions.map((title, index) => (
                        <div
                          key={index}
                          className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <p className="flex-1">{title}</p>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                              Use This
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Engagement: {85 + index * 5}%
                            </span>
                            <span>|</span>
                            <span>{title.length} characters</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Generate More
                    </Button>
                  </Card>

                  {/* Excerpt Options */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h4 className="font-semibold">Auto-Generated Excerpts</h4>
                    </div>
                    <div className="space-y-3">
                      {excerptOptions.map((excerpt, index) => (
                        <div
                          key={index}
                          className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
                        >
                          <p className="text-sm mb-2">{excerpt}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {excerpt.length} characters
                            </span>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                              Select
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Tag Recommendations */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-purple-500" />
                      <h4 className="font-semibold">Smart Tag Recommendations</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {suggestedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1"
                        >
                          #{tag}
                          <Plus className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <Input placeholder="Add custom tag..." />
                  </Card>

                  {/* SEO Keywords */}
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold">SEO Keyword Extraction</h4>
                    </div>
                    <div className="space-y-3">
                      {['artificial intelligence', 'content creation', 'digital publishing', 'AI tools'].map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="font-medium">{keyword}</span>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Search Vol: {(1200 - index * 200).toLocaleString()}</Badge>
                            <Badge variant="secondary">Difficulty: {index + 1}/5</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Reading Time & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold">Reading Time</h4>
                      </div>
                      <div className="text-center py-4">
                        <div className="text-4xl font-bold text-primary mb-2">8 min</div>
                        <p className="text-sm text-muted-foreground">Based on 1,600 words</p>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Hash className="h-5 w-5 text-pink-500" />
                        <h4 className="font-semibold">Content Category</h4>
                      </div>
                      <div className="space-y-2">
                        {[
                          { category: 'Technology', confidence: 95 },
                          { category: 'Business', confidence: 72 },
                          { category: 'Innovation', confidence: 68 },
                        ].map((item) => (
                          <div key={item.category} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{item.category}</span>
                              <span className="text-muted-foreground">{item.confidence}%</span>
                            </div>
                            <Progress value={item.confidence} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Quality Analyzer Tab */}
              <TabsContent value="quality" className="p-6 m-0">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Content Quality Analyzer</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-powered analysis of your content quality and readability
                    </p>
                  </div>

                  {/* Overall Score */}
                  <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
                    <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-card border-8 border-primary/20 mb-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{readabilityScore}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-xl mb-2">Good Quality Content</h3>
                    <p className="text-muted-foreground">
                      Your content meets most quality standards
                    </p>
                  </Card>

                  {/* Detailed Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Readability Score */}
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-5 w-5 text-blue-500" />
                        <h4 className="font-semibold">Readability Score</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Flesch-Kincaid</span>
                            <span className="text-sm font-medium">{readabilityScore}/100</span>
                          </div>
                          <Progress value={readabilityScore} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-2">
                            Fairly easy to read (8th-9th grade level)
                          </p>
                        </div>
                        <Separator />
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. sentence length:</span>
                            <span className="font-medium">18 words</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. word length:</span>
                            <span className="font-medium">4.8 characters</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Complex words:</span>
                            <span className="font-medium">12%</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Grammar Check */}
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Grammar Check</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">Minor Issues Found</p>
                              <p className="text-sm text-muted-foreground">{grammarIssues} suggestions</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold">1</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm mb-1">Possible comma splice</p>
                              <p className="text-xs text-muted-foreground">Line 42: Consider adding a comma...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Tone Analysis */}
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold">Tone Analysis</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold mb-1">{toneAnalysis}</div>
                          <p className="text-sm text-muted-foreground">Primary Tone Detected</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['Formal', 'Confident', 'Educational'].map((trait) => (
                            <Badge key={trait} variant="secondary" className="justify-center py-2">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Professional</span>
                              <span className="font-medium">87%</span>
                            </div>
                            <Progress value={87} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Casual</span>
                              <span className="font-medium">23%</span>
                            </div>
                            <Progress value={23} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Technical</span>
                              <span className="font-medium">65%</span>
                            </div>
                            <Progress value={65} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Engagement Prediction */}
                    <Card className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <h4 className="font-semibold">Engagement Prediction</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg">
                          <div className="text-3xl font-bold text-orange-500 mb-1">{engagementScore}%</div>
                          <p className="text-sm text-muted-foreground">Predicted Engagement Rate</p>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Estimated views:</span>
                            <span className="font-medium">12,500 - 18,000</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Avg. read time:</span>
                            <span className="font-medium">5.2 minutes</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Share potential:</span>
                            <span className="font-medium text-green-500">High</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Plagiarism Detection */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h4 className="font-semibold">Plagiarism Detection</h4>
                      </div>
                      <Badge className="bg-green-500">Clear</Badge>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-green-500/10 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-green-700 dark:text-green-400 mb-1">
                          No plagiarism detected
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Your content appears to be original. Scanned against 14 billion web pages.
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button className="flex-1 gap-2">
                      <Download className="h-4 w-4" />
                      Export Report
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Re-analyze
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
