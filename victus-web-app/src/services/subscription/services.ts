import { baseApi } from "@/services/api";
import { CreatePortalSessionResponse } from "./types";

export const createPortalSession = async (): Promise<CreatePortalSessionResponse> => {
  const response = await baseApi.post('/subscription/portal_session');

  return response.data;
};