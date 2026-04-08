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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          author_name: string | null
          category: string | null
          color: string | null
          content_en: string
          content_hi: string
          created_at: string
          created_by: string | null
          emoji: string | null
          excerpt_en: string | null
          excerpt_hi: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean
          published_at: string | null
          read_time: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          tags: string[] | null
          title_en: string
          title_hi: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author_name?: string | null
          category?: string | null
          color?: string | null
          content_en?: string
          content_hi?: string
          created_at?: string
          created_by?: string | null
          emoji?: string | null
          excerpt_en?: string | null
          excerpt_hi?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title_en: string
          title_hi: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author_name?: string | null
          category?: string | null
          color?: string | null
          content_en?: string
          content_hi?: string
          created_at?: string
          created_by?: string | null
          emoji?: string | null
          excerpt_en?: string | null
          excerpt_hi?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean
          published_at?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title_en?: string
          title_hi?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      bhajans: {
        Row: {
          audio_url: string | null
          category: string | null
          created_at: string
          created_by: string | null
          deity_en: string | null
          deity_hi: string | null
          duration_display: string | null
          duration_seconds: number | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_free: boolean
          lyrics_en: string | null
          lyrics_hi: string | null
          play_count: number
          seo_description: string | null
          seo_title: string | null
          short_description_en: string | null
          short_description_hi: string | null
          slug: string
          sort_order: number
          status: string
          title_en: string
          title_hi: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audio_url?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          duration_display?: string | null
          duration_seconds?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_free?: boolean
          lyrics_en?: string | null
          lyrics_hi?: string | null
          play_count?: number
          seo_description?: string | null
          seo_title?: string | null
          short_description_en?: string | null
          short_description_hi?: string | null
          slug: string
          sort_order?: number
          status?: string
          title_en: string
          title_hi: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          duration_display?: string | null
          duration_seconds?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_free?: boolean
          lyrics_en?: string | null
          lyrics_hi?: string | null
          play_count?: number
          seo_description?: string | null
          seo_title?: string | null
          short_description_en?: string | null
          short_description_hi?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title_en?: string
          title_hi?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      bookmarked_bhajans: {
        Row: {
          bhajan_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          bhajan_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          bhajan_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          handled_by: string | null
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          handled_by?: string | null
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          handled_by?: string | null
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_relations: {
        Row: {
          created_at: string
          id: string
          relation_type: string
          sort_order: number
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          relation_type?: string
          sort_order?: number
          source_id: string
          source_type: string
          target_id: string
          target_type: string
        }
        Update: {
          created_at?: string
          id?: string
          relation_type?: string
          sort_order?: number
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          pack_name: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          pack_name?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          pack_name?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_horoscopes: {
        Row: {
          content_en: string
          content_hi: string
          created_at: string
          horoscope_date: string
          id: string
          rashi_id: string
        }
        Insert: {
          content_en: string
          content_hi: string
          created_at?: string
          horoscope_date?: string
          id?: string
          rashi_id: string
        }
        Update: {
          content_en?: string
          content_hi?: string
          created_at?: string
          horoscope_date?: string
          id?: string
          rashi_id?: string
        }
        Relationships: []
      }
      festivals: {
        Row: {
          category: string | null
          color: string | null
          created_at: string
          created_by: string | null
          description_en: string
          description_hi: string
          emoji: string | null
          end_date: string | null
          excerpt_en: string | null
          excerpt_hi: string | null
          festival_date: string
          id: string
          image_url: string | null
          is_featured: boolean
          location_scope: string | null
          name_en: string
          name_hi: string
          seo_description: string | null
          seo_title: string | null
          significance_en: string | null
          significance_hi: string | null
          slug: string
          sort_order: number
          status: string
          tithi: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string
          description_hi?: string
          emoji?: string | null
          end_date?: string | null
          excerpt_en?: string | null
          excerpt_hi?: string | null
          festival_date: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          location_scope?: string | null
          name_en: string
          name_hi: string
          seo_description?: string | null
          seo_title?: string | null
          significance_en?: string | null
          significance_hi?: string | null
          slug: string
          sort_order?: number
          status?: string
          tithi?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          description_en?: string
          description_hi?: string
          emoji?: string | null
          end_date?: string | null
          excerpt_en?: string | null
          excerpt_hi?: string | null
          festival_date?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          location_scope?: string | null
          name_en?: string
          name_hi?: string
          seo_description?: string | null
          seo_title?: string | null
          significance_en?: string | null
          significance_hi?: string | null
          slug?: string
          sort_order?: number
          status?: string
          tithi?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      panchang_cache: {
        Row: {
          city: string | null
          expires_at: string | null
          extra_data: Json | null
          fetched_at: string
          id: string
          karana_en: string | null
          karana_hi: string | null
          latitude: number | null
          location_key: string
          longitude: number | null
          masa_en: string | null
          masa_hi: string | null
          moonrise: string | null
          nakshatra_en: string | null
          nakshatra_hi: string | null
          paksha_en: string | null
          paksha_hi: string | null
          panchang_date: string
          rahu_kaal: string | null
          samvat_year: string | null
          shubh_muhurat: string | null
          source_confidence: string
          source_provider: string
          sunrise: string | null
          sunset: string | null
          timezone: string | null
          tithi_en: string | null
          tithi_hi: string | null
          vrat_of_day: string | null
          yoga_en: string | null
          yoga_hi: string | null
        }
        Insert: {
          city?: string | null
          expires_at?: string | null
          extra_data?: Json | null
          fetched_at?: string
          id?: string
          karana_en?: string | null
          karana_hi?: string | null
          latitude?: number | null
          location_key: string
          longitude?: number | null
          masa_en?: string | null
          masa_hi?: string | null
          moonrise?: string | null
          nakshatra_en?: string | null
          nakshatra_hi?: string | null
          paksha_en?: string | null
          paksha_hi?: string | null
          panchang_date: string
          rahu_kaal?: string | null
          samvat_year?: string | null
          shubh_muhurat?: string | null
          source_confidence?: string
          source_provider?: string
          sunrise?: string | null
          sunset?: string | null
          timezone?: string | null
          tithi_en?: string | null
          tithi_hi?: string | null
          vrat_of_day?: string | null
          yoga_en?: string | null
          yoga_hi?: string | null
        }
        Update: {
          city?: string | null
          expires_at?: string | null
          extra_data?: Json | null
          fetched_at?: string
          id?: string
          karana_en?: string | null
          karana_hi?: string | null
          latitude?: number | null
          location_key?: string
          longitude?: number | null
          masa_en?: string | null
          masa_hi?: string | null
          moonrise?: string | null
          nakshatra_en?: string | null
          nakshatra_hi?: string | null
          paksha_en?: string | null
          paksha_hi?: string | null
          panchang_date?: string
          rahu_kaal?: string | null
          samvat_year?: string | null
          shubh_muhurat?: string | null
          source_confidence?: string
          source_provider?: string
          sunrise?: string | null
          sunset?: string | null
          timezone?: string | null
          tithi_en?: string | null
          tithi_hi?: string | null
          vrat_of_day?: string | null
          yoga_en?: string | null
          yoga_hi?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed: boolean
          provider: string
          provider_event_id: string | null
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          processed?: boolean
          provider: string
          provider_event_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean
          provider?: string
          provider_event_id?: string | null
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_credits: number
          avatar_url: string | null
          created_at: string
          display_name: string | null
          dob: string | null
          id: string
          language: string
          pob: string | null
          preferred_city: string | null
          preferred_deity: string | null
          rashi_id: string | null
          reminder_preferences: Json
          theme: string
          tob: string | null
          updated_at: string
        }
        Insert: {
          ai_credits?: number
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          dob?: string | null
          id: string
          language?: string
          pob?: string | null
          preferred_city?: string | null
          preferred_deity?: string | null
          rashi_id?: string | null
          reminder_preferences?: Json
          theme?: string
          tob?: string | null
          updated_at?: string
        }
        Update: {
          ai_credits?: number
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          dob?: string | null
          id?: string
          language?: string
          pob?: string | null
          preferred_city?: string | null
          preferred_deity?: string | null
          rashi_id?: string | null
          reminder_preferences?: Json
          theme?: string
          tob?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          remind_date: string
          remind_time: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          remind_date: string
          remind_time?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          remind_date?: string
          remind_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_kundalis: {
        Row: {
          created_at: string
          dob: string
          id: string
          name: string
          notes: string | null
          pob: string
          tob: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dob: string
          id?: string
          name: string
          notes?: string | null
          pob: string
          tob: string
          user_id: string
        }
        Update: {
          created_at?: string
          dob?: string
          id?: string
          name?: string
          notes?: string | null
          pob?: string
          tob?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          badge: string | null
          billing_type: string
          code: string
          created_at: string
          credit_amount: number | null
          description: string | null
          features_en: string[]
          features_hi: string[]
          id: string
          is_active: boolean
          is_featured: boolean
          name: string
          price_inr: number
          purchase_enabled: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          badge?: string | null
          billing_type?: string
          code: string
          created_at?: string
          credit_amount?: number | null
          description?: string | null
          features_en?: string[]
          features_hi?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name: string
          price_inr?: number
          purchase_enabled?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          badge?: string | null
          billing_type?: string
          code?: string
          created_at?: string
          credit_amount?: number | null
          description?: string | null
          features_en?: string[]
          features_hi?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          name?: string
          price_inr?: number
          purchase_enabled?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          metadata: Json | null
          plan_id: string
          provider: string | null
          provider_order_id: string | null
          provider_payment_id: string | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          provider?: string | null
          provider_order_id?: string | null
          provider_payment_id?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      temples: {
        Row: {
          address_en: string | null
          address_hi: string | null
          city: string | null
          country: string
          created_at: string
          created_by: string | null
          deity_en: string | null
          deity_hi: string | null
          description_en: string | null
          description_hi: string | null
          emoji: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          name_en: string
          name_hi: string
          seo_description: string | null
          seo_title: string | null
          short_description_en: string | null
          short_description_hi: string | null
          slug: string
          sort_order: number
          state: string | null
          status: string
          timings_en: string | null
          timings_hi: string | null
          type: string | null
          updated_at: string
          updated_by: string | null
          website_url: string | null
        }
        Insert: {
          address_en?: string | null
          address_hi?: string | null
          city?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          description_en?: string | null
          description_hi?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          name_en: string
          name_hi: string
          seo_description?: string | null
          seo_title?: string | null
          short_description_en?: string | null
          short_description_hi?: string | null
          slug: string
          sort_order?: number
          state?: string | null
          status?: string
          timings_en?: string | null
          timings_hi?: string | null
          type?: string | null
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Update: {
          address_en?: string | null
          address_hi?: string | null
          city?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          description_en?: string | null
          description_hi?: string | null
          emoji?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          name_en?: string
          name_hi?: string
          seo_description?: string | null
          seo_title?: string | null
          short_description_en?: string | null
          short_description_hi?: string | null
          slug?: string
          sort_order?: number
          state?: string | null
          status?: string
          timings_en?: string | null
          timings_hi?: string | null
          type?: string | null
          updated_at?: string
          updated_by?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vrat_occurrences: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          occurrence_date: string
          source_type: string
          updated_at: string
          vrat_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          occurrence_date: string
          source_type?: string
          updated_at?: string
          vrat_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          occurrence_date?: string
          source_type?: string
          updated_at?: string
          vrat_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vrat_occurrences_vrat_id_fkey"
            columns: ["vrat_id"]
            isOneToOne: false
            referencedRelation: "vrats"
            referencedColumns: ["id"]
          },
        ]
      }
      vrats: {
        Row: {
          benefits_en: string | null
          benefits_hi: string | null
          color: string | null
          created_at: string
          created_by: string | null
          deity_en: string | null
          deity_hi: string | null
          description_en: string | null
          description_hi: string | null
          emoji: string | null
          fasting_day: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          nakshatra_rule: string | null
          name_en: string
          name_hi: string
          rules_en: string | null
          rules_hi: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          tithi_rule: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          benefits_en?: string | null
          benefits_hi?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          description_en?: string | null
          description_hi?: string | null
          emoji?: string | null
          fasting_day?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          nakshatra_rule?: string | null
          name_en: string
          name_hi: string
          rules_en?: string | null
          rules_hi?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          tithi_rule?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          benefits_en?: string | null
          benefits_hi?: string | null
          color?: string | null
          created_at?: string
          created_by?: string | null
          deity_en?: string | null
          deity_hi?: string | null
          description_en?: string | null
          description_hi?: string | null
          emoji?: string | null
          fasting_day?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          nakshatra_rule?: string | null
          name_en?: string
          name_hi?: string
          rules_en?: string | null
          rules_hi?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          tithi_rule?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      global_search: {
        Args: { result_limit?: number; search_query: string }
        Returns: {
          color: string
          content_type: string
          emoji: string
          excerpt: string
          id: string
          image_url: string
          slug: string
          sort_rank: number
          title_en: string
          title_hi: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "editor" | "support"
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
      app_role: ["super_admin", "editor", "support"],
    },
  },
} as const
