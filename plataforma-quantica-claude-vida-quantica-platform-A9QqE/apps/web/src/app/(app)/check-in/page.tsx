import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { CheckinForm } from "./CheckinForm";

export default async function CheckinPage() {
  const today = await api<any>("/checkins/today");
  const history = await api<any[]>("/checkins/history?days=14");
  return (
    <div>
      <PageHeader
        title="Check-in quântico"
        subtitle="Como está sua frequência hoje? Honestidade radical."
        icon="🌅"
      />
      <CheckinForm initial={today} history={history} />
    </div>
  );
}
