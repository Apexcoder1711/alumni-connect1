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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alumni_profiles: {
        Row: {
          availability_for_mentoring: boolean | null
          bio: string | null
          created_at: string
          current_company: string | null
          current_job_title: string | null
          degree: string | null
          email: string | null
          expertise_areas: string[] | null
          full_name: string | null
          graduation_year: number | null
          id: string
          industry: string | null
          is_profile_complete: boolean | null
          linkedin_url: string | null
          location: string | null
          major: string | null
          phone: string | null
          preferred_communication: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          availability_for_mentoring?: boolean | null
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_job_title?: string | null
          degree?: string | null
          email?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          phone?: string | null
          preferred_communication?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          availability_for_mentoring?: boolean | null
          bio?: string | null
          created_at?: string
          current_company?: string | null
          current_job_title?: string | null
          degree?: string | null
          email?: string | null
          expertise_areas?: string[] | null
          full_name?: string | null
          graduation_year?: number | null
          id?: string
          industry?: string | null
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          major?: string | null
          phone?: string | null
          preferred_communication?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      answers: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          is_best_answer: boolean
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_best_answer?: boolean
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_best_answer?: boolean
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      college_reference_ids: {
        Row: {
          created_at: string
          id: string
          is_used: boolean
          reference_id: string
          used_at: string | null
          used_by: string | null
          user_type: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_used?: boolean
          reference_id: string
          used_at?: string | null
          used_by?: string | null
          user_type: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          id?: string
          is_used?: boolean
          reference_id?: string
          used_at?: string | null
          used_by?: string | null
          user_type?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      nda_agreements: {
        Row: {
          created_at: string
          id: string
          owner_id: string
          requester_id: string
          signed_at: string | null
          startup_idea_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id: string
          requester_id: string
          signed_at?: string | null
          startup_idea_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string
          requester_id?: string
          signed_at?: string | null
          startup_idea_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nda_agreements_startup_idea_id_fkey"
            columns: ["startup_idea_id"]
            isOneToOne: false
            referencedRelation: "startup_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          recipient_id: string | null
          recipient_role: string | null
          sender_id: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          recipient_id?: string | null
          recipient_role?: string | null
          sender_id: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          recipient_id?: string | null
          recipient_role?: string | null
          sender_id?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          college_ref_id: string
          created_at: string
          full_name: string
          id: string
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          college_ref_id: string
          created_at?: string
          full_name: string
          id?: string
          updated_at?: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          college_ref_id?: string
          created_at?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      questions: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number
        }
        Relationships: []
      }
      startup_connections: {
        Row: {
          connection_type: string
          created_at: string
          id: string
          message: string | null
          startup_idea_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          connection_type: string
          created_at?: string
          id?: string
          message?: string | null
          startup_idea_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          connection_type?: string
          created_at?: string
          id?: string
          message?: string | null
          startup_idea_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "startup_connections_startup_idea_id_fkey"
            columns: ["startup_idea_id"]
            isOneToOne: false
            referencedRelation: "startup_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      startup_ideas: {
        Row: {
          business_model: string | null
          created_at: string
          description: string
          equity_offered: number | null
          funding_needed: number | null
          id: string
          industry: string | null
          is_active: boolean | null
          is_public: boolean | null
          problem_statement: string
          requires_nda: boolean | null
          solution: string
          stage: string | null
          tags: string[] | null
          target_market: string | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          business_model?: string | null
          created_at?: string
          description: string
          equity_offered?: number | null
          funding_needed?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          problem_statement: string
          requires_nda?: boolean | null
          solution: string
          stage?: string | null
          tags?: string[] | null
          target_market?: string | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          business_model?: string | null
          created_at?: string
          description?: string
          equity_offered?: number | null
          funding_needed?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          problem_statement?: string
          requires_nda?: boolean | null
          solution?: string
          stage?: string | null
          tags?: string[] | null
          target_market?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          career_goals: string | null
          created_at: string
          credit_points: number | null
          current_year: number | null
          degree_program: string | null
          email: string | null
          expected_graduation_year: number | null
          extracurricular_activities: string[] | null
          full_name: string | null
          github_url: string | null
          gpa: number | null
          id: string
          interests: string[] | null
          internship_experience: string | null
          is_profile_complete: boolean | null
          linkedin_url: string | null
          major: string | null
          phone: string | null
          portfolio_url: string | null
          projects: string[] | null
          seeking_mentorship: boolean | null
          skills: string[] | null
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          career_goals?: string | null
          created_at?: string
          credit_points?: number | null
          current_year?: number | null
          degree_program?: string | null
          email?: string | null
          expected_graduation_year?: number | null
          extracurricular_activities?: string[] | null
          full_name?: string | null
          github_url?: string | null
          gpa?: number | null
          id?: string
          interests?: string[] | null
          internship_experience?: string | null
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          major?: string | null
          phone?: string | null
          portfolio_url?: string | null
          projects?: string[] | null
          seeking_mentorship?: boolean | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          career_goals?: string | null
          created_at?: string
          credit_points?: number | null
          current_year?: number | null
          degree_program?: string | null
          email?: string | null
          expected_graduation_year?: number | null
          extracurricular_activities?: string[] | null
          full_name?: string | null
          github_url?: string | null
          gpa?: number | null
          id?: string
          interests?: string[] | null
          internship_experience?: string | null
          is_profile_complete?: boolean | null
          linkedin_url?: string | null
          major?: string | null
          phone?: string | null
          portfolio_url?: string | null
          projects?: string[] | null
          seeking_mentorship?: boolean | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_projects: {
        Row: {
          admin_feedback: string | null
          created_at: string
          credit_points_earned: number | null
          description: string
          github_url: string | null
          id: string
          is_validated: boolean | null
          project_url: string | null
          skills_used: string[] | null
          timetable_id: string | null
          title: string
          updated_at: string
          user_id: string
          validation_status: string | null
        }
        Insert: {
          admin_feedback?: string | null
          created_at?: string
          credit_points_earned?: number | null
          description: string
          github_url?: string | null
          id?: string
          is_validated?: boolean | null
          project_url?: string | null
          skills_used?: string[] | null
          timetable_id?: string | null
          title: string
          updated_at?: string
          user_id: string
          validation_status?: string | null
        }
        Update: {
          admin_feedback?: string | null
          created_at?: string
          credit_points_earned?: number | null
          description?: string
          github_url?: string | null
          id?: string
          is_validated?: boolean | null
          project_url?: string | null
          skills_used?: string[] | null
          timetable_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_projects_timetable_id_fkey"
            columns: ["timetable_id"]
            isOneToOne: false
            referencedRelation: "timetables"
            referencedColumns: ["id"]
          },
        ]
      }
      timetables: {
        Row: {
          created_at: string
          description: string | null
          goals: string[] | null
          id: string
          is_active: boolean | null
          is_ai_generated: boolean | null
          schedule: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          schedule?: Json
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goals?: string[] | null
          id?: string
          is_active?: boolean | null
          is_ai_generated?: boolean | null
          schedule?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_view_count: {
        Args: { question_id: string }
        Returns: undefined
      }
    }
    Enums: {
      user_role:
        | "student"
        | "alumni"
        | "admin"
        | "investor"
        | "partner"
        | "intern"
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
      user_role: [
        "student",
        "alumni",
        "admin",
        "investor",
        "partner",
        "intern",
      ],
    },
  },
} as const
