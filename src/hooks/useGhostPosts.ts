import { useQuery } from "@tanstack/react-query";
import { ghost } from "@/lib/ghost";

export const useGhostPosts = () => {
  return useQuery({
    queryKey: ["ghost-posts"],
    queryFn: async () => {
      const res = await ghost.posts
        .browse({ limit: 50 })
        .include({ authors: true, tags: true })
        .fetch();
      if (!res.success) {
        throw new Error(res.errors.map((e) => e.message).join(", "));
      }
      return res.data;
    },
  });
};

export const useGhostPost = (slug?: string) => {
  return useQuery({
    queryKey: ["ghost-post", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await ghost.posts
        .read({ slug: slug as string })
        .include({ authors: true, tags: true })
        .fetch();
      if (!res.success) {
        throw new Error(res.errors.map((e) => e.message).join(", "));
      }
      return res.data;
    },
  });
};
