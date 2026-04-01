export type MoodValue = 'terrible' | 'bad' | 'neutral' | 'good' | 'great' | 'amazing';

export interface Mood {
  _id: string;
  value: MoodValue;
  description: string;
  hour_block: number;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMoodRequest {
  mood: {
    value: MoodValue;
    description: string;
  };
}

export interface UpdateMoodRequest {
  mood: {
    value?: MoodValue;
    description?: string;
  };
}

export type GetMoodsResponse = Mood[];
export type CreateMoodResponse = Mood;
export type UpdateMoodResponse = Mood;
