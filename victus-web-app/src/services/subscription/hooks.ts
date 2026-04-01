import { useMutation } from "@tanstack/react-query";
import { createSubscriptionSession } from "./services";

export const useCreateSubscriptionSession = () => {
  return useMutation({
    mutationFn: createSubscriptionSession
  });
};