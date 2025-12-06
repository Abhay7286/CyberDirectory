import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import {
    Plus,
    FolderOpen,
    Lock,
    Globe,
    Search,
    MoreVertical,
    Trash2,
    Share2,
    Edit2,
} from "lucide-react";

import type { Collection, Tool } from "@/data/tools";
import Header from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Collections = () => {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [toolSearchQuery, setToolSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_public: true,
    });

    const [deleteCollectionId, setDeleteCollectionId] = useState<string | null>(null);
    const [editCollectionId, setEditCollectionId] = useState<string | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);


    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Fetch Tools
    const fetchTools = async () => {
        const { data, error } = await supabase.from("tools").select("*");
        if (!error) setAllTools(data || []);
    };

    // Fetch Collections
    const loadCollectionsFromSupabase = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from("collections")
            .select("*")
            .eq("user_id", user.id);

        if (!error) setCollections(data || []);
    };

    useEffect(() => {
        fetchTools();
        loadCollectionsFromSupabase();
    }, [user]);

    // Create Collection
    const handleCreateCollection = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please log in to create collections",
                variant: "destructive",
            });
            return;
        }

        if (!formData.name.trim()) {
            toast({
                title: "Name required",
                description: "Please enter a collection name",
                variant: "destructive",
            });
            return;
        }

        const { error } = await supabase.from("collections").insert({
            user_id: user.id,
            name: formData.name,
            description: formData.description,
            tool_ids: selectedTools,
            is_public: formData.is_public,
        });

        if (error) {
            toast({
                title: "Error",
                description: "Failed to create collection",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Collection created",
            description: `Created with ${selectedTools.length} tool(s).`,
        });

        // Reset state
        setFormData({ name: "", description: "", is_public: true });
        setSelectedTools([]);
        setToolSearchQuery("");
        setIsCreateOpen(false);

        loadCollectionsFromSupabase();
    };

    // Get tools for a collection
    const getCollectionTools = (toolIds: string[]) =>
        allTools.filter((tool) => toolIds.includes(tool.id));

    // Toggle tool selection
    const toggleToolSelection = (toolId: string) => {
        setSelectedTools((prev) =>
            prev.includes(toolId)
                ? prev.filter((id) => id !== toolId)
                : [...prev, toolId]
        );
    };

    // Delete collection
    const handleDeleteCollection = async (id: string) => {
        const { error } = await supabase.from("collections").delete().eq("id", id);

        if (error) {
            toast({
                title: "Error",
                description: "Failed to delete collection",
                variant: "destructive",
            });
            return;
        }

        toast({ title: "Collection deleted", description: "Removed successfully." });
        setDeleteCollectionId(null);
        loadCollectionsFromSupabase();
    };

    const openEditDialog = (collection: Collection) => {
        setEditCollectionId(collection.id);
        setFormData({
            name: collection.name,
            description: collection.description,
            is_public: collection.is_public,
        });
        setSelectedTools(collection.tool_ids);
        setIsEditOpen(true);
    };


    const handleEditSave = async () => {
        if (!editCollectionId) return;

        const { error } = await supabase
            .from("collections")
            .update({
                name: formData.name,
                description: formData.description,
                is_public: formData.is_public,
                tool_ids: selectedTools,
            })
            .eq("id", editCollectionId);

        if (error) {
            toast({
                title: "Failed to update collection",
                variant: "destructive",
            });
            return;
        }

        toast({ title: "Collection updated successfully" });

        setIsEditOpen(false);
        setEditCollectionId(null);
        loadCollectionsFromSupabase();
    };

    // Share collection
    const handleShareCollection = (collection: Collection) => {
        const shareUrl = `${window.location.origin}/collections/${collection.id}`;

        const tools = getCollectionTools(collection.tool_ids);
        const toolNames = tools.map((t) => t.name).join(", ");

        const shareText = `Check out my collection "${collection.name}"\n\n${collection.description}\n\nTools: ${toolNames}\n\n${shareUrl}`;

        if (navigator.share) {
            navigator
                .share({
                    title: collection.name,
                    text: shareText,
                    url: shareUrl,
                })
                .catch(() => copyToClipboard(shareUrl, collection.name));
        } else {
            copyToClipboard(shareUrl, collection.name);
        }
    };

    const copyToClipboard = (url: string, name: string) => {
        navigator.clipboard.writeText(url);
        toast({
            title: "Link copied",
            description: `Share link for "${name}" copied to clipboard`,
        });
    };

    const filteredTools = allTools.filter(
        (tool) =>
            tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-4xl font-bold flex items-center gap-2 sm:gap-3">
                                <FolderOpen className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                Tool Collections
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                Curated lists of cybersecurity tools
                            </p>
                        </div>

                        {/* Create Button */}
                        <Button
                            size="sm"
                            className="w-full sm:w-auto sm:size-default"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Collection
                        </Button>

                    </div>

                    {/* COLLECTION GRID */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {collections.map((collection) => {
                            const tools = getCollectionTools(collection.tool_ids);

                            return (
                                <Card key={collection.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-3 sm:p-6">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base sm:text-xl line-clamp-1">{collection.name}</CardTitle>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleShareCollection(collection)}
                                                    >
                                                        <Share2 className="h-4 w-4 mr-2" />
                                                        Share
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setDeleteCollectionId(collection.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => openEditDialog(collection)}
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <CardDescription className="text-xs sm:text-sm line-clamp-2">
                                            {collection.description}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {tools.length} tools
                                                </span>
                                                <Badge variant="outline">
                                                    {collection.is_public ? "Public" : "Private"}
                                                </Badge>
                                            </div>

                                            {tools.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {tools.slice(0, 3).map((tool) => (
                                                        <Badge key={tool.id} variant="secondary" className="text-xs">
                                                            {tool.name}
                                                        </Badge>
                                                    ))}

                                                    {tools.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{tools.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* EMPTY STATE */}
                    {collections.length === 0 && (
                        <Card className="p-12 text-center">
                            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Create your first collection to organize tools
                            </p>

                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Collection
                            </Button>
                        </Card>
                    )}

                    {/* DELETE CONFIRMATION */}
                    <AlertDialog
                        open={!!deleteCollectionId}
                        onOpenChange={() => setDeleteCollectionId(null)}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Collection</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                    This will permanently delete this collection.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() =>
                                        deleteCollectionId &&
                                        handleDeleteCollection(deleteCollectionId)
                                    }
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* CREATE COLLECTION DIALOG */}
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Collection</DialogTitle>
                                <DialogDescription>
                                    Organize tools into custom collections
                                </DialogDescription>
                            </DialogHeader>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Collection Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Top Red Team Tools"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your collection..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="public">Make Public</Label>
                                    <Switch
                                        id="public"
                                        checked={formData.is_public}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, is_public: checked })
                                        }
                                    />
                                </div>

                                {/* Tool Selection */}
                                <div className="space-y-3">
                                    <Label>Select Tools</Label>

                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search tools..."
                                            value={toolSearchQuery}
                                            onChange={(e) =>
                                                setToolSearchQuery(e.target.value)
                                            }
                                            className="pl-9"
                                        />
                                    </div>

                                    <ScrollArea className="h-[180px] sm:h-[240px] rounded-md border p-2 sm:p-4">
                                        <div className="space-y-3">
                                            {filteredTools.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-4">
                                                    No tools found
                                                </p>
                                            ) : (
                                                filteredTools.map((tool) => (
                                                    <div
                                                        key={tool.id}
                                                        className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                                    >
                                                        <Checkbox
                                                            id={`tool-${tool.id}`}
                                                            checked={selectedTools.includes(tool.id)}
                                                            onCheckedChange={() =>
                                                                toggleToolSelection(tool.id)
                                                            }
                                                        />
                                                        <label
                                                            htmlFor={`tool-${tool.id}`}
                                                            className="flex-1 cursor-pointer space-y-1"
                                                        >
                                                            <p className="text-sm font-medium leading-none">
                                                                {tool.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {tool.description}
                                                            </p>
                                                        </label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </ScrollArea>

                                    {selectedTools.length > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            {selectedTools.length} tool
                                            {selectedTools.length !== 1 ? "s" : ""} selected
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <Button onClick={handleCreateCollection} className="w-full">
                                    Create Collection
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* EDIT COLLECTION DIALOG */}
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Collection</DialogTitle>
                                <DialogDescription>Update your collection details</DialogDescription>
                            </DialogHeader>

                            <Label>Collection Name</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />

                            <Label>Description</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            />

                            <div className="flex items-center justify-between">
                                <Label>Make Public</Label>
                                <Switch
                                    checked={formData.is_public}
                                    onCheckedChange={(v) =>
                                        setFormData({ ...formData, is_public: v })
                                    }
                                />
                            </div>

                            <Label>Select Tools</Label>
                            <Input
                                placeholder="Search tools..."
                                value={toolSearchQuery}
                                onChange={(e) => setToolSearchQuery(e.target.value)}
                            />

                            <ScrollArea className="h-[200px] border rounded p-3">
                                {filteredTools.map((t) => (
                                    <div key={t.id} className="flex items-start gap-2 p-2">
                                        <Checkbox
                                            checked={selectedTools.includes(t.id)}
                                            onCheckedChange={() => toggleToolSelection(t.id)}
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{t.name}</p>
                                            <p className="text-xs text-muted-foreground">{t.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>

                            <Button className="w-full mt-4" onClick={handleEditSave}>
                                Save Changes
                            </Button>
                        </DialogContent>
                    </Dialog>

                </div>
            </main>
        </div>
    );
};

export default Collections;
