import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const PodcastsEditor = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    const { data } = await supabase
      .from("podcasts")
      .select("*")
      .order("display_order");
    if (data) setPodcasts(data);
  };

  const handleUpdate = async (id: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("podcasts")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Podcast updated" });
      fetchPodcasts();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {podcasts.map((podcast) => (
        <Card key={podcast.id}>
          <CardHeader>
            <CardTitle>Podcast {podcast.display_order}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={podcast.title}
                onChange={(e) =>
                  setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, title: e.target.value } : p)))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={podcast.description}
                onChange={(e) =>
                  setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, description: e.target.value } : p)))
                }
                rows={3}
              />
            </div>
            <ImageUpload
              value={podcast.thumbnail_url}
              onChange={(url) =>
                setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, thumbnail_url: url } : p)))
              }
              folder="podcasts"
              label="Podcast Thumbnail"
            />
            <div>
              <Label>Podcast URL</Label>
              <Input
                value={podcast.podcast_url}
                onChange={(e) =>
                  setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, podcast_url: e.target.value } : p)))
                }
              />
            </div>
            <Button
              onClick={() =>
                handleUpdate(podcast.id, {
                  title: podcast.title,
                  description: podcast.description,
                  thumbnail_url: podcast.thumbnail_url,
                  podcast_url: podcast.podcast_url,
                })
              }
              disabled={loading}
            >
              Save Podcast
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
