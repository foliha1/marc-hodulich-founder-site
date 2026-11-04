import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { refreshPublicContent } from "@/lib/cmsCache";

interface Props {
  sectionName: string;
  heading: string;
  showParagraph?: boolean;
}

/** Edits a section_content row (title + optional paragraph) shown on the public site. */
export const SectionTextEditor = ({ sectionName, heading, showParagraph = true }: Props) => {
  const [row, setRow] = useState<{ id: string; title: string; paragraph: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase
      .from("section_content")
      .select("id, title, paragraph")
      .eq("section_name", sectionName)
      .maybeSingle()
      .then(({ data }) => data && setRow(data));
  }, [sectionName]);

  const handleSave = async () => {
    if (!row) return;
    setLoading(true);
    const { error } = await supabase
      .from("section_content")
      .update({ title: row.title, paragraph: row.paragraph })
      .eq("id", row.id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Section updated" });
      refreshPublicContent(queryClient, "section-content");
    }
    setLoading(false);
  };

  if (!row) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Section Title</Label>
          <Input value={row.title} onChange={(e) => setRow({ ...row, title: e.target.value })} />
        </div>
        {showParagraph && (
          <div>
            <Label>Section Paragraph</Label>
            <Textarea
              value={row.paragraph}
              onChange={(e) => setRow({ ...row, paragraph: e.target.value })}
              rows={3}
            />
          </div>
        )}
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Section Content"}
        </Button>
      </CardContent>
    </Card>
  );
};
