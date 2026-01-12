import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import {
  Search,
  Grid3x3,
  List,
  Upload,
  Filter,
  SortAsc,
  Image as ImageIcon,
  Video,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  Eye,
  X,
  Check,
  Sparkles,
  Wand2,
  Crop,
  Palette,
  Type,
  Layers,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Slider } from './ui/slider';
import { Label } from './ui/label';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  name: string;
  size: string;
  uploadDate: string;
  usageCount: number;
  aiAltText?: string;
}

interface MediaLibraryProps {
  onClose?: () => void;
}

export function MediaLibrary({ onClose }: MediaLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock media data
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      name: 'ai-technology.jpg',
      size: '2.4 MB',
      uploadDate: '2026-01-10',
      usageCount: 3,
      aiAltText: 'Abstract digital art showing artificial intelligence concept with neural networks',
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      name: 'space-technology.jpg',
      size: '1.8 MB',
      uploadDate: '2026-01-09',
      usageCount: 5,
      aiAltText: 'Earth from space with technological overlay and connection lines',
    },
    {
      id: '3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      name: 'modern-workspace.jpg',
      size: '3.1 MB',
      uploadDate: '2026-01-08',
      usageCount: 2,
      aiAltText: 'Clean modern workspace with laptop and minimalist design',
    },
    {
      id: '4',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&h=300&fit=crop',
      name: 'intro-video.mp4',
      size: '24.5 MB',
      uploadDate: '2026-01-07',
      usageCount: 1,
    },
    {
      id: '5',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
      name: 'data-analytics.jpg',
      size: '2.2 MB',
      uploadDate: '2026-01-06',
      usageCount: 4,
      aiAltText: 'Data visualization dashboard with charts and graphs on screen',
    },
    {
      id: '6',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
      name: 'team-collaboration.jpg',
      size: '1.9 MB',
      uploadDate: '2026-01-05',
      usageCount: 6,
      aiAltText: 'Business team collaborating around a table with laptops',
    },
  ];

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const openEditor = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowEditor(true);
  };

  // Image Editor Component
  const ImageEditor = ({ media }: { media: MediaItem }) => {
    const [brightness, setBrightness] = useState([100]);
    const [contrast, setContrast] = useState([100]);
    const [saturation, setSaturation] = useState([100]);
    const [rotation, setRotation] = useState(0);

    return (
      <div className="fixed inset-0 bg-background/98 z-50 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Editor Header */}
          <div className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setShowEditor(false)}>
                  <X className="h-5 w-5" />
                </Button>
                <div>
                  <h3 className="font-semibold">{media.name}</h3>
                  <p className="text-sm text-muted-foreground">Image Editor</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="gap-2">
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Left Toolbar */}
            <div className="w-20 border-r border-border bg-card flex flex-col items-center py-4 gap-2">
              <Button variant="ghost" size="icon" className="w-12 h-12 flex-col gap-1">
                <Crop className="h-5 w-5" />
                <span className="text-[10px]">Crop</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 flex-col gap-1">
                <Palette className="h-5 w-5" />
                <span className="text-[10px]">Adjust</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 flex-col gap-1">
                <Layers className="h-5 w-5" />
                <span className="text-[10px]">Filters</span>
              </Button>
              <Button variant="ghost" size="icon" className="w-12 h-12 flex-col gap-1">
                <Type className="h-5 w-5" />
                <span className="text-[10px]">Text</span>
              </Button>
              <Separator className="my-2 w-10" />
              <Button variant="ghost" size="icon" className="w-12 h-12 flex-col gap-1">
                <Wand2 className="h-5 w-5" />
                <span className="text-[10px]">AI</span>
              </Button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center bg-muted/20 p-8">
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={media.url}
                  alt={media.name}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{
                    filter: `brightness(${brightness[0]}%) contrast(${contrast[0]}%) saturate(${saturation[0]}%)`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                />
              </div>
            </div>

            {/* Right Panel - AI Tools */}
            <div className="w-80 border-l border-border bg-card">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI Enhancements
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                        <Wand2 className="h-4 w-4" />
                        <span className="text-xs">Auto-Enhance</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                        <Layers className="h-4 w-4" />
                        <span className="text-xs">Remove BG</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-xs">Upscale</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1">
                        <Crop className="h-4 w-4" />
                        <span className="text-xs">Smart Crop</span>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Adjustments</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <Label className="text-sm">Brightness</Label>
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
                          <Label className="text-sm">Contrast</Label>
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
                          <Label className="text-sm">Saturation</Label>
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
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-4">Filters</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {['Original', 'Vivid', 'B&W', 'Sepia', 'Vintage', 'Cool'].map((filter) => (
                        <button
                          key={filter}
                          className="aspect-square rounded-lg border-2 border-border hover:border-primary transition-colors overflow-hidden relative group"
                        >
                          <img src={media.url} alt={filter} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{filter}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-['Playfair_Display'] text-2xl font-bold">Media Library</h2>
                <p className="text-sm text-muted-foreground">Manage all your media assets</p>
              </div>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SortAsc className="h-4 w-4" />
            </Button>
            <div className="flex border border-border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.length > 0 && (
          <div className="border-b border-border bg-muted/50 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Media Grid/List */}
            <div className="flex-1 overflow-y-auto p-6">
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="all">All Media</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="videos">Videos</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="m-0">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {mediaItems.map((item) => (
                        <Card
                          key={item.id}
                          className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedMedia(item)}
                        >
                          <div className="relative aspect-square">
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="icon" variant="secondary" onClick={(e) => {
                                e.stopPropagation();
                                openEditor(item);
                              }}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="secondary">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button size="icon" variant="secondary">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {/* Checkbox */}
                            <div className="absolute top-2 left-2" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedItems.includes(item.id)}
                                onCheckedChange={() => toggleSelection(item.id)}
                                className="bg-white data-[state=checked]:bg-primary"
                              />
                            </div>
                            {/* Type Badge */}
                            <Badge className="absolute top-2 right-2">
                              {item.type === 'video' ? <Video className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                            </Badge>
                            {/* Usage Count */}
                            {item.usageCount > 0 && (
                              <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                                Used {item.usageCount}x
                              </Badge>
                            )}
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.size}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {mediaItems.map((item) => (
                        <Card
                          key={item.id}
                          className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedMedia(item)}
                        >
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => toggleSelection(item.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.uploadDate} • {item.size}
                              </p>
                            </div>
                            <Badge variant="secondary">Used {item.usageCount}x</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  openEditor(item);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Sidebar - Details */}
            {selectedMedia && !showEditor && (
              <div className="w-96 border-l border-border bg-card">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Details</h3>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedMedia(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Large Preview */}
                    <div className="aspect-video rounded-lg overflow-hidden border border-border">
                      <img
                        src={selectedMedia.url}
                        alt={selectedMedia.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* File Info */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <Label className="text-muted-foreground">File Name</Label>
                        <p className="font-medium mt-1">{selectedMedia.name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">File Size</Label>
                        <p className="font-medium mt-1">{selectedMedia.size}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Upload Date</Label>
                        <p className="font-medium mt-1">{new Date(selectedMedia.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Times Used</Label>
                        <p className="font-medium mt-1">{selectedMedia.usageCount} articles</p>
                      </div>
                    </div>

                    <Separator />

                    {/* AI Alt Text */}
                    {selectedMedia.aiAltText && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <Label>AI-Generated Alt Text</Label>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {selectedMedia.aiAltText}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Regenerate
                        </Button>
                      </div>
                    )}

                    <Separator />

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={() => openEditor(selectedMedia)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Image
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Editor Modal */}
      {showEditor && selectedMedia && (
        <ImageEditor media={selectedMedia} />
      )}
    </>
  );
}
