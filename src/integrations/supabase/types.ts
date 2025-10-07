export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      carousel_slides: {
        Row: {
          caption: string | null
          display_order: number
          id: string
          image_url: string
          subcaption: string | null
          updated_at: string | null
        }
        Insert: {
          caption?: string | null
          display_order: number
          id?: string
          image_url: string
          subcaption?: string | null
          updated_at?: string | null
        }
        Update: {
          caption?: string | null
          display_order?: number
          id?: string
          image_url?: string
          subcaption?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_content: {
        Row: {
          button_text: string
          description: string
          email: string
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_text: string
          description: string
          email: string
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_text?: string
          description?: string
          email?: string
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          background_image_url: string
          description: string
          id: string
          subtitle: string
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url: string
          description: string
          id?: string
          subtitle: string
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string
          description?: string
          id?: string
          subtitle?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meet_marc_cards: {
        Row: {
          description: string
          display_order: number
          id: string
          image_url: string
          title: string
          updated_at: string | null
        }
        Insert: {
          description: string
          display_order: number
          id?: string
          image_url: string
          title: string
          updated_at?: string | null
        }
        Update: {
          description?: string
          display_order?: number
          id?: string
          image_url?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      movement_content: {
        Row: {
          description: string
          id: string
          profile_image_url: string
          quote: string
          quote_author: string
          title: string
          updated_at: string | null
          video_link_url: string
          video_url: string
        }
        Insert: {
          description: string
          id?: string
          profile_image_url: string
          quote: string
          quote_author: string
          title: string
          updated_at?: string | null
          video_link_url: string
          video_url: string
        }
        Update: {
          description?: string
          id?: string
          profile_image_url?: string
          quote?: string
          quote_author?: string
          title?: string
          updated_at?: string | null
          video_link_url?: string
          video_url?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          description: string
          display_order: number
          id: string
          podcast_url: string
          thumbnail_url: string
          title: string
          updated_at: string | null
        }
        Insert: {
          description: string
          display_order: number
          id?: string
          podcast_url: string
          thumbnail_url: string
          title: string
          updated_at?: string | null
        }
        Update: {
          description?: string
          display_order?: number
          id?: string
          podcast_url?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      section_content: {
        Row: {
          id: string
          paragraph: string
          section_name: string
          title: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          paragraph: string
          section_name: string
          title: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          paragraph?: string
          section_name?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          display_order: number
          id: string
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          display_order: number
          id?: string
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          alt_text: string
          display_order: number
          id: string
          image_url: string
          instagram_url: string | null
          post_type: string
          updated_at: string | null
        }
        Insert: {
          alt_text: string
          display_order: number
          id?: string
          image_url: string
          instagram_url?: string | null
          post_type?: string
          updated_at?: string | null
        }
        Update: {
          alt_text?: string
          display_order?: number
          id?: string
          image_url?: string
          instagram_url?: string | null
          post_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
