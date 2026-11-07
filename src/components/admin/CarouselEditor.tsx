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
import { useMilestones, type Milestone } from "@/hooks/useMilestones";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

export const CarouselEditor = () => {
  const { data, isLoading, error } = useMilestones();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [section, setSection] = useState<NonNullable<typeof data>["section"]>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) { setMilestones(data.milestones); setSection(data.section); }
  }, [data]);

  const run = async (operation: () => Promise<void>, message: string) => {
    setBusy(true);
    try {
      await operation();
      refreshPublicContent(queryClient, "entrepreneurial-milestones", "section-content");
      toast({ title: "Saved", description: message });
    } catch (failure) {
      refreshPublicContent(queryClient, "entrepreneurial-milestones");
      toast({ variant: "destructive", title: "Unable to save", description: failure instanceof Error ? failure.message : "Please try again." });
    } finally { setBusy(false); }
  };

  const updateLocal = (id: string, changes: Partial<Milestone>) => {
    setMilestones(rows => rows.map(row => row.id === id ? { ...row, ...changes } : row));
  };

  const save = (row: Milestone) => run(async () => {
    if (!Number.isInteger(row.display_order) || row.display_order < 1) throw new Error("Display order must be a positive whole number.");
    const { error } = await supabase.from("entrepreneurial_milestones").update({
      title: row.title, contextual_label: row.contextual_label, teaser: row.teaser, description: row.description,
      display_order: row.display_order, updated_at: new Date().toISOString(),
    }).eq("id", row.id);
    if (error) throw error;
    await compactDisplayOrder("entrepreneurial_milestones");
  }, "Milestone updated");

  const move = (index: number, direction: number) => run(async () => {
    const current = milestones[index];
    const adjacent = milestones[index + direction];
    if (!current || !adjacent) return;
    const results = await Promise.all([
      supabase.from("entrepreneurial_milestones").update({ display_order: adjacent.display_order }).eq("id", current.id),
      supabase.from("entrepreneurial_milestones").update({ display_order: current.display_order }).eq("id", adjacent.id),
    ]);
    for (const result of results) if (result.error) throw result.error;
  }, "Milestone reordered");

  if (isLoading) return <p>Loading milestones…</p>;
  if (error) return <p role="alert">Unable to load milestones. Please refresh and try again.</p>;

  return <div className="space-y-6">
    {section && <Card>
      <CardHeader><CardTitle>Failures &amp; Firsts Section</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div><Label htmlFor="milestone-section-title">Section Label</Label><Input id="milestone-section-title" value={section.title} onChange={e => setSection({ ...section, title: e.target.value })} /></div>
        <div><Label htmlFor="milestone-intro">Introductory Paragraph</Label><Textarea id="milestone-intro" rows={6} value={section.paragraph} onChange={e => setSection({ ...section, paragraph: e.target.value })} /></div>
        <Button disabled={busy} onClick={() => run(async () => {
          const { error } = await supabase.from("section_content").update({ title: section.title, paragraph: section.paragraph }).eq("id", section.id);
          if (error) throw error;
        }, "Section updated")}>Save Section Content</Button>
      </CardContent>
    </Card>}
    <Button disabled={busy} onClick={() => run(async () => {
      const { error } = await supabase.from("entrepreneurial_milestones").insert({ title: "New Milestone", display_order: Math.max(0, ...milestones.map(row => row.display_order)) + 1 });
      if (error) throw error;
    }, "Milestone added")}><Plus className="mr-2 h-4 w-4" />Add Milestone</Button>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {milestones.map((row, index) => <Card key={row.id}>
        <CardHeader><CardTitle className="flex items-center justify-between gap-3"><span>Milestone {row.display_order}</span><div className="flex gap-1">
          <Button variant="outline" size="icon" title="Move up" aria-label={`Move milestone ${row.display_order} up`} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" title="Move down" aria-label={`Move milestone ${row.display_order} down`} disabled={busy || index === milestones.length - 1} onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
        </div></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label htmlFor={`title-${row.id}`}>Title</Label><Input id={`title-${row.id}`} value={row.title} onChange={e => updateLocal(row.id, { title: e.target.value })} /></div>
          <div><Label htmlFor={`label-${row.id}`}>Contextual Label</Label><Input id={`label-${row.id}`} value={row.contextual_label} onChange={e => updateLocal(row.id, { contextual_label: e.target.value })} /></div>
          <div><Label htmlFor={`teaser-${row.id}`}>Teaser (shown when row is closed)</Label><Input id={`teaser-${row.id}`} value={row.teaser} onChange={e => updateLocal(row.id, { teaser: e.target.value })} /></div>
          <div><Label htmlFor={`description-${row.id}`}>Description</Label><Textarea id={`description-${row.id}`} rows={4} value={row.description} onChange={e => updateLocal(row.id, { description: e.target.value })} /></div>
          <div><Label htmlFor={`order-${row.id}`}>Display Order</Label><Input id={`order-${row.id}`} type="number" min={1} step={1} value={row.display_order} onChange={e => updateLocal(row.id, { display_order: Number(e.target.value) })} /></div>
          <div className="flex justify-between gap-3">
            <Button disabled={busy} onClick={() => save(row)}>Save Milestone</Button>
            <Button variant="destructive" size="icon" title="Delete milestone" aria-label={`Delete milestone ${row.display_order}`} disabled={busy} onClick={() => {
              if (!window.confirm(`Delete “${row.title}”?`)) return;
              run(async () => {
                const { error } = await supabase.from("entrepreneurial_milestones").delete().eq("id", row.id);
                if (error) throw error;
                await compactDisplayOrder("entrepreneurial_milestones");
              }, "Milestone deleted");
            }}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>)}
    </div>
  </div>;
};
