import { useMe } from "@/services/auth";

export default function Subscription() {
  const { data: me } = useMe();

  console.log(me);

  return <div>Subscription</div>;
}
