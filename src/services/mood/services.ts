import { baseApi } from "../api";
import {
  CreateMoodRequest,
  CreateMoodResponse,
  GetMoodsResponse,
  Mood,
  UpdateMoodRequest,
  UpdateMoodResponse
} from "./types";

export const getMoods = async (): Promise<GetMoodsResponse> => {
  const { data } = await baseApi.get('/mood');
  return data;
};

export const getMood = async (id: string): Promise<Mood> => {
  const { data } = await baseApi.get(`/mood/${id}`);
  return data;
};

export const createMood = async (params: CreateMoodRequest): Promise<CreateMoodResponse> => {
  const { data } = await baseApi.post('/mood', params);
  return data;
};

export const updateMood = async (id: string, params: UpdateMoodRequest): Promise<UpdateMoodResponse> => {
  const { data } = await baseApi.put(`/mood/${id}`, params);
  return data;
};

export const deleteMood = async (id: string): Promise<void> => {
  await baseApi.delete(`/mood/${id}`);
};
