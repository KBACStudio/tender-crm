import crypto from "crypto";

type Payload = {
  docId: string;
  userId: string;
  organizationId: string;
  exp: number;
};

function base64UrlEncode(input: Buffer) {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 ? "=".repeat(4 - (normalized.length % 4)) : "";
  return Buffer.from(normalized + pad, "base64");
}

function secret() {
  return process.env.WOPI_SECRET ?? "dev-wopi-secret";
}

export function createWopiAccessToken(docId: string, userId: string, organizationId: string, ttlSeconds = 60 * 60) {
  const payload: Payload = { docId, userId, organizationId, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = base64UrlEncode(crypto.createHmac("sha256", secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyWopiAccessToken(token: string | null | undefined) {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = base64UrlEncode(crypto.createHmac("sha256", secret()).update(body).digest());
  if (expected.length !== sig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  const payload = JSON.parse(base64UrlDecode(body).toString("utf8")) as Payload;
  if (!payload?.docId || !payload?.userId || !payload?.organizationId || !payload?.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}
