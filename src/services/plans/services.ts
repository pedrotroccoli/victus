import { baseApi } from "../api"

export const getPlans = async (): Promise<Plan.Item[]> => {
  const { data } = await baseApi.get('plans')

  return data
}