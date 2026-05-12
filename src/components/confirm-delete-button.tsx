"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteButton({ message = "Confermi l'eliminazione? L'operazione non puo essere annullata." }: { message?: string }) {
  return (
    <Button
      variant="destructive"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <Trash2 data-icon="inline-start" />
      Elimina
    </Button>
  );
}
