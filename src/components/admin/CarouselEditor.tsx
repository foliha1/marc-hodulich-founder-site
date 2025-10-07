import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { MultipleImageUpload } from "./MultipleImageUpload";

export const CarouselEditor = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [sectionContent, setSectionContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
    fetchSectionContent();
  }, []);

  const fetchSlides = async () => {
    const { data } = await supabase
      .from("carousel_slides")
      .select("*")
      .order("display_order");
    if (data) setSlides(data);
  };

  const fetchSectionContent = async () => {
    const { data } = await supabase
      .from("section_content")
      .select("*")
      .eq("section_name", "failures_firsts")
      .single();
    if (data) setSectionContent(data);
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

  const handleUpdateSection = async () => {
    if (!sectionContent) return;
    setLoading(true);
    const { error } = await supabase
      .from("section_content")
      .update({
        title: sectionContent.title,
        paragraph: sectionContent.paragraph,
      })
      .eq("id", sectionContent.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Section updated" });
      fetchSectionContent();
    }
    setLoading(false);
  };

  const handleMultipleUpload = async (urls: string[]) => {
    setLoading(true);
    const maxOrder = slides.length > 0 ? Math.max(...slides.map(s => s.display_order)) : 0;
    
    const newSlides = urls.map((url, index) => ({
      image_url: url,
      caption: "",
      subcaption: "",
      display_order: maxOrder + index + 1,
    }));

    const { error } = await supabase
      .from("carousel_slides")
      .insert(newSlides);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: `${urls.length} slide(s) added` });
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
      {/* Section Content */}
      {sectionContent && (
        <Card>
          <CardHeader>
            <CardTitle>Failures, Firsts & Foundations Section Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Section Title</Label>
              <Input
                value={sectionContent.title}
                onChange={(e) =>
                  setSectionContent({ ...sectionContent, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Section Paragraph</Label>
              <Textarea
                value={sectionContent.paragraph}
                onChange={(e) =>
                  setSectionContent({ ...sectionContent, paragraph: e.target.value })
                }
                rows={4}
              />
            </div>
            <Button onClick={handleUpdateSection} disabled={loading}>
              Save Section Content
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Multiple Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Add Multiple Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <MultipleImageUpload
            folder="carousel"
            label="Upload multiple images to create slides"
            onUploadComplete={handleMultipleUpload}
          />
        </CardContent>
      </Card>

      {/* Individual Slides */}
      {slides.map((slide) => (
        <Card key={slide.id}>
          <CardHeader>
            <CardTitle>Slide {slide.display_order}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
