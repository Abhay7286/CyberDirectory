import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
    Plus,
    ChevronDown,
    ChevronUp,
    BookOpen,
    X,
    Trash2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";

interface ResourceFormData {
    tool_id: string;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    url: string;
    github_stars: string;
    tags: string[];
}

interface AddResourceFormProps {
    toolId?: string;
    onSuccess?: () => void;
}

const AddResource = ({ toolId, onSuccess }: AddResourceFormProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resources, setResources] = useState<ResourceFormData[]>([
        {
            tool_id: toolId || "",
            title: "",
            description: "",
            type: "",
            difficulty: "",
            url: "",
            github_stars: "",
            tags: []
        }
    ]);
    const [currentTags, setCurrentTags] = useState<string[]>([""]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    // Update tool_id in all resources when toolId prop changes (important)
    useEffect(() => {
        if (toolId) {
            setResources((prev) =>
                prev.map((res) => ({ ...res, tool_id: toolId }))
            );
        }
    }, [toolId]);

    const resourceTypes = [
        { value: "poc", label: "Proof of Concept" },
        { value: "writeup", label: "Writeup" },
        { value: "video", label: "Video" },
        { value: "repository", label: "Repository" },
        { value: "documentation", label: "Documentation" },
        { value: "blog", label: "Blog" }
    ];

    const difficultyLevels = [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" }
    ];

    const addNewResource = () => {
        setResources([
            ...resources,
            {
                tool_id: toolId || "",
                title: "",
                description: "",
                type: "",
                difficulty: "",
                url: "",
                github_stars: "",
                tags: []
            }
        ]);
        setCurrentTags([...currentTags, ""]);
    };

    const removeResource = (index: number) => {
        if (resources.length > 1) {
            setResources(resources.filter((_, i) => i !== index));
            setCurrentTags(currentTags.filter((_, i) => i !== index));
        }
    };

    const updateResource = (index: number, field: keyof ResourceFormData, value: any) => {
        const newResources = [...resources];
        newResources[index] = { ...newResources[index], [field]: value };
        setResources(newResources);
    };

    const addTag = (resourceIndex: number) => {
        const tagValue = currentTags[resourceIndex];
        if (tagValue?.trim() && !resources[resourceIndex].tags.includes(tagValue.trim())) {
            updateResource(resourceIndex, "tags", [
                ...resources[resourceIndex].tags,
                tagValue.trim()
            ]);
            const newCurrentTags = [...currentTags];
            newCurrentTags[resourceIndex] = "";
            setCurrentTags(newCurrentTags);
        }
    };

    const removeTag = (resourceIndex: number, tagToRemove: string) => {
        const newTags = resources[resourceIndex].tags.filter((tag) => tag !== tagToRemove);
        updateResource(resourceIndex, "tags", newTags);
    };

    const handleKeyPress = (e: React.KeyboardEvent, resourceIndex: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(resourceIndex);
        }
    };

    const updateCurrentTag = (index: number, value: string) => {
        const newCurrentTags = [...currentTags];
        newCurrentTags[index] = value;
        setCurrentTags(newCurrentTags);
    };

    // Submit resources to Supabase
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast({
                title: "Login required",
                description: "Please login to add resources.",
                variant: "destructive"
            });
            return;
        }

        // Validation of resources
        for (let i = 0; i < resources.length; i++) {
            const resource = resources[i];
            if (!resource.title.trim() || !resource.url.trim()) {
                toast({
                    title: "Validation Error",
                    description: `Please fill all required fields for resource ${i + 1}.`,
                    variant: "destructive"
                });
                return;
            }
            try {
                new URL(resource.url);
            } catch {
                toast({
                    title: "Invalid URL",
                    description: `Please enter a valid URL for resource ${i + 1}.`,
                    variant: "destructive"
                });
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const inserts = resources.map((resource) => ({
                tool_id: resource.tool_id,
                title: resource.title.trim(),
                description: resource.description?.trim() || null,
                author: user.id,
                type: resource.type || null,
                difficulty: resource.difficulty || null,
                url: resource.url.trim(),
                github_stars: resource.github_stars ? parseInt(resource.github_stars, 10) : null,
                tags: resource.tags.length > 0 ? resource.tags : []
            }));

            const { error } = await supabase.from("resources").insert(inserts);

            if (error) throw error;

            toast({
                title: "Resources added successfully!",
                description: `${resources.length} resource(s) have been added.`
            });

            // Reset form after success
            setResources([
                {
                    tool_id: toolId || "",
                    title: "",
                    description: "",
                    type: "",
                    difficulty: "",
                    url: "",
                    github_stars: "",
                    tags: []
                }
            ]);
            setCurrentTags([""]);
            setIsOpen(false);
            onSuccess?.();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add resources.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto mt-6">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Add Resources (Optional)
                            </div>
                            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </CardTitle>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="space-y-4 p-4 border rounded-lg relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-medium text-sm text-muted-foreground">
                                            Resource {resourceIndex + 1}
                                        </h4>
                                        {resources.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeResource(resourceIndex)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`resource-title-${resourceIndex}`}>Resource Title *</Label>
                                        <Input
                                            id={`resource-title-${resourceIndex}`}
                                            value={resource.title}
                                            onChange={(e) => updateResource(resourceIndex, "title", e.target.value)}
                                            placeholder="Enter resource title"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`resource-description-${resourceIndex}`}>Description</Label>
                                        <Textarea
                                            id={`resource-description-${resourceIndex}`}
                                            value={resource.description}
                                            onChange={(e) => updateResource(resourceIndex, "description", e.target.value)}
                                            placeholder="Brief description of the resource..."
                                            className="min-h-[80px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`resource-type-${resourceIndex}`}>Type</Label>
                                            <Select
                                                value={resource.type}
                                                onValueChange={(value) => updateResource(resourceIndex, "type", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {resourceTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor={`resource-difficulty-${resourceIndex}`}>Difficulty</Label>
                                            <Select
                                                value={resource.difficulty}
                                                onValueChange={(value) => updateResource(resourceIndex, "difficulty", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select difficulty" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {difficultyLevels.map((level) => (
                                                        <SelectItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor={`resource-url-${resourceIndex}`}>URL *</Label>
                                        <Input
                                            id={`resource-url-${resourceIndex}`}
                                            type="url"
                                            value={resource.url}
                                            onChange={(e) => updateResource(resourceIndex, "url", e.target.value)}
                                            placeholder="https://example.com/resource"
                                            required
                                        />
                                    </div>

                                    {resource.type === "repository" && (
                                        <div className="space-y-2">
                                            <Label htmlFor={`github-stars-${resourceIndex}`}>GitHub Stars</Label>
                                            <Input
                                                id={`github-stars-${resourceIndex}`}
                                                type="number"
                                                value={resource.github_stars}
                                                onChange={(e) => updateResource(resourceIndex, "github_stars", e.target.value)}
                                                placeholder="Enter number of stars"
                                                min="0"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor={`resource-tags-${resourceIndex}`}>Tags</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id={`resource-tags-${resourceIndex}`}
                                                value={currentTags[resourceIndex] || ""}
                                                onChange={(e) => updateCurrentTag(resourceIndex, e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, resourceIndex)}
                                                placeholder="Add a tag and press Enter"
                                                className="flex-1"
                                            />
                                            <Button type="button" onClick={() => addTag(resourceIndex)} variant="outline" size="sm">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {resource.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {resource.tags.map((tag, tagIndex) => (
                                                    <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                                                        {tag}
                                                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(resourceIndex, tag)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {resourceIndex < resources.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}

                            <div className="flex gap-2 items-center justify-between flex-col sm:flex-row">
                                <Button type="button" onClick={addNewResource} variant="outline" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Another Resource
                                </Button>

                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Adding..." : `Add ${resources.length} Resource${resources.length > 1 ? "s" : ""}`}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default AddResource;
