import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const HeroEditor = () => {
  const [data, setData] = useState({
    id: "",
    title: "",
    description: "",
    subtitle: "",
    background_image_url: "",
    background_image_width: null as number | null,
    background_image_height: null as number | null,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: heroData } = await supabase
      .from("hero_content")
      .select("*")
      .single();
    if (heroData) setData(heroData);
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("hero_content")
      .update({
        title: data.title,
        description: data.description,
        subtitle: data.subtitle,
        background_image_url: data.background_image_url,
        background_image_width: data.background_image_width,
        background_image_height: data.background_image_height,
      })
      .eq("id", data.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Hero section updated" });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
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
          <Label>Subtitle</Label>
          <Input
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
          />
        </div>
        <ImageUpload
          value={data.background_image_url}
          onChange={(url, dimensions) => 
            setData({ 
              ...data, 
              background_image_url: url,
              background_image_width: dimensions?.width || null,
              background_image_height: dimensions?.height || null,
            })
          }
          folder="hero"
          label="Background Image"
        />
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
