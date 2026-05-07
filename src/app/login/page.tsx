import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn } from "@/app/login/actions";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const errorMessages: Record<string, string> = {
  invalid: "Email o password non corretti.",
  "missing-config": "Supabase Auth non e configurato. Aggiungi le variabili ambiente prima del deploy."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const params = await searchParams;

  if (isSupabaseAuthConfigured()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (user) redirect("/");
  }

  const message = params.error ? errorMessages[params.error] ?? "Accesso non riuscito." : null;
  const next = params.next ?? "/";

  return (
    <main className="grid min-h-screen place-items-center bg-app px-4 py-8">
      <section className="w-full max-w-md rounded-lg border border-line bg-panel p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg border border-line bg-white">
            <Image src="/ac-studio-logo.png" alt="AC Studio" width={30} height={30} className="h-8 w-8 object-contain" priority />
          </div>
          <div>
            <h1 className="text-base font-bold uppercase tracking-wide text-ink">AC STUDIO</h1>
            <p className="text-sm text-muted">My Tender CRM</p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-ink">Accesso</h2>
          <p className="mt-1 text-sm text-muted">Entra con il tuo account abilitato su Supabase.</p>
        </div>

        {message ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-danger">{message}</div> : null}

        {!isSupabaseAuthConfigured() ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Login pronto, ma mancano le variabili Supabase. In locale la piattaforma resta accessibile per non bloccarti.
          </div>
        ) : (
          <form action={signIn} className="grid gap-4">
            <input type="hidden" name="next" value={next} />
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-ink">
              <span>Password</span>
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button className="rounded-lg bg-teal px-4 py-2.5 text-sm font-semibold text-white" type="submit">
              Accedi
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
