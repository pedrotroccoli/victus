import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "./services";

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: createCheckoutSession,
  });
}