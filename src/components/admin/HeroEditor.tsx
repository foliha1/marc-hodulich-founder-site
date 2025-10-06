import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const HeroEditor = () => {
  const [data, setData] = useState({
    id: "",
    title: "",
    description: "",
    subtitle: "",
    background_image_url: "",
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
        <div>
          <Label>Background Image URL</Label>
          <Input
            value={data.background_image_url}
            onChange={(e) => setData({ ...data, background_image_url: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
