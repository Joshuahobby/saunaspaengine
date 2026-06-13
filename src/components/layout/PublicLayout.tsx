import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";
import { auth } from "@/lib/auth";

export async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] selection:bg-[var(--color-primary)] selection:text-white overflow-x-clip">
      <Header isLoggedIn={isLoggedIn} />
      <div className="flex-1 w-full relative z-10">
        {children}
      </div>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
