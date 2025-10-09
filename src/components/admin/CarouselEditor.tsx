import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { ArrowUp, ArrowDown } from "lucide-react";

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

  const handleMoveUp = async (slideId: string) => {
    const currentSlide = slides.find(s => s.id === slideId);
    if (!currentSlide || currentSlide.display_order === 1) return;

    const previousSlide = slides.find(s => s.display_order === currentSlide.display_order - 1);
    if (!previousSlide) return;

    setLoading(true);
    await Promise.all([
      supabase.from("carousel_slides").update({ display_order: previousSlide.display_order }).eq("id", currentSlide.id),
      supabase.from("carousel_slides").update({ display_order: currentSlide.display_order }).eq("id", previousSlide.id),
    ]);
    
    toast({ title: "Success", description: "Slide moved up" });
    fetchSlides();
    setLoading(false);
  };

  const handleMoveDown = async (slideId: string) => {
    const currentSlide = slides.find(s => s.id === slideId);
    const maxOrder = Math.max(...slides.map(s => s.display_order));
    if (!currentSlide || currentSlide.display_order === maxOrder) return;

    const nextSlide = slides.find(s => s.display_order === currentSlide.display_order + 1);
    if (!nextSlide) return;

    setLoading(true);
    await Promise.all([
      supabase.from("carousel_slides").update({ display_order: nextSlide.display_order }).eq("id", currentSlide.id),
      supabase.from("carousel_slides").update({ display_order: currentSlide.display_order }).eq("id", nextSlide.id),
    ]);
    
    toast({ title: "Success", description: "Slide moved down" });
    fetchSlides();
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

      {/* Individual Slides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {slides.map((slide) => (
        <Card key={slide.id} className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Slide {slide.display_order}</span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMoveUp(slide.id)}
                  disabled={loading || slide.display_order === 1}
                  className="h-8 w-8"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleMoveDown(slide.id)}
                  disabled={loading || slide.display_order === Math.max(...slides.map(s => s.display_order))}
                  className="h-8 w-8"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
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
                Save
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteSlide(slide.id)}
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
