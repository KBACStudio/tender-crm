import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/format";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-normal text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm text-muted">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Link className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" href={actionHref}>
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function Panel({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return <section className={cn("rounded-lg border border-line bg-panel shadow-soft", className)} {...props}>{children}</section>;
}

export function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Panel className="p-4">
      <div className="text-xs font-semibold uppercase text-muted">{label}</div>
      <div className="mt-2 text-3xl font-bold text-ink">{value}</div>
    </Panel>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700"
  };
  return <span className={cn("inline-flex rounded-md px-2 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-panel">
      <table className="min-w-full divide-y divide-line text-sm">{children}</table>
    </div>
  );
}

export function SearchBar({ placeholder = "Cerca", extra }: { placeholder?: string; extra?: React.ReactNode }) {
  return (
    <form className="mb-4 grid gap-3 rounded-lg border border-line bg-panel p-3 md:grid-cols-[1fr_auto]">
      <input name="q" placeholder={placeholder} />
      <div className="flex gap-2">
        {extra}
        <button className="rounded-lg border border-line px-4 py-2 text-sm font-semibold" type="submit">
          Filtra
        </button>
      </div>
    </form>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function FormActions({ cancelHref }: { cancelHref: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-line pt-4">
      <button className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-white" type="submit">
        Salva
      </button>
      <Link className="rounded-lg border border-line px-4 py-2 text-sm font-semibold" href={cancelHref}>
        Annulla
      </Link>
    </div>
  );
}

export function DeleteButton({ action, message }: { action: () => Promise<void>; message?: string }) {
  return (
    <form action={action}>
      <ConfirmDeleteButton message={message} />
    </form>
  );
}
