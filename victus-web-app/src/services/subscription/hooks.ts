import { useMutation } from "@tanstack/react-query";
import { createPortalSession } from "./services";

export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: createPortalSession
  });
};