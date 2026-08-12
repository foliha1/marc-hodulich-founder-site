import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Stable, normalized post shape — decoupled from StoryChief's raw schema. */
export interface StoryChiefAuthor {
  name: string;
  avatar?: string | null;
}

export interface StoryChiefPostListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string | null;
  author: StoryChiefAuthor | null;
  tags: string[];
  reading_time?: number | null;
}

export interface StoryChiefPost extends StoryChiefPostListItem {
  content_html: string;
  meta_description?: string | null;
}

interface EdgeFunctionResponse<T> {
  data?: T;
  error?: string;
}

/**
 * Fetch the list of published StoryChief posts via the `storychief-posts`
 * edge function. Cached for 5 minutes by React Query.
 */
export const useStoryChiefPostList = () =>
  useQuery<StoryChiefPostListItem[]>({
    queryKey: ["storychief-posts", "list"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse<StoryChiefPostListItem[]>>(
        "storychief-posts",
        { method: "POST", body: { action: "list" } }
      );
      if (error) throw new Error(error.message);
      if (!data || data.error) throw new Error(data?.error || "Failed to load posts");
      return data.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

/**
 * Fetch a single StoryChief post by slug via the `storychief-posts` edge
 * function. Cached for 10 minutes by React Query.
 */
export const useStoryChiefPost = (slug: string | undefined) =>
  useQuery<StoryChiefPost>({
    queryKey: ["storychief-posts", "post", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Missing post slug");
      const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse<StoryChiefPost>>(
        "storychief-posts",
        { method: "POST", body: { slug } }
      );
      if (error) throw new Error(error.message);
      if (!data || data.error) throw new Error(data?.error || "Post not found");
      if (!data.data) throw new Error("Post not found");
      return data.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
