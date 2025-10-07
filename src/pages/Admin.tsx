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
import { SocialEditor } from "@/components/admin/SocialEditor";
import { ContactEditor } from "@/components/admin/ContactEditor";
import { SectionEditor } from "@/components/admin/SectionEditor";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have admin permissions. Contact an administrator.",
        });
        await supabase.auth.signOut();
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CMS Dashboard</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              View Site
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="meet-marc">Meet Marc</TabsTrigger>
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="movement">Movement</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="hero">
              <HeroEditor />
            </TabsContent>
            <TabsContent value="sections">
              <SectionEditor />
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
              <SocialEditor />
            </TabsContent>
            <TabsContent value="contact">
              <ContactEditor />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
