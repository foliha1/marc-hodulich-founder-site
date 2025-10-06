import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const MovementEditor = () => {
  const [data, setData] = useState<any>(null);
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
    if (movementData) setData(movementData);
  };

  const handleSave = async () => {
    if (!data) return;
    setLoading(true);
    const { error } = await supabase
      .from("movement_content")
      .update({
        title: data.title,
        description: data.description,
        video_url: data.video_url,
        video_link_url: data.video_link_url,
        quote: data.quote,
        quote_author: data.quote_author,
        profile_image_url: data.profile_image_url,
      })
      .eq("id", data.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Movement section updated" });
    }
    setLoading(false);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movement Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={4}
          />
        </div>
        <div>
          <Label>Video URL</Label>
          <Input
            value={data.video_url}
            onChange={(e) => setData({ ...data, video_url: e.target.value })}
          />
        </div>
        <div>
          <Label>Video Link URL</Label>
          <Input
            value={data.video_link_url}
            onChange={(e) => setData({ ...data, video_link_url: e.target.value })}
          />
        </div>
        <div>
          <Label>Quote</Label>
          <Textarea
            value={data.quote}
            onChange={(e) => setData({ ...data, quote: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label>Quote Author</Label>
          <Input
            value={data.quote_author}
            onChange={(e) => setData({ ...data, quote_author: e.target.value })}
          />
        </div>
        <div>
          <Label>Profile Image URL</Label>
          <Input
            value={data.profile_image_url}
            onChange={(e) => setData({ ...data, profile_image_url: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
