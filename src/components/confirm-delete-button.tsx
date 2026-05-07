"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({ message = "Confermi l'eliminazione? L'operazione non puo essere annullata." }: { message?: string }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-danger"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <Trash2 className="h-4 w-4" />
      Elimina
    </button>
  );
}
