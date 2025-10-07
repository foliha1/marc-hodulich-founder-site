import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const MovementEditor = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: movementData } = await supabase
      .from("movement_content")
      .select("*")
      .single();
    if (movementData) setContent(movementData);
  };

  const handleSave = async () => {
    if (!content) return;
    setLoading(true);
    const { error } = await supabase
      .from("movement_content")
      .update({
        title: content.title,
        description: content.description,
        video_url: content.video_url,
        video_link_url: content.video_link_url,
        quote: content.quote,
        quote_author: content.quote_author,
        profile_image_url: content.profile_image_url,
      })
      .eq("id", content.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Content updated" });
    }
    setLoading(false);
  };

  if (!content) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Movement Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Movement Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title}
              onChange={(e) => setContent({ ...content, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description}
              onChange={(e) => setContent({ ...content, description: e.target.value })}
              rows={4}
            />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input
              value={content.video_url}
              onChange={(e) => setContent({ ...content, video_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Video Link URL</Label>
            <Input
              value={content.video_link_url}
              onChange={(e) => setContent({ ...content, video_link_url: e.target.value })}
            />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            Save Content
          </Button>
        </CardContent>
      </Card>

      {/* Quote Section Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Quote</Label>
            <Textarea
              value={content.quote}
              onChange={(e) => setContent({ ...content, quote: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Quote Author</Label>
            <Input
              value={content.quote_author}
              onChange={(e) => setContent({ ...content, quote_author: e.target.value })}
            />
          </div>
          <div>
            <Label>Profile Image</Label>
            {content.profile_image_url && (
              <div className="mt-2 mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={content.profile_image_url}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <p className="text-sm text-muted-foreground">
                    Circular crop preview (as shown on frontend)
                  </p>
                </div>
              </div>
            )}
            <ImageUpload
              value={content.profile_image_url}
              onChange={(url) => setContent({ ...content, profile_image_url: url })}
              folder="movement"
              label=""
            />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            Save Quote Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
