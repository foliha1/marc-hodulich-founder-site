import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const ContactEditor = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: contactData } = await supabase
      .from("contact_content")
      .select("*")
      .single();
    if (contactData) setData(contactData);
  };

  const handleSave = async () => {
    if (!data) return;
    setLoading(true);
    const { error } = await supabase
      .from("contact_content")
      .update({
        title: data.title,
        description: data.description,
        button_text: data.button_text,
        email: data.email,
      })
      .eq("id", data.id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Contact section updated" });
    }
    setLoading(false);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={data.button_text}
            onChange={(e) => setData({ ...data, button_text: e.target.value })}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};
