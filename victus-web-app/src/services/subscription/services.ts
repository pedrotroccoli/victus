import { baseApi } from "@/services/api";
import { CreateSubscriptionSessionResponse } from "./types";

export const createSubscriptionSession = async (): Promise<CreateSubscriptionSessionResponse> => {
  const response = await baseApi.post('/subscription/portal_session');

  return response.data;
};