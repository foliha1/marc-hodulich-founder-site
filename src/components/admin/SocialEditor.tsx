import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const SocialEditor = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: postsData } = await supabase
      .from("social_posts")
      .select("*")
      .order("display_order");
    const { data: linksData } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order");
    if (postsData) setPosts(postsData);
    if (linksData) setLinks(linksData);
  };

  const handleUpdatePost = async (id: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("social_posts")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Post updated" });
      fetchData();
    }
    setLoading(false);
  };

  const handleUpdateLink = async (id: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("social_links")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Link updated" });
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Social Posts</h3>
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <CardTitle>Post {post.display_order}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUpload
                  value={post.image_url}
                  onChange={(url) =>
                    setPosts(posts.map((p) => (p.id === post.id ? { ...p, image_url: url } : p)))
                  }
                  folder="social"
                  label="Post Image"
                />
                <div>
                  <Label>Alt Text</Label>
                  <Input
                    value={post.alt_text}
                    onChange={(e) =>
                      setPosts(posts.map((p) => (p.id === post.id ? { ...p, alt_text: e.target.value } : p)))
                    }
                  />
                </div>
                <Button
                  onClick={() =>
                    handleUpdatePost(post.id, {
                      image_url: post.image_url,
                      alt_text: post.alt_text,
                    })
                  }
                  disabled={loading}
                >
                  Save Post
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        <div className="space-y-6">
          {links.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle>{link.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={link.name}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, name: e.target.value } : l)))
                    }
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) =>
                      setLinks(links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)))
                    }
                  />
                </div>
                <Button
                  onClick={() =>
                    handleUpdateLink(link.id, {
                      name: link.name,
                      url: link.url,
                    })
                  }
                  disabled={loading}
                >
                  Save Link
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
