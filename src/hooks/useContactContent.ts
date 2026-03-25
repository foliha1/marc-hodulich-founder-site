import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ContactContent {
  title: string;
  description: string;
  button_text: string;
  email: string;
}

export const useContactContent = () => {
  return useQuery({
    queryKey: ["contact-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_content")
        .select("*")
        .single();

      if (error) throw error;
      return data as ContactContent;
    },
  });
};
