import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { Tool } from "@/data/tools";
import { Star, ExternalLink, X, Plus, Search } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const Comparison = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch tools from Supabase
    const fetchTools = useCallback(async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.from("tools").select("*");

        if (error) {
            console.error(error);
            setError("Failed to load tools.");
            setLoading(false);
            return;
        }

        setAllTools(data || []);
        setLoading(false);
    }, []);

    // Fetch tools once
    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

    // 2. Sync selected tools with URL params
    useEffect(() => {
        if (!allTools.length) return;

        const ids = searchParams.get("tools")?.split(",") || [];
        const selected = allTools.filter((tool) => ids.includes(tool.id));
        setSelectedTools(selected);
    }, [searchParams, allTools]);

    // 3. Update URL params when tools change
    const updateUrl = (tools: Tool[]) => {
        const ids = tools.map((t) => t.id).join(",");
        if (ids) setSearchParams({ tools: ids });
        else setSearchParams({});
    };

    // 4. Add a tool
    const handleAddTool = (tool: Tool) => {
        if (selectedTools.length >= 4) return;

        const newSelected = [...selectedTools, tool];
        setSelectedTools(newSelected);
        updateUrl(newSelected);

        setIsAddDialogOpen(false);
    };

    // ----------------------------------------
    // 5. Remove a tool
    // ----------------------------------------
    const handleRemoveTool = (id: string) => {
        const newSelected = selectedTools.filter((t) => t.id !== id);
        setSelectedTools(newSelected);
        updateUrl(newSelected);
    };

    // ----------------------------------------
    // 6. Memoized filtering (optimization)
    // ----------------------------------------
    const filteredTools = useMemo(() => {
        if (!searchTerm) {
            return allTools.filter(
                (tool) => !selectedTools.some((t) => t.id === tool.id)
            );
        }

        return allTools.filter(
            (tool) =>
                !selectedTools.find((t) => t.id === tool.id) &&
                (tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    tool.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, allTools, selectedTools]);

    // Comparison Fields
    const comparisonRows = [
        { label: "Name", getValue: (tool: Tool) => tool.name },
        { label: "Category", getValue: (tool: Tool) => tool.category },
        {
            label: "Rating",
            getValue: (tool: Tool) => (
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{tool.average_rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">
                        ({tool.total_reviews})
                    </span>
                </div>
            ),
        },
        {
            label: "Trust Score",
            getValue: (tool: Tool) =>
                tool.trust_score ? `${tool.trust_score}/100` : "N/A",
        },
        { label: "Votes", getValue: (tool: Tool) => tool.votes.toLocaleString() },
        {
            label: "Featured",
            getValue: (tool: Tool) =>
                tool.featured ? (
                    <Badge variant="default">Yes</Badge>
                ) : (
                    <Badge variant="secondary">No</Badge>
                ),
        },
        {
            label: "Description",
            getValue: (tool: Tool) => (
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {tool.description}
                </p>
            ),
        },
    ];

    // ----------------------------------------
    // Loading & Error Handling
    // ----------------------------------------
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg">
                Loading tools...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
                {error}
            </div>
        );
    }

    // ----------------------------------------
    // MAIN RENDER
    // ----------------------------------------
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">
                                Compare Tools
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Select up to 4 tools to compare side-by-side
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate("/tools")}>
                            Back to Tools
                        </Button>
                    </div>

                    {selectedTools.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                                <p className="text-muted-foreground text-center">
                                    No tools selected for comparison yet
                                </p>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Tools to Compare
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl max-h-[80vh]">
                                        <DialogHeader>
                                            <DialogTitle>Select Tools to Compare</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search tools..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9"
                                                />
                                            </div>
                                            <div className="overflow-y-auto max-h-[50vh] space-y-2">
                                                {filteredTools.map((tool) => (
                                                    <Card
                                                        key={tool.id}
                                                        className="cursor-pointer hover:border-primary transition-colors"
                                                        onClick={() => handleAddTool(tool)}
                                                    >
                                                        <CardContent className="p-4 flex items-center gap-4">
                                                            <div className="flex-1">
                                                                <h3 className="font-semibold">{tool.name}</h3>
                                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                                    {tool.description}
                                                                </p>
                                                            </div>
                                                            <Plus className="h-5 w-5 text-muted-foreground" />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedTools.map((tool) => (
                                    <Badge
                                        key={tool.id}
                                        variant="secondary"
                                        className="px-3 py-2 text-sm flex items-center gap-2"
                                    >
                                        {tool.name}
                                        <button
                                            onClick={() => handleRemoveTool(tool.id)}
                                            className="ml-1 hover:text-destructive transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                                {selectedTools.length < 4 && (
                                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Tool
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[80vh]">
                                            <DialogHeader>
                                                <DialogTitle>Select Tools to Compare</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex flex-col gap-4">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Search tools..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                                <div className="overflow-y-auto max-h-[50vh] space-y-2">
                                                    {filteredTools.map((tool) => (
                                                        <Card
                                                            key={tool.id}
                                                            className="cursor-pointer hover:border-primary transition-colors"
                                                            onClick={() => handleAddTool(tool)}
                                                        >
                                                            <CardContent className="p-4 flex items-center gap-4">
                                                                <div className="flex-1">
                                                                    <h3 className="font-semibold">{tool.name}</h3>
                                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                                        {tool.description}
                                                                    </p>
                                                                </div>
                                                                <Plus className="h-5 w-5 text-muted-foreground" />
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>

                            {/* Desktop Comparison Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[150px] sticky left-0 bg-background">
                                                Feature
                                            </TableHead>
                                            {selectedTools.map((tool) => (
                                                <TableHead key={tool.id} className="text-center min-w-[200px]">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="font-semibold">{tool.name}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                window.open(tool.website, "_blank")
                                                            }
                                                        >
                                                            <ExternalLink className="h-4 w-4 mr-1" />
                                                            Visit
                                                        </Button>
                                                    </div>
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {comparisonRows.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell className="font-medium sticky left-0 bg-background">
                                                    {row.label}
                                                </TableCell>
                                                {selectedTools.map((tool) => (
                                                    <TableCell key={tool.id} className="text-center">
                                                        {row.getValue(tool)}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Comparison Cards */}
                            <div className="md:hidden space-y-4">
                                {selectedTools.map((tool) => (
                                    <Card key={tool.id}>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle>{tool.name}</CardTitle>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveTool(tool.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {comparisonRows.map((row, idx) => (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            {row.label}
                                                        </span>
                                                        <span className="text-sm">{row.getValue(tool)}</span>
                                                    </div>
                                                    {idx < comparisonRows.length - 1 && <Separator className="mt-3" />}
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline"
                                                className="w-full mt-4"
                                                onClick={() => window.open(tool.website, "_blank")}
                                            >
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Visit Website
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Comparison;
