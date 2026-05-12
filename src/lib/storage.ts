import path from "path";
import { promises as fs } from "fs";

const ROOT_DIR = path.join(process.cwd(), ".local-storage");

function resolve(storagePath: string) {
  const normalized = path.posix.normalize(storagePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const full = path.join(ROOT_DIR, normalized);
  const rootWithSep = ROOT_DIR.endsWith(path.sep) ? ROOT_DIR : ROOT_DIR + path.sep;
  if (!full.startsWith(rootWithSep)) throw new Error("Percorso file non valido.");
  return full;
}

export async function writeStorageFile(storagePath: string, data: Uint8Array) {
  const full = resolve(storagePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, data);
}

export async function readStorageFile(storagePath: string) {
  const full = resolve(storagePath);
  return fs.readFile(full);
}

export async function statStorageFile(storagePath: string) {
  const full = resolve(storagePath);
  return fs.stat(full);
}
