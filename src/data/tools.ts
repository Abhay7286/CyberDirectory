// src/data/tools.ts
import { supabase } from "@/lib/supabase";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  created_at: string;
  type: "Free" | "Open Source" | "Paid" | "Freemium";
  trust_score: number;
  github_stars: number;
  website: string;
  github?: string;
  tags: string[];
  last_updated: string;
  submitted_by: string; // User ID of the creator
  votes: number;
  related_tools: string[];
  logo_url?: string;
  featured: boolean; // Indicates if the tool is featured
  average_rating?: number; // Optional average rating
  total_reviews?: number; // Optional total reviews count
}

// Add this interface near your other type definitions
export interface VoteHistory {
  tool_id: string;
  tool_name: string;
  tool_category: string;
  tool_type: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
  comment?: string;
}

export const fetchVotingHistory = async (userId: string): Promise<VoteHistory[]> => {
  console.log("[BACKEND DEBUG] Fetching for user:", userId);

  const { data, error } = await supabase
    .from('tool_votes')
    .select(`
      tool_id,
      vote_type,
      created_at,
      comment,
      tools!tool_votes_tool_id_fkey(name, category, type)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  console.log("[BACKEND DEBUG] Raw response:", { data, error });

  if (error) {
    console.error('[BACKEND DEBUG] Full error:', {
      message: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }

  const processedData = data.map(vote => {
    console.log("[BACKEND DEBUG] Processing vote:", {
      id: vote.tool_id,
      hasTools: !!vote.tools,
      toolName: vote.tools[0]?.name
    });
    return {
      tool_id: vote.tool_id,
      tool_name: vote.tools[0]?.name,
      tool_category: vote.tools[0]?.category,
      tool_type: vote.tools[0]?.type,
      vote_type: vote.vote_type,
      created_at: vote.created_at,
      comment: vote.comment || undefined
    };
  });

  console.log("[BACKEND DEBUG] Final output:", processedData);
  return processedData;
};

// Supabase operations
export const fetchTools = async (): Promise<Tool[]> => {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select(`
        id,
        name,
        description,
        category,
        type,
        trust_score,
        github_stars,
        website,
        github,
        tags,
        last_updated,
        submitted_by,
        votes,
        related_tools,
        logo_url,
        featured,
        average_rating,
        total_reviews,
        created_at
      `)
      .eq('status', 'approved') 
      .order('trust_score', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
      throw error;
    }

    if (!data) {
      console.warn('No data returned from tools table');
      return [];
    }

    // Transform data to match the Tool interface
    const transformedData = data.map(tool => ({
      ...tool,
      // Ensure arrays are properly initialized
      tags: tool.tags || [],
      relatedTools: tool.related_tools || [],
      // Ensure optional fields are properly handled
      github: tool.github || undefined,
      logoUrl: tool.logo_url || undefined,
      averageRating: tool.average_rating || undefined,
      totalReviews: tool.total_reviews || undefined
    }));

    return transformedData as Tool[];
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    throw error;
  }
};

export const getToolById = async (id: string): Promise<Tool> => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching tool:', error);
    throw error;
  }

  return data as Tool;
};

export const getRelatedTools = async (toolId: string): Promise<Tool[]> => {
  // First get the current tool to find its related tools
  const { data: currentTool, error: currentToolError } = await supabase
    .from('tools')
    .select('relatedTools')
    .eq('id', toolId)
    .single();

  if (currentToolError) {
    console.error('Error fetching current tool:', currentToolError);
    throw currentToolError;
  }

  if (!currentTool?.relatedTools || currentTool.relatedTools.length === 0) {
    return [];
  }

  // Then fetch the related tools
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .in('id', currentTool.relatedTools);

  if (error) {
    console.error('Error fetching related tools:', error);
    throw error;
  }

  return data as Tool[];
};

export const toggleWishlist = async (userId: string, toolId: string, isWishlisted: boolean) => {
  if (isWishlisted) {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('tool_id', toolId);
    return { error };
  } else {
    const { error } = await supabase
      .from('wishlist')
      .insert([{ user_id: userId, tool_id: toolId }]);
    return { error };
  }
};

export const fetchWishlistedTools = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('tool_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }

  return data.map(item => item.tool_id);
};

// Fetch user's voted tools
export const fetchUserVotes = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('tool_votes')
    .select('tool_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user votes:', error);
    return [];
  }

  return data.map(vote => vote.tool_id);
};

export const toggleVote = async (
  userId: string,
  toolId: string,
  comment?: string
): Promise<{ error?: Error; voted?: boolean }> => {
  try {
    // Check if user already voted
    const { data: existingVote, error: fetchError } = await supabase
      .from('tool_votes')
      .select()
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingVote) {
      // Undo vote: delete the existing vote
      const { error: deleteError } = await supabase
        .from('tool_votes')
        .delete()
        .eq('user_id', userId)
        .eq('tool_id', toolId);

      if (deleteError) throw deleteError;

      // Decrement the tool votes count with RPC
      const { error: decError } = await supabase
        .rpc('decrement_votes', { tool_id: toolId });

      if (decError) throw decError;

      return { error: undefined, voted: false };
    } else {
      // Cast a new vote
      const { error: insertError } = await supabase
        .from('tool_votes')
        .insert([{
          user_id: userId,
          tool_id: toolId,
          vote_type: 'upvote',
          comment
        }]);

      if (insertError) throw insertError;

      // Increment votes count with RPC
      const { error: incError } = await supabase
        .rpc('increment_votes', { tool_id: toolId });

      if (incError) throw incError;

      return { error: undefined, voted: true };
    }
  } catch (error) {
    console.error('Toggle vote error:', error);
    return {
      error: error instanceof Error ? error : new Error('Toggle vote failed')
    };
  }
};



