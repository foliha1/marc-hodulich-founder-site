import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Plus, Download } from "lucide-react";
import { extractYouTubeId, getYouTubeThumbnail } from "@/utils/youtube";

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

  const handleFetchThumbnail = (id: string, youtubeUrl: string) => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (videoId) {
      const thumbnailUrl = getYouTubeThumbnail(videoId);
      setPodcasts(podcasts.map((p) => 
        p.id === id ? { ...p, thumbnail_url: thumbnailUrl } : p
      ));
      toast({ title: "Success", description: "Thumbnail fetched from YouTube" });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Invalid YouTube URL" });
    }
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

  const handleAddPodcast = async () => {
    setLoading(true);
    const nextOrder = podcasts.length > 0 ? Math.max(...podcasts.map(p => p.display_order)) + 1 : 1;
    
    const { error } = await supabase
      .from("podcasts")
      .insert({
        title: "New Podcast",
        description: "",
        thumbnail_url: "",
        podcast_url: "",
        display_order: nextOrder,
      });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Podcast added" });
      fetchPodcasts();
    }
    setLoading(false);
  };

  const handleDeletePodcast = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("podcasts")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Podcast deleted" });
      fetchPodcasts();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Button onClick={handleAddPodcast} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Podcast
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {podcasts.map((podcast) => (
        <Card key={podcast.id} className="h-full">
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
              <Label>YouTube URL</Label>
              <div className="flex gap-2">
                <Input
                  value={podcast.podcast_url}
                  onChange={(e) =>
                    setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, podcast_url: e.target.value } : p)))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleFetchThumbnail(podcast.id, podcast.podcast_url)}
                  disabled={!podcast.podcast_url}
                  title="Fetch thumbnail from YouTube"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ImageUpload
              value={podcast.thumbnail_url}
              onChange={(url) =>
                setPodcasts(podcasts.map((p) => (p.id === podcast.id ? { ...p, thumbnail_url: url } : p)))
              }
              folder="podcasts"
              label="Thumbnail (auto-fetched or custom)"
            />
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleUpdate(podcast.id, {
                    title: podcast.title,
                    thumbnail_url: podcast.thumbnail_url,
                    podcast_url: podcast.podcast_url,
                  })
                }
                disabled={loading}
              >
                Save Podcast
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeletePodcast(podcast.id)}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};
