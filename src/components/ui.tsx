import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table as ShadcnTable } from "@/components/ui/table";

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
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? (
        <Button asChild>
          <Link href={actionHref}>
            <Plus data-icon="inline-start" />
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

export function Panel({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <Card className={cn("rounded-xl", className)} {...props}>
      {children}
    </Card>
  );
}

export function Kpi({ label, value }: { label: string; value: number | string }) {
  return (
    <Panel className="p-4">
      <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</div>
    </Panel>
  );
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  const variant = tone === "danger" ? "destructive" : tone === "neutral" ? "secondary" : "outline";
  return <ShadcnBadge variant={variant}>{children}</ShadcnBadge>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <ShadcnTable className="w-full">{children}</ShadcnTable>
    </div>
  );
}

export function SearchBar({ placeholder = "Cerca", extra }: { placeholder?: string; extra?: React.ReactNode }) {
  return (
    <form className="mb-4 grid gap-3 rounded-xl border bg-card p-3 md:grid-cols-[1fr_auto]">
      <Input name="q" placeholder={placeholder} />
      <div className="flex gap-2">
        {extra}
        <Button variant="outline" type="submit">
          Filtra
        </Button>
      </div>
    </form>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

export function FormActions({ cancelHref }: { cancelHref: string }) {
  return (
    <div className="flex flex-wrap gap-2 border-t pt-4">
      <Button type="submit">Salva</Button>
      <Button asChild variant="outline" type="button">
        <Link href={cancelHref}>Annulla</Link>
      </Button>
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
