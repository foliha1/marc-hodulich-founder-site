import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { MeetMarcEditor } from "@/components/admin/MeetMarcEditor";
import { CarouselEditor } from "@/components/admin/CarouselEditor";
import { MovementEditor } from "@/components/admin/MovementEditor";
import { PodcastsEditor } from "@/components/admin/PodcastsEditor";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { SectionTextEditor } from "@/components/admin/SectionTextEditor";
import { AdminsEditor } from "@/components/admin/AdminsEditor";
import { PressEditor } from "@/components/admin/PressEditor";
const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    let checked = false;
    const checkAdminAccess = async (session: import("@supabase/supabase-js").Session | null) => {
      if (checked) return;
      if (!session) {
        // Arriving from a magic link: tokens/code in the URL are still being exchanged.
        const fromLink = /access_token|refresh_token|[?&]code=|token_hash/.test(window.location.hash + window.location.search);
        const linkError = /error_code|error_description/.test(window.location.hash + window.location.search);
        if (linkError) {
          checked = true;
          navigate(`/auth${window.location.hash || window.location.search}`);
          return;
        }
        if (fromLink) return; // wait for SIGNED_IN from onAuthStateChange
        checked = true;
        navigate("/auth");
        return;
      }
      checked = true;
      const {
        data: roleData
      } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle();
      if (!roleData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin permissions. Contact an administrator."
        });
        await supabase.auth.signOut();
        navigate("/");
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    // Register the listener first so a session restored from the magic link is never missed.
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
        return;
      }
      if (session) {
        // Defer DB calls out of the auth callback.
        setTimeout(() => checkAdminAccess(session), 0);
      }
    });
    // getSession() waits for the URL session (magic link) to be processed before resolving.
    supabase.auth.getSession().then(({ data: { session } }) => checkAdminAccess(session));
    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>;
  }
  if (!isAdmin) return null;
  return <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Marc Hodulich Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">View live site</a>
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 lg:grid lg:grid-cols-9">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="meet-marc">Meet Marc</TabsTrigger>
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="movement">Movement</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="press">Editorial</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="hero">
              <HeroEditor />
            </TabsContent>
            <TabsContent value="meet-marc">
              <MeetMarcEditor />
            </TabsContent>
            <TabsContent value="carousel">
              <CarouselEditor />
            </TabsContent>
            <TabsContent value="movement">
              <MovementEditor />
            </TabsContent>
            <TabsContent value="podcasts">
              <PodcastsEditor />
            </TabsContent>
            <TabsContent value="social">
              <SectionTextEditor sectionName="social" heading="In the Wild Section Content" showParagraph={false} />
            </TabsContent>
            <TabsContent value="press">
              <PressEditor />
            </TabsContent>
            <TabsContent value="contact">
              <ContactEditor />
            </TabsContent>
            <TabsContent value="admins">
              <AdminsEditor />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>;
};
export default Admin;