import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

export const MeetMarcEditor = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const { data } = await supabase
      .from("meet_marc_cards")
      .select("*")
      .order("display_order");
    if (data) setCards(data);
  };

  const handleUpdate = async (id: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase
      .from("meet_marc_cards")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      toast({ title: "Success", description: "Card updated" });
      fetchCards();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {cards.map((card) => (
        <Card key={card.id}>
          <CardHeader>
            <CardTitle>Card {card.display_order}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={card.title}
                onChange={(e) =>
                  setCards(cards.map((c) => (c.id === card.id ? { ...c, title: e.target.value } : c)))
                }
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={card.description}
                onChange={(e) =>
                  setCards(cards.map((c) => (c.id === card.id ? { ...c, description: e.target.value } : c)))
                }
                rows={4}
              />
            </div>
            <ImageUpload
              value={card.image_url}
              onChange={(url) =>
                setCards(cards.map((c) => (c.id === card.id ? { ...c, image_url: url } : c)))
              }
              folder="meet-marc"
              label="Card Image"
            />
            <Button
              onClick={() =>
                handleUpdate(card.id, {
                  title: card.title,
                  description: card.description,
                  image_url: card.image_url,
                })
              }
              disabled={loading}
            >
              Save Card
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
