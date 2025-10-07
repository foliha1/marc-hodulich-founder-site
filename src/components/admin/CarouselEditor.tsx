import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const CarouselEditor = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data } = await supabase
      .from("carousel_slides")
      .select("*")
      .order("display_order");
    if (data) setSlides(data);
  };

  const handleUpdate = async (id: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("carousel_slides")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Slide updated" });
      fetchSlides();
    }
    setLoading(false);
  };

  const handleAddSlide = async () => {
    setLoading(true);
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.display_order)) + 1 : 1;
    
    const { error } = await supabase
      .from("carousel_slides")
      .insert({
        caption: "New Slide",
        subcaption: "Add description",
        image_url: "",
        display_order: nextOrder,
      });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Slide added" });
      fetchSlides();
    }
    setLoading(false);
  };

  const handleDeleteSlide = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("carousel_slides")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Slide deleted" });
      fetchSlides();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddSlide} disabled={loading}>
          Add New Slide
        </Button>
      </div>
      
      {slides.map((slide) => (
        <Card key={slide.id}>
          <CardHeader>
            <CardTitle>Slide {slide.display_order}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Caption</Label>
              <Input
                value={slide.caption}
                onChange={(e) =>
                  setSlides(slides.map((s) => (s.id === slide.id ? { ...s, caption: e.target.value } : s)))
                }
              />
            </div>
            <div>
              <Label>Subcaption</Label>
              <Input
                value={slide.subcaption}
                onChange={(e) =>
                  setSlides(slides.map((s) => (s.id === slide.id ? { ...s, subcaption: e.target.value } : s)))
                }
              />
            </div>
            <ImageUpload
              value={slide.image_url}
              onChange={(url) =>
                setSlides(slides.map((s) => (s.id === slide.id ? { ...s, image_url: url } : s)))
              }
              folder="carousel"
              label="Slide Image"
            />
            <div className="flex gap-2">
              <Button
                onClick={() =>
                  handleUpdate(slide.id, {
                    caption: slide.caption,
                    subcaption: slide.subcaption,
                    image_url: slide.image_url,
                  })
                }
                disabled={loading}
              >
                Save Slide
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteSlide(slide.id)}
                disabled={loading}
              >
                Delete Slide
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
