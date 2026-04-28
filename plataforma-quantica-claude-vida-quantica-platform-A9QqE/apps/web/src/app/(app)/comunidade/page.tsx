import { api } from "@/lib/api";
import { PageHeader } from "@/components/ui";
import { CommunityFeed } from "./CommunityFeed";

export default async function ComunidadePage() {
  const posts = await api<any[]>("/community");
  return (
    <div>
      <PageHeader
        title="Comunidade"
        subtitle="Compartilhe gratidões, conquistas e reflexões. Aqui é um espaço seguro."
        icon="👥"
      />
      <CommunityFeed initial={posts} />
    </div>
  );
}
