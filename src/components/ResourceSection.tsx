import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure your supabase client is properly exported
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Search,
    Filter,
    ExternalLink,
    Star,
    ChevronDown,
    ChevronUp,
    FileText,
    Video,
    Code,
    Book,
    Lightbulb,
    AlertCircle,
} from 'lucide-react';

type Resource = {
    id: string;
    title: string;
    description: string;
    author: string;
    created_at: string;
    type: 'poc' | 'blog' | 'video' | 'repository' | 'documentation' | string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | string;
    github_stars?: number;
    tags: string[];
    url: string;
};

interface ResourcesSectionProps {
    toolId: string;
}

const ResourcesSection = ({ toolId }: ResourcesSectionProps) => {
    const [allResources, setAllResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('date');
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data, error } = await supabase
                    .from('resources')
                    .select('*')
                    .eq('tool_id', toolId);

                if (error) throw error;
                if (data) {
                    setAllResources(data);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load resources');
            } finally {
                setLoading(false);
            }
        };

        if (toolId) {
            fetchResources();
        }
    }, [toolId]);

    // Filter, search, and sort logic
    const filteredResources = allResources
        .filter((resource) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                resource.title.toLowerCase().includes(query) ||
                resource.description.toLowerCase().includes(query) ||
                resource.author.toLowerCase().includes(query);

            const matchesType = filterType === 'all' || resource.type === filterType;
            const matchesDifficulty =
                filterDifficulty === 'all' || resource.difficulty === filterDifficulty;

            return matchesSearch && matchesType && matchesDifficulty;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'difficulty': {
                    const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
                    return (difficultyOrder[a.difficulty] ?? 3) - (difficultyOrder[b.difficulty] ?? 3);
                }
                case 'stars':
                    return (b.github_stars || 0) - (a.github_stars || 0);
                default:
                    return 0;
            }
        });

    // Helpers for icons and styles
    const getResourceIcon = (type: Resource['type']) => {
        const iconClass = 'h-4 w-4 mr-1';
        switch (type) {
            case 'poc':
                return <Code className={iconClass} />;
            case 'blog':
                return <FileText className={iconClass} />;
            case 'video':
                return <Video className={iconClass} />;
            case 'repository':
                return <Star className={iconClass} />;
            case 'documentation':
                return <Book className={iconClass} />;
            default:
                return <FileText className={iconClass} />;
        }
    };

    const getDifficultyColor = (difficulty: Resource['difficulty']) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getTypeLabel = (type: Resource['type']) => {
        switch (type) {
            case 'poc':
                return 'Proof of Concept';
            case 'blog':
                return 'Blog';
            case 'video':
                return 'Video Tutorial';
            case 'repository':
                return 'Repository';
            case 'documentation':
                return 'Documentation';
            default:
                return type;
        }
    };

    // Main render logic for loading, error states, and content
    if (loading) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                    Loading resources...
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-destructive">{error}</CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 sm:gap-0">
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-xl sm:text-2xl font-bold py-2 px-3 h-auto w-full sm:w-auto truncate">
                            Resources & POCs {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                    </CollapsibleTrigger>
                    <Badge variant="secondary" className="whitespace-nowrap">
                        {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                    </Badge>
                </div>
                <CollapsibleContent className="space-y-6 w-full">
                    {/* Beginner Tips */}
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 w-full">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                                        Beginner Tips
                                    </h4>
                                    <ul className="text-xs sm:text-sm space-y-1 text-blue-800 dark:text-blue-200 list-disc list-inside">
                                        <li>Start with "beginner" difficulty resources to understand the basics</li>
                                        <li>Watch video tutorials before diving into technical documentation</li>
                                        <li>POCs (Proof of Concepts) show practical applications of the tool</li>
                                        <li>Check the repository stars to gauge community popularity</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Search and Filters */}
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 w-full text-sm sm:text-base">
                                <Filter className="h-5 w-5" /> Search & Filter Resources
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-3 w-full">
                                <div className="flex-1 w-full">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search resources..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 w-full"
                                        />
                                    </div>
                                </div>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="blog">Blog</SelectItem>
                                        <SelectItem value="poc">POC</SelectItem>
                                        <SelectItem value="video">Videos</SelectItem>
                                        <SelectItem value="repository">Repositories</SelectItem>
                                        <SelectItem value="documentation">Documentation</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                                    <SelectTrigger className="w-full md:w-40">
                                        <SelectValue placeholder="Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Levels</SelectItem>
                                        <SelectItem value="beginner">Beginner</SelectItem>
                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                        <SelectItem value="advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-full md:w-32">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date">Latest</SelectItem>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="difficulty">Difficulty</SelectItem>
                                        <SelectItem value="stars">Stars</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Resources List */}
                    <div className="space-y-4 w-full">
                        {filteredResources.length === 0 ? (
                            <Card className="w-full">
                                <CardContent className="p-8 text-center w-full">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredResources.map((resource) => (
                                <Card key={resource.id} className="w-full hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center w-full gap-4">
                                        <div className="flex flex-col gap-2 w-full sm:w-3/4">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                {getResourceIcon(resource.type)}
                                                <Badge variant="secondary" className="mr-1 whitespace-nowrap">
                                                    {getTypeLabel(resource.type)}
                                                </Badge>
                                                <h3 className="font-semibold text-lg truncate">{resource.title}</h3>
                                            </div>
                                            {resource.description && (
                                                <p className="text-muted-foreground mb-1 text-sm sm:text-base">{resource.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 items-center mb-2">
                                                <Badge variant="outline" className={getDifficultyColor(resource.difficulty)}>
                                                    {resource.difficulty}
                                                </Badge>
                                                {resource.github_stars != null && (
                                                    <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                                                        <Star className="h-3 w-3" /> {resource.github_stars}
                                                    </Badge>
                                                )}
                                                {resource.tags &&
                                                    resource.tags.slice(0, 3).map((tag) => (
                                                        <Badge key={tag} variant="outline" className="text-xs sm:text-sm">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                {resource.tags && resource.tags.length > 3 && (
                                                    <Badge variant="outline" className="text-xs sm:text-sm whitespace-nowrap">
                                                        +{resource.tags.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                            {/* <div className="text-xs sm:text-sm text-muted-foreground truncate">
                                                By <span className="font-medium">{resource.author}</span> • {new Date(resource.created_at).toLocaleDateString()}
                                            </div> */}
                                        </div>
                                        <div className="flex flex-col justify-center items-end w-full sm:w-1/4">
                                            <Button onClick={() => window.open(resource.url, '_blank')} className="w-full sm:w-auto" size="sm">
                                                <ExternalLink className="h-4 w-4 mr-2" /> View Resource
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>

    );
};

export default ResourcesSection;
