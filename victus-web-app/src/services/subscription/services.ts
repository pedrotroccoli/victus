import { baseApi } from "@/services/api";
import { CreateSubscriptionSessionResponse } from "./types";

export const createSubscriptionSession = async (): Promise<CreateSubscriptionSessionResponse> => {
  const response = await baseApi.post('/subscription/create_session');

  return response.data;
};