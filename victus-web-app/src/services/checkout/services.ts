import { baseApi } from "../api";

export interface CreateCheckoutSessionResponse {
  message: string;
  url: string;
}

export const createCheckoutSession = async (key: string): Promise<CreateCheckoutSessionResponse> => {
  const { data } = await baseApi.post('/checkout/create', {
    lookup_key: key,
  });

  return data;
}