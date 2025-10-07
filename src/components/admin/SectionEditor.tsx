import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface SectionContent {
  id: string;
  section_name: string;
  title: string;
  paragraph: string;
}

export const SectionEditor = () => {
  const [sections, setSections] = useState<SectionContent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data } = await supabase
      .from("section_content")
      .select("*")
      .order("section_name");
    if (data) setSections(data);
  };

  const handleUpdate = async (id: string, updates: { title: string; paragraph: string }) => {
    setLoading(true);
    const { error } = await supabase
      .from("section_content")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Section updated" });
      fetchSections();
    }
    setLoading(false);
  };

  const getSectionLabel = (name: string) => {
    return name === "meet_marc" ? "Meet Marc Section" : "Failures, Firsts & Foundations Section";
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader>
            <CardTitle>{getSectionLabel(section.section_name)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={section.title}
                onChange={(e) =>
                  setSections(sections.map((s) => (s.id === section.id ? { ...s, title: e.target.value } : s)))
                }
              />
            </div>
            <div>
              <Label>Paragraph</Label>
              <Textarea
                value={section.paragraph}
                onChange={(e) =>
                  setSections(sections.map((s) => (s.id === section.id ? { ...s, paragraph: e.target.value } : s)))
                }
                rows={6}
              />
            </div>
            <Button
              onClick={() =>
                handleUpdate(section.id, {
                  title: section.title,
                  paragraph: section.paragraph,
                })
              }
              disabled={loading}
            >
              Save Section
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
