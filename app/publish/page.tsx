import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { PublishForm } from "@/components/publish-form";

export const metadata: Metadata = {
  title: "Publish a Node — AMAROS Registry",
  description: "Publish a new node package to the AMAROS registry.",
};

export default async function PublishPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Publish a Node</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to publish a new node to the AMAROS
            registry.
          </p>
        </div>

        <PublishForm />
      </section>
    </div>
  );
}
