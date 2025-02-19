export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string;
          created_at: string;
          hours: number;
          description: string;
          points: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          hours: number;
          description: string;
          points: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          hours?: number;
          description?: string;
          points?: number;
        };
      };
    };
  };
}