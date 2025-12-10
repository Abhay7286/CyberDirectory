import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Star, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewSectionProps {
    toolId: string;
}

type SortOption = "newest" | "highest" | "lowest";

const ReviewSection = ({ toolId }: ReviewSectionProps) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [currentUserReview, setCurrentUserReview] = useState<any | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const { user } = useAuth();
    const { toast } = useToast();

    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
        return (
            (parts[0][0] || "").toUpperCase() +
            (parts[parts.length - 1][0] || "").toUpperCase()
        );
    };

    // FETCH REVIEWS + USER NAMES
    const fetchReviews = async () => {
        setLoading(true);

        // Step 1: Fetch reviews
        const { data: reviewsData, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("tool_id", toolId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error loading reviews:", error);
            toast({
                title: "Error loading reviews",
                description: error.message,
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        if (!reviewsData || reviewsData.length === 0) {
            setReviews([]);
            setCurrentUserReview(null);
            setEditingReviewId(null);
            setLoading(false);
            return;
        }

        // Step 2: Fetch matching user profiles
        const userIds = Array.from(new Set(reviewsData.map((r) => r.user_id)));

        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", userIds);

        // Step 3: Merge names into reviews
        const merged = reviewsData.map((review) => {
            const profile = profiles?.find((p) => p.id === review.user_id);
            return {
                ...review,
                user_name: profile?.full_name || "Anonymous",
            };
        });

        setReviews(merged);

        // Step 4: Detect current user review & set editingReviewId
        if (user) {
            const existing = merged.find((r) => r.user_id === user.id) || null;
            setCurrentUserReview(existing);
            setEditingReviewId(existing?.id || null); // IMPORTANT FIX
        } else {
            setCurrentUserReview(null);
            setEditingReviewId(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [toolId]);

    // Editing state handler when user review exists
    useEffect(() => {
        if (currentUserReview) {
            setEditingReviewId(currentUserReview.id);
            setRating(currentUserReview.rating);
            setNewReview(currentUserReview.comment || "");
        } else {
            setEditingReviewId(null);
            setRating(0);
            setNewReview("");
        }
    }, [currentUserReview]);

    // SUBMIT OR EDIT REVIEW
    const handleSubmitReview = async () => {
        if (!user) {
            toast({
                title: "Login required",
                description: "Please login to submit a review.",
                variant: "destructive",
            });
            return;
        }

        if (rating === 0 || !newReview.trim()) {
            toast({
                title: "Missing information",
                description: "Please provide both a rating and a review.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        const reviewId = editingReviewId || currentUserReview?.id;

        if (reviewId) {
            // UPDATE existing review
            const { error } = await supabase
                .from("reviews")
                .update({
                    rating,
                    comment: newReview.trim(),
                })
                .eq("id", reviewId);

            if (error) {
                toast({ title: "Error updating review", variant: "destructive" });
            } else {
                toast({ title: "Review updated!" });
            }
        } else {
            // INSERT new review
            const { error } = await supabase.from("reviews").insert([
                {
                    tool_id: toolId,
                    user_id: user.id,
                    rating,
                    comment: newReview.trim(),
                },
            ]);

            if (error) {
                toast({ title: "Error submitting review", variant: "destructive" });
            } else {
                toast({ title: "Review submitted!" });
            }
        }

        await fetchReviews();
        setIsSubmitting(false);
    };

    // DELETE REVIEW
    const handleDeleteReview = async (id: string) => {
        if (!user) return;
        const target = reviews.find((r) => r.id === id);
        if (!target || target.user_id !== user.id) return;

        const { error } = await supabase.from("reviews").delete().eq("id", id);

        if (error) {
            toast({
                title: "Error deleting review",
                description: error.message,
                variant: "destructive",
            });
        } else {
            toast({ title: "Review deleted" });
            await fetchReviews();
        }
    };

    // STAR RENDER
    const renderStars = (currentRating: number, interactive = false) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 ${interactive ? "cursor-pointer" : ""
                    } ${i < (interactive ? hoveredRating || rating : currentRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                onClick={interactive ? () => setRating(i + 1) : undefined}
                onMouseEnter={interactive ? () => setHoveredRating(i + 1) : undefined}
                onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            />
        ));

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center opacity-70">Loading reviews…</p>
                </CardContent>
            </Card>
        );
    }

    const avg =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const sortedReviews = [...reviews].sort((a, b) => {
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest
    });

    return (
        <div className="space-y-6">

            {/* Review Form */}
            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            {editingReviewId ? "Edit Your Review" : "Write a Review"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div>
                            <label className="text-sm font-medium">Rating</label>
                            <div className="flex items-center gap-1 mt-1">
                                {renderStars(rating, true)}
                            </div>
                        </div>

                        <Textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Share your thoughts…"
                            className="min-h-[100px]"
                        />

                        <div className="flex justify-end gap-2">
                            <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                                {editingReviewId ? "Update Review" : "Submit Review"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Reviews List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                        <CardTitle>Reviews ({reviews.length})</CardTitle>

                        {reviews.length > 0 && (
                            <div className="flex items-center gap-3 text-sm">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Average:</span>
                                    <span>{avg.toFixed(1)}</span>
                                </div>

                                <select
                                    className="border rounded px-2 py-1 text-sm"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="highest">Highest Rating</option>
                                    <option value="lowest">Lowest Rating</option>
                                </select>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {reviews.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                            No reviews yet. Be the first!
                        </p>
                    ) : (
                        sortedReviews.map((review) => (
                            <div key={review.id} className="border rounded p-4 bg-muted/40">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-sm text-primary">
                                            {getInitials(review.user_name)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{review.user_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 min-w-[90px] sm:flex-row sm:items-center">
                                        {/* Stars */}
                                        <div className="flex gap-1">
                                            {renderStars(review.rating)}
                                        </div>

                                        {/* Edit/Delete */}
                                        {review.user_id === user?.id && (
                                            <div className="flex gap-1 flex-wrap justify-end">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() => {
                                                        setEditingReviewId(review.id);
                                                        setRating(review.rating);
                                                        setNewReview(review.comment);
                                                    }}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <p className="mt-3 text-sm text-muted-foreground">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewSection;
