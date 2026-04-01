import { useQuery } from "@tanstack/react-query"
import { getPlans } from "./services"

export const useGetPlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: getPlans
  })
}