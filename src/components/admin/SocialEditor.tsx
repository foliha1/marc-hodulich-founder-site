import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { MultipleImageUpload } from "./MultipleImageUpload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

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
    const { error } = await supabase.from("social_links").update(updates).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Link updated" });
      fetchData();
    }
    setLoading(false);
  };

  const handleAddPost = async () => {
    setLoading(true);
    const maxOrder = posts.length > 0 ? Math.max(...posts.map(p => p.display_order)) : 0;
    const { error } = await supabase.from("social_posts").insert({ image_url: "", alt_text: "New post", post_type: "uploaded_image", display_order: maxOrder + 1 });
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Post added" });
      fetchData();
    }
    setLoading(false);
  };

  const handleMultipleUpload = async (urls: string[]) => {
    setLoading(true);
    const maxOrder = posts.length > 0 ? Math.max(...posts.map(p => p.display_order)) : 0;
    
    const newPosts = urls.map((url, index) => ({
      post_type: "uploaded_image",
      image_url: url,
      alt_text: "Social post image",
      display_order: maxOrder + index + 1,
    }));

    const { error } = await supabase
      .from("social_posts")
      .insert(newPosts);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: `${urls.length} post(s) added` });
      fetchData();
    }
    setLoading(false);
  };

  const handleDeletePost = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("social_posts").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Post deleted" });
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Multiple Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            folder="social"
            label="Upload multiple images to create posts"
            onUploadComplete={handleMultipleUpload}
          />
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Social Posts</h3>
          <Button onClick={handleAddPost} disabled={loading}><Plus className="mr-2 h-4 w-4" />Add Individual Post</Button>
        </div>
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader><CardTitle>Post {post.display_order}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Post Type</Label>
                  <RadioGroup value={post.post_type} onValueChange={(value) => setPosts(posts.map((p) => p.id === post.id ? { ...p, post_type: value } : p))}>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="uploaded_image" id={`upload-${post.id}`} /><Label htmlFor={`upload-${post.id}`}>Upload Image</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="instagram_embed" id={`instagram-${post.id}`} /><Label htmlFor={`instagram-${post.id}`}>Instagram Post</Label></div>
                  </RadioGroup>
                </div>
                {post.post_type === "uploaded_image" ? (
                  <>
                    <div><Label>Alt Text</Label><Input value={post.alt_text} onChange={(e) => setPosts(posts.map((p) => p.id === post.id ? { ...p, alt_text: e.target.value } : p))} /></div>
                    <ImageUpload value={post.image_url} onChange={(url) => setPosts(posts.map((p) => p.id === post.id ? { ...p, image_url: url } : p))} folder="social" label="Post Image" />
                  </>
                ) : (
                  <div>
                    <Label>Instagram Post URL</Label>
                    <Input 
                      value={post.instagram_url || ""} 
                      onChange={(e) => setPosts(posts.map((p) => p.id === post.id ? { ...p, instagram_url: e.target.value } : p))} 
                      placeholder="https://www.instagram.com/p/POST_ID/" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Supported: https://www.instagram.com/p/POST_ID/ or https://www.instagram.com/reel/REEL_ID/
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdatePost(post.id, { image_url: post.image_url, alt_text: post.alt_text, post_type: post.post_type, instagram_url: post.instagram_url })} disabled={loading}>Save Post</Button>
                  <Button variant="destructive" onClick={() => handleDeletePost(post.id)} disabled={loading}>Delete</Button>
                </div>
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
