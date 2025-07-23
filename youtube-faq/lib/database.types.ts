export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          email: string
          openai_api_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email: string
          openai_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          openai_api_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          user_id: string
          name: string
          youtube_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          youtube_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          youtube_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          channel_id: string
          youtube_id: string
          title: string
          url: string
          uploaded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          youtube_id: string
          title: string
          url: string
          uploaded_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          youtube_id?: string
          title?: string
          url?: string
          uploaded_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      transcript_chunks: {
        Row: {
          id: string
          video_id: string
          content: string
          embedding: string | null
          start_time: number
          end_time: number
          chunk_index: number
          created_at: string
        }
        Insert: {
          id?: string
          video_id: string
          content: string
          embedding?: string | null
          start_time: number
          end_time: number
          chunk_index: number
          created_at?: string
        }
        Update: {
          id?: string
          video_id?: string
          content?: string
          embedding?: string | null
          start_time?: number
          end_time?: number
          chunk_index?: number
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          channel_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          channel_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          channel_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}