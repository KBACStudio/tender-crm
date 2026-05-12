import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { contractMilestoneStatusLabels, contractTaskAreaLabels, contractTaskStatusLabels, tenderTaskAreaLabels, tenderTaskStatusLabels } from "@/lib/labels";
import { Badge, PageHeader, Panel, Table } from "@/components/ui";
import { requireOrganization } from "@/server/auth";

type CalendarEvent = {
  id: string;
  date: Date;
  title: string;
  href: string;
  kind: "gara" | "attivita" | "appalto" | "milestone";
  subtitle: string;
};

const dayLabels = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const monthFormatter = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" });
const isoFormatter = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Rome" });

function parseBaseDate(value?: string) {
  if (!value) return new Date();
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  return isoFormatter.format(date);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(date: Date) {
  const day = date.getDay() || 7;
  return addDays(startOfDay(date), 1 - day);
}

function calendarDays(view: string, baseDate: Date) {
  if (view === "day") return [startOfDay(baseDate)];
  if (view === "week") return Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(baseDate), index));
  const first = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const gridStart = startOfWeek(first);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function eventTone(kind: CalendarEvent["kind"]) {
  if (kind === "gara") return "warning";
  if (kind === "milestone") return "success";
  return "neutral";
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ view?: string; date?: string }> }) {
  const params = await searchParams;
  const view = params.view === "day" || params.view === "week" ? params.view : "month";
  const baseDate = parseBaseDate(params.date);
  const days = calendarDays(view, baseDate);
  const rangeStart = days[0];
  const rangeEnd = addDays(days[days.length - 1], 1);
  const { organization } = await requireOrganization();
  const organizationId = organization.id;

  const [tenders, tasks, contractTasks, milestones, agendaTenders, agendaTasks, agendaContractTasks, agendaMilestones] = await Promise.all([
    prisma.tender.findMany({ where: { organizationId, deadline: { gte: rangeStart, lt: rangeEnd } }, orderBy: { deadline: "asc" } }),
    prisma.tenderTask.findMany({ where: { organizationId, dueDate: { gte: rangeStart, lt: rangeEnd } }, include: { tender: true, operator: true }, orderBy: { dueDate: "asc" } }),
    prisma.contractTask.findMany({ where: { organizationId, dueDate: { gte: rangeStart, lt: rangeEnd } }, include: { contract: { include: { tender: true } } }, orderBy: { dueDate: "asc" } }),
    prisma.contractMilestone.findMany({ where: { organizationId, plannedAt: { gte: rangeStart, lt: rangeEnd } }, include: { contract: { include: { tender: true } } }, orderBy: { plannedAt: "asc" } }),
    prisma.tender.findMany({ where: { organizationId, deadline: { not: null } }, orderBy: { deadline: "asc" }, take: 20 }),
    prisma.tenderTask.findMany({ where: { organizationId, dueDate: { not: null }, status: { not: "done" } }, include: { tender: true, operator: true }, orderBy: { dueDate: "asc" }, take: 30 }),
    prisma.contractTask.findMany({ where: { organizationId, dueDate: { not: null }, status: { not: "done" } }, include: { contract: { include: { tender: true } } }, orderBy: { dueDate: "asc" }, take: 30 }),
    prisma.contractMilestone.findMany({ where: { organizationId, plannedAt: { not: null }, status: { not: "done" } }, include: { contract: { include: { tender: true } } }, orderBy: { plannedAt: "asc" }, take: 30 })
  ]);

  const events: CalendarEvent[] = [
    ...tenders.filter((tender) => tender.deadline).map((tender) => ({ id: `tender-${tender.id}`, date: tender.deadline as Date, title: tender.object, href: `/tenders/${tender.id}`, kind: "gara" as const, subtitle: `CIG ${tender.cig}` })),
    ...tasks.filter((task) => task.dueDate).map((task) => ({ id: `task-${task.id}`, date: task.dueDate as Date, title: task.title, href: `/tenders/${task.tender.id}`, kind: "attivita" as const, subtitle: `${tenderTaskAreaLabels[task.area]} - ${task.operator?.displayName ?? "Generale"}` })),
    ...contractTasks.filter((task) => task.dueDate).map((task) => ({ id: `contract-task-${task.id}`, date: task.dueDate as Date, title: task.title, href: `/contracts/${task.contract.id}`, kind: "appalto" as const, subtitle: `Appalto - ${contractTaskAreaLabels[task.area]}` })),
    ...milestones.filter((m) => m.plannedAt).map((m) => ({ id: `milestone-${m.id}`, date: m.plannedAt as Date, title: m.title, href: `/contracts/${m.contract.id}`, kind: "milestone" as const, subtitle: `Appalto - ${contractMilestoneStatusLabels[m.status]}` }))
  ];
  const agenda = [
    ...agendaTenders.filter((tender) => tender.deadline).map((tender) => ({ id: `agenda-tender-${tender.id}`, date: tender.deadline as Date, title: tender.object, href: `/tenders/${tender.id}`, kind: "gara" as const, subtitle: `CIG ${tender.cig}` })),
    ...agendaTasks.filter((task) => task.dueDate).map((task) => ({ id: `agenda-task-${task.id}`, date: task.dueDate as Date, title: task.title, href: `/tenders/${task.tender.id}`, kind: "attivita" as const, subtitle: `${tenderTaskStatusLabels[task.status]} - ${task.operator?.displayName ?? "Generale"}` })),
    ...agendaContractTasks.filter((task) => task.dueDate).map((task) => ({ id: `agenda-contract-task-${task.id}`, date: task.dueDate as Date, title: task.title, href: `/contracts/${task.contract.id}`, kind: "appalto" as const, subtitle: `${contractTaskStatusLabels[task.status]} - ${task.contract.tender.object}` })),
    ...agendaMilestones.filter((m) => m.plannedAt).map((m) => ({ id: `agenda-milestone-${m.id}`, date: m.plannedAt as Date, title: m.title, href: `/contracts/${m.contract.id}`, kind: "milestone" as const, subtitle: `${contractMilestoneStatusLabels[m.status]} - ${m.contract.tender.object}` }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 25);

  const previousDate = view === "day" ? addDays(baseDate, -1) : view === "week" ? addDays(baseDate, -7) : new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1);
  const nextDate = view === "day" ? addDays(baseDate, 1) : view === "week" ? addDays(baseDate, 7) : new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);

  return (
    <>
      <PageHeader title="Calendario" description="Vista operativa di gare e attivita, con scadenziario sempre leggibile." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel p-3">
        <div className="flex flex-wrap gap-2">
          {(["day", "week", "month"] as const).map((mode) => <Link key={mode} className={`rounded-lg px-3 py-2 text-sm font-semibold ${view === mode ? "bg-teal text-white" : "border border-line"}`} href={`/calendar?view=${mode}&date=${toIsoDate(baseDate)}`}>{mode === "day" ? "Giorno" : mode === "week" ? "Settimana" : "Mese"}</Link>)}
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Link className="rounded-lg border border-line px-3 py-2" href={`/calendar?view=${view}&date=${toIsoDate(previousDate)}`}>Precedente</Link>
          <span className="min-w-48 text-center capitalize">{view === "month" ? monthFormatter.format(baseDate) : `${formatDate(rangeStart)} - ${formatDate(addDays(rangeEnd, -1))}`}</span>
          <Link className="rounded-lg border border-line px-3 py-2" href={`/calendar?view=${view}&date=${toIsoDate(nextDate)}`}>Successivo</Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[3fr_1fr]">
        <Panel className="p-4">
          <div className={`grid gap-2 ${view === "day" ? "grid-cols-1" : "grid-cols-7"}`}>
            {view !== "day" ? dayLabels.map((label) => <div key={label} className="px-2 text-xs font-bold uppercase text-muted">{label}</div>) : null}
            {days.map((day) => {
              const dayEvents = events.filter((event) => sameDay(event.date, day));
              const isMuted = view === "month" && day.getMonth() !== baseDate.getMonth();
              return (
                <div key={day.toISOString()} className={`min-h-32 rounded-lg border border-line bg-app p-2 ${isMuted ? "opacity-45" : ""}`}>
                  <div className="mb-2 flex items-center justify-between text-xs font-bold"><span>{day.getDate()}</span><span>{view === "day" ? dayLabels[(day.getDay() + 6) % 7] : ""}</span></div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => <Link key={event.id} className="block rounded-md border border-line bg-panel px-2 py-1 text-xs" href={event.href}><Badge tone={eventTone(event.kind)}>{event.kind}</Badge><div className="mt-1 font-semibold text-ink">{event.title}</div><div className="text-muted">{event.subtitle}</div></Link>)}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="p-4">
          <h2 className="mb-3 font-bold">Scadenziario</h2>
          <Table>
            <tbody className="divide-y divide-line">
              {agenda.map((item) => <tr key={item.id}><td className="px-3 py-2"><Link className="font-semibold text-teal" href={item.href}>{item.title}</Link><div className="text-xs text-muted">{item.subtitle}</div></td><td className="px-3 py-2 whitespace-nowrap">{formatDate(item.date)}</td></tr>)}
            </tbody>
          </Table>
        </Panel>
      </div>
    </>
  );
}
