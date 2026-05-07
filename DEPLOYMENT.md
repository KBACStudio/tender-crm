# Deploy Vercel + Supabase

## Variabili ambiente

Impostare queste variabili su Vercel, in `Project Settings` -> `Environment Variables`.

```env
NEXT_PUBLIC_SUPABASE_URL="https://fezayrvxzqtumazspnpy.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
DATABASE_URL="..."
DIRECT_URL="..."
```

Per Prisma con Supabase:
- `DATABASE_URL`: connection string pooled/transaction pooler, usata dall'app.
- `DIRECT_URL`: direct connection, usata da Prisma per le migration.

Non committare mai file `.env`, `.env.local` o stringhe con password.

## Migration

Eseguire le migration sul database Supabase con:

```bash
npx prisma migrate deploy
```

Il comando richiede `DATABASE_URL` e `DIRECT_URL` corretti nell'ambiente locale o nella shell.

## Utente iniziale

Creare l'utente da Supabase:

`Authentication` -> `Users` -> `Add user`

L'app non espone registrazione pubblica. L'accesso avviene da `/login`.

## Dominio

Dopo il deploy su Vercel:

1. `Project Settings` -> `Domains`
2. Aggiungere `crm.ccampolo.it`
3. Su Aruba creare il record DNS indicato da Vercel, di norma:

```text
Tipo: CNAME
Host: crm
Valore: cname.vercel-dns.com
```
