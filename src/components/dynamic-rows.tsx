"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { groupRoleLabels, soaCategories, soaCategoryLabel, soaRankings } from "@/lib/labels";

type Option = { id: string; label: string; category?: string; description?: string };
type Row = Record<string, string>;
const rtpRoles = ["leader", "member", "young_professional"] as const;

function workOptionLabel(option: Option) {
  return `${option.label}${option.description ? ` - ${option.description}` : ""}${option.category ? ` - G ${option.category}` : ""}`;
}

function RowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold" type="button" onClick={onClick}>
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ServiceWorkRows({ name, workOptions, initialRows = [] }: { name: string; workOptions: Option[]; initialRows?: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows.length ? initialRows : []);
  const payload = useMemo(() => JSON.stringify(rows.map((row) => {
    const selected = workOptions.find((option) => option.id === row.workReferenceId);
    return { ...row, workId: selected?.label ?? row.workId ?? "", workCategory: selected?.category ?? row.workCategory ?? "" };
  })), [rows, workOptions]);

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={payload} />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold">ID opera</div>
        <RowButton label="Aggiungi ID" onClick={() => setRows([...rows, { workReferenceId: "", workValue: "", sharePercent: "" }])} />
      </div>
      {rows.map((row, index) => (
        <div className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[1.5fr_1fr_1fr_auto]" key={index}>
          <select value={row.workReferenceId ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, workReferenceId: event.target.value } : item))}>
            <option value="">Seleziona ID opera</option>
            {workOptions.map((option) => <option key={option.id} value={option.id}>{workOptionLabel(option)}</option>)}
          </select>
          <input placeholder="Valore lavori €" value={row.workValue ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, workValue: event.target.value } : item))} />
          <input placeholder="Quota %" value={row.sharePercent ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, sharePercent: event.target.value } : item))} />
          <button className="rounded-lg border border-red-200 px-3 text-danger" type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

export function SoaQualificationRows({ name, initialRows = [] }: { name: string; initialRows?: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows.length ? initialRows : []);
  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold">Categorie e classifiche</div>
        <RowButton label="Aggiungi classifica" onClick={() => setRows([...rows, { category: "", ranking: "" }])} />
      </div>
      {rows.map((row, index) => (
        <div className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[1fr_1fr_auto]" key={index}>
          <select value={row.category ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, category: event.target.value } : item))}>
            <option value="">Categoria</option>
            {soaCategories.map((category) => <option key={category} value={category}>{soaCategoryLabel(category)}</option>)}
          </select>
          <select value={row.ranking ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, ranking: event.target.value } : item))}>
            <option value="">Classifica</option>
            {soaRankings.map((ranking) => <option key={ranking} value={ranking}>{ranking}</option>)}
          </select>
          <button className="rounded-lg border border-red-200 px-3 text-danger" type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

export function TenderRequirementRows({ workName, soaName, workOptions, initialWorkRows = [], initialSoaRows = [] }: { workName: string; soaName: string; workOptions: Option[]; initialWorkRows?: Row[]; initialSoaRows?: Row[] }) {
  const [workRows, setWorkRows] = useState<Row[]>(initialWorkRows);
  const [soaRows, setSoaRows] = useState<Row[]>(initialSoaRows);
  const workPayload = JSON.stringify(workRows.map((row) => {
    const selected = workOptions.find((option) => option.id === row.workReferenceId);
    return { ...row, workId: selected?.label ?? row.workId ?? "", category: selected?.category ?? row.category ?? "" };
  }));

  return (
    <div className="grid gap-5">
      <input type="hidden" name={workName} value={workPayload} />
      <input type="hidden" name={soaName} value={JSON.stringify(soaRows)} />
      <div className="grid gap-3">
        <div className="flex items-center justify-between"><div className="text-sm font-bold">ID opera richiesti</div><RowButton label="Aggiungi ID" onClick={() => setWorkRows([...workRows, { workReferenceId: "", amount: "" }])} /></div>
        {workRows.map((row, index) => <div className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[1.5fr_1fr_auto]" key={index}><select value={row.workReferenceId ?? ""} onChange={(event) => setWorkRows(workRows.map((item, i) => i === index ? { ...item, workReferenceId: event.target.value } : item))}><option value="">Seleziona ID opera</option>{workOptions.map((option) => <option key={option.id} value={option.id}>{workOptionLabel(option)}</option>)}</select><input placeholder="Importo €" value={row.amount ?? ""} onChange={(event) => setWorkRows(workRows.map((item, i) => i === index ? { ...item, amount: event.target.value } : item))} /><button className="rounded-lg border border-red-200 px-3 text-danger" type="button" onClick={() => setWorkRows(workRows.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></button></div>)}
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between"><div className="text-sm font-bold">SOA richieste</div><RowButton label="Aggiungi SOA" onClick={() => setSoaRows([...soaRows, { category: "", ranking: "" }])} /></div>
        {soaRows.map((row, index) => <div className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[1fr_1fr_auto]" key={index}><select value={row.category ?? ""} onChange={(event) => setSoaRows(soaRows.map((item, i) => i === index ? { ...item, category: event.target.value } : item))}><option value="">Categoria</option>{soaCategories.map((category) => <option key={category} value={category}>{soaCategoryLabel(category)}</option>)}</select><select value={row.ranking ?? ""} onChange={(event) => setSoaRows(soaRows.map((item, i) => i === index ? { ...item, ranking: event.target.value } : item))}><option value="">Classifica</option>{soaRankings.map((ranking) => <option key={ranking} value={ranking}>{ranking}</option>)}</select><button className="rounded-lg border border-red-200 px-3 text-danger" type="button" onClick={() => setSoaRows(soaRows.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></button></div>)}
      </div>
    </div>
  );
}

export function GroupMemberRows({ name, operatorOptions, initialRows = [] }: { name: string; operatorOptions: Option[]; initialRows?: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="flex items-center justify-between"><div className="text-sm font-bold">RTI della gara</div><RowButton label="Aggiungi operatore" onClick={() => setRows([...rows, { operatorId: "", role: "member", sharePercent: "" }])} /></div>
      {rows.map((row, index) => <div className="grid gap-2 rounded-lg border border-line p-3 md:grid-cols-[1.5fr_1fr_1fr_auto]" key={index}><select value={row.operatorId ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, operatorId: event.target.value } : item))}><option value="">Operatore</option>{operatorOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select><select value={row.role ?? "member"} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, role: event.target.value } : item))}>{rtpRoles.map((value) => <option key={value} value={value}>{groupRoleLabels[value]}</option>)}</select><input placeholder="Quota %" value={row.sharePercent ?? ""} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, sharePercent: event.target.value } : item))} /><button className="rounded-lg border border-red-200 px-3 text-danger" type="button" onClick={() => setRows(rows.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></button></div>)}
    </div>
  );
}
