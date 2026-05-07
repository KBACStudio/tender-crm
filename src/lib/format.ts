import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value?: Date | string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT").format(new Date(value));
}

export function formatCurrency(value?: number | string | null) {
  if (value === null || value === undefined || value === "") return "-";
  const amount = typeof value === "string" ? Number(value.replace(",", ".")) : value;
  if (!Number.isFinite(amount)) return "-";
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount);
}

export function expirationStatus(value?: Date | string | null) {
  if (!value) return { label: "Senza scadenza", tone: "neutral" as const };
  const today = new Date();
  const expires = new Date(value);
  const diffDays = Math.ceil((expires.getTime() - today.getTime()) / 86_400_000);
  if (diffDays < 0) return { label: "Scaduta", tone: "danger" as const };
  if (diffDays <= 30) return { label: "Entro 30 gg", tone: "danger" as const };
  if (diffDays <= 90) return { label: "Entro 90 gg", tone: "warning" as const };
  return { label: "Valida", tone: "success" as const };
}

export function toDateInput(value?: Date | null) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}
