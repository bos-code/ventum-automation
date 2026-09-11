import { BUSINESS } from "@/lib/constants";

// Placeholder home route — the full catalogue homepage is built in a later stage.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-3 px-4 py-16">
      <h1 className="text-2xl font-semibold">{BUSINESS.name}</h1>
      <p className="text-muted-foreground">{BUSINESS.tagline}</p>
    </main>
  );
}
