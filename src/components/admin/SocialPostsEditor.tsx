import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSocialPosts, type SocialPost } from "@/hooks/useSocialPosts";
import { getInstagramPostUrl, hasSocialThumbnail } from "@/lib/socialMedia";
import { refreshPublicContent, compactDisplayOrder } from "@/lib/cmsCache";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SocialPostsEditor = () => {
  const { data, isLoading, error } = useSocialPosts();
  const [rows, setRows] = useState<SocialPost[]>([]);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  useEffect(() => { if (data) setRows(data); }, [data]);
  const local = (id: string, changes: Partial<SocialPost>) => setRows(items => items.map(row => row.id === id ? { ...row, ...changes } : row));
  const run = async (operation: () => Promise<void>, message: string) => {
    setBusy(true);
    try { await operation(); toast({ title: "Saved", description: message }); }
    catch (error) { toast({ variant: "destructive", title: "Unable to save", description: error instanceof Error ? error.message : "Please try again." }); }
    finally { refreshPublicContent(queryClient, "social-posts"); setBusy(false); }
  };
  const save = (row: SocialPost) => run(async () => {
    if (row.instagram_url?.trim() && !getInstagramPostUrl(row.instagram_url.trim())) throw new Error("Enter an original Instagram post or reel URL, not a profile URL.");
    if (!Number.isInteger(row.display_order) || row.display_order < 1) throw new Error("Display order must be a positive whole number.");
    const { error } = await supabase.from("social_posts").update({ image_url: row.image_url, video_url: row.video_url || null, alt_text: row.alt_text, instagram_url: row.instagram_url?.trim() || null, display_order: row.display_order, is_grayscale: row.is_grayscale, updated_at: new Date().toISOString() }).eq("id", row.id);
    if (error) throw error;
    await compactDisplayOrder("social_posts");
  }, "Instagram post updated");
  const uploadVideo = (row: SocialPost, file: File) => run(async () => {
    if (file.type !== "video/mp4") throw new Error("Please upload an MP4 video file.");
    if (file.size > 100 * 1024 * 1024) throw new Error("Video must be smaller than 100MB.");
    const filePath = `social/${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`;
    const { error: uploadError } = await supabase.storage.from("cms-images").upload(filePath, file, { cacheControl: "3600", upsert: false });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("cms-images").getPublicUrl(filePath);
    const { error } = await supabase.from("social_posts").update({ video_url: publicUrl }).eq("id", row.id);
    if (error) throw error;
    local(row.id, { video_url: publicUrl });
  }, "Video updated");
  const move = (index: number, direction: number) => run(async () => {
    const a = rows[index], b = rows[index + direction];
    if (!a || !b) return;
    const results = await Promise.all([
      supabase.from("social_posts").update({ display_order: b.display_order }).eq("id", a.id),
      supabase.from("social_posts").update({ display_order: a.display_order }).eq("id", b.id),
    ]);
    for (const result of results) if (result.error) throw result.error;
  }, "Instagram posts reordered");
  if (isLoading) return <p>Loading Instagram posts…</p>;
  if (error) return <p role="alert">Unable to load Instagram posts.</p>;
  return <div className="space-y-6">
    <Button disabled={busy} onClick={() => run(async () => {
      const { error } = await supabase.from("social_posts").insert({ image_url: "", alt_text: "", display_order: Math.max(0, ...rows.map(row => row.display_order)) + 1 });
      if (error) throw error;
    }, "Instagram post added")}><Plus className="h-4 w-4 mr-2" />Add Instagram Post</Button>
    <div className="grid md:grid-cols-2 gap-6">
      {rows.map((row, index) => <Card key={row.id}>
        <CardHeader><CardTitle className="flex justify-between items-center gap-3">Post {row.display_order}<div className="flex gap-1">
          <Button size="icon" variant="outline" title="Move up" aria-label={`Move post ${row.display_order} up`} disabled={busy || index === 0} onClick={() => move(index, -1)}><ArrowUp className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" title="Move down" aria-label={`Move post ${row.display_order} down`} disabled={busy || index === rows.length - 1} onClick={() => move(index, 1)}><ArrowDown className="h-4 w-4" /></Button>
        </div></CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {!hasSocialThumbnail(row.image_url) && <p className="text-sm text-muted-foreground">An authentic Instagram thumbnail is needed before this post appears on the homepage.</p>}
          {!getInstagramPostUrl(row.instagram_url) && <p className="text-sm text-muted-foreground">Original post URL missing. Without it, the thumbnail will not be clickable.</p>}
          <ImageUpload value={row.image_url} folder="social" label="Instagram Thumbnail" onChange={url => { local(row.id, { image_url: url }); run(async () => {
            const { error } = await supabase.from("social_posts").update({ image_url: url }).eq("id", row.id);
            if (error) throw error;
          }, "Instagram thumbnail updated"); }} />
          <div className="space-y-2">
            <Label>Hover Video (optional MP4)</Label>
            {row.video_url && <video src={row.video_url} muted loop playsInline className="w-full h-32 object-cover rounded-lg border" onMouseEnter={e => void e.currentTarget.play().catch(() => undefined)} onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => document.getElementById(`social-video-${row.id}`)?.click()}>{row.video_url ? "Change Video" : "Upload Video"}</Button>
              {row.video_url && <Button type="button" variant="destructive" size="sm" disabled={busy} onClick={() => run(async () => {
                const { error } = await supabase.from("social_posts").update({ video_url: null }).eq("id", row.id);
                if (error) throw error;
                local(row.id, { video_url: null });
              }, "Video removed")}>Remove</Button>}
            </div>
            <input id={`social-video-${row.id}`} type="file" accept="video/mp4" className="hidden" onChange={e => { const file = e.target.files?.[0]; if (file) uploadVideo(row, file); e.target.value = ""; }} />
          </div>
          <div className="flex items-center gap-2">
            <input id={`social-gray-${row.id}`} type="checkbox" checked={row.is_grayscale} onChange={e => local(row.id, { is_grayscale: e.target.checked })} className="h-4 w-4 accent-current" />
            <Label htmlFor={`social-gray-${row.id}`}>Show in black &amp; white</Label>
          </div>
          <div><Label htmlFor={`social-alt-${row.id}`}>Image Description</Label><Input id={`social-alt-${row.id}`} value={row.alt_text} onChange={e => local(row.id, { alt_text: e.target.value })} /></div>
          <div><Label htmlFor={`social-url-${row.id}`}>Instagram Post URL</Label><Input id={`social-url-${row.id}`} type="url" value={row.instagram_url || ""} onChange={e => local(row.id, { instagram_url: e.target.value })} /></div>
          <div><Label htmlFor={`social-order-${row.id}`}>Display Order</Label><Input id={`social-order-${row.id}`} type="number" min={1} step={1} value={row.display_order} onChange={e => local(row.id, { display_order: Number(e.target.value) })} /></div>
          <div className="flex justify-between"><Button disabled={busy} onClick={() => save(row)}>Save Post</Button><Button disabled={busy} size="icon" variant="destructive" title="Delete post" aria-label={`Delete post ${row.display_order}`} onClick={() => {
            if (!window.confirm(`Delete post ${row.display_order}?`)) return;
            run(async () => { const { error } = await supabase.from("social_posts").delete().eq("id", row.id); if (error) throw error; await compactDisplayOrder("social_posts"); }, "Instagram post deleted");
          }}><Trash2 className="h-4 w-4" /></Button></div>
        </CardContent>
      </Card>)}
    </div>
  </div>;
};
