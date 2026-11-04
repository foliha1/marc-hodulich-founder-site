import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { refreshPublicContent, compactDisplayOrder } from "@/lib/cmsCache";
import { ImageUpload } from "./ImageUpload";
import { Plus } from "lucide-react";
import type { PressFeature } from "@/hooks/usePressFeatures";

const KindList = ({ kind }: { kind: "press" | "linkedin" }) => {
  const [items, setItems] = useState<PressFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isPress = kind === "press";

  const fetchItems = async () => {
    const { data } = await supabase.from("press_features").select("*").eq("kind", kind).order("display_order");
    if (data) setItems(data as PressFeature[]);
  };
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (id: string, p: Partial<PressFeature>) =>
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const done = (error: { message: string } | null, msg: string) => {
    if (error) toast({ variant: "destructive", title: "Error", description: error.message });
    else {
      toast({ title: "Success", description: msg });
      refreshPublicContent(queryClient, "press-features");
      fetchItems();
    }
    setLoading(false);
  };

  const add = async () => {
    setLoading(true);
    const { data: all } = await supabase.from("press_features").select("display_order");
    const next = all && all.length ? Math.max(...all.map((r) => r.display_order)) + 1 : 1;
    const { error } = await supabase.from("press_features").insert({
      kind,
      outlet: isPress ? "New outlet" : "LinkedIn",
      title: isPress ? "New feature" : "",
      display_order: next,
    });
    done(error, "Added");
  };

  const save = async (i: PressFeature) => {
    setLoading(true);
    const { error } = await supabase
      .from("press_features")
      .update({ outlet: i.outlet, title: i.title, excerpt: i.excerpt, url: i.url, image_url: i.image_url, display_order: i.display_order })
      .eq("id", i.id);
    done(error, "Saved");
  };

  const remove = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("press_features").delete().eq("id", id);
    if (!error) await compactDisplayOrder("press_features");
    done(error, "Deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{isPress ? "Features & Press" : "LinkedIn posts"}</h3>
        <Button onClick={add} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          {isPress ? "Add feature" : "Add LinkedIn post"}
        </Button>
      </div>
      {!isPress && (
        <p className="text-sm text-muted-foreground">
          Paste a short quote from the post and its link. Shown as quotes on the Editorial page.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((i) => (
          <Card key={i.id}>
            <CardHeader>
              <CardTitle className="text-base">{isPress ? i.outlet || "Feature" : "LinkedIn post"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPress && (
                <>
                  <div>
                    <Label>Outlet</Label>
                    <Input value={i.outlet} onChange={(e) => patch(i.id, { outlet: e.target.value })} />
                  </div>
                  <div>
                    <Label>Headline</Label>
                    <Input value={i.title} onChange={(e) => patch(i.id, { title: e.target.value })} />
                  </div>
                </>
              )}
              <div>
                <Label>{isPress ? "Short description" : "Quote from the post"}</Label>
                <Textarea rows={3} value={i.excerpt} onChange={(e) => patch(i.id, { excerpt: e.target.value })} />
              </div>
              <div>
                <Label>Link</Label>
                <Input value={i.url} placeholder="https://..." onChange={(e) => patch(i.id, { url: e.target.value })} />
              </div>
              {isPress && (
                <ImageUpload value={i.image_url} onChange={(url) => patch(i.id, { image_url: url })} folder="press" label="Image" />
              )}
              <div>
                <Label>Order</Label>
                <Input type="number" value={i.display_order} onChange={(e) => patch(i.id, { display_order: Number(e.target.value) })} />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => save(i)} disabled={loading}>Save</Button>
                <Button variant="destructive" onClick={() => remove(i.id)} disabled={loading}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const PressEditor = () => (
  <div className="space-y-10">
    <KindList kind="press" />
    <KindList kind="linkedin" />
  </div>
);
