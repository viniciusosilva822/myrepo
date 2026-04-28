import { requireSession } from "@/lib/auth";
import { SideNav } from "@/components/SideNav";
import { TopBar } from "@/components/TopBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();
  return (
    <div className="min-h-screen flex">
      <SideNav isAdmin={user.role === "ADMIN"} />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
