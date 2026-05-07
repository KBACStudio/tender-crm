# Technical CRM MVP

Gestionale locale per società, persone, professionisti, certificazioni, SOA, servizi svolti, gare d'appalto e raggruppamenti / RTI.

## Scelte architetturali

- Next.js App Router con TypeScript e Server Actions per mantenere il CRUD semplice e vicino al modello dati.
- PostgreSQL + Prisma ORM, con schema relazionale normalizzato: la ricerca operativa ruota attorno a `EconomicOperator`, che può rappresentare una società o un libero professionista.
- I servizi possono contenere più ID opera, più livelli di progettazione, parcella separata dal valore lavori e quote/percentuali riferite all'operatore economico.
- Le gare possono salvare requisiti ID opera e requisiti SOA tramite righe aggiungibili, oltre al RTI creato direttamente dentro la gara.
- UI dashboard sobria con Tailwind CSS e componenti locali, senza servizi cloud obbligatori e senza autenticazione nel primo MVP.

## Avvio rapido

```bash
cp .env.example .env
docker compose up --build
```

App: `http://localhost:3000`

Se la porta `3000` è già occupata:

```bash
APP_PORT=3001 docker compose up --build
```

Su PowerShell:

```powershell
$env:APP_PORT="3001"; docker compose up --build
```

## Migrazioni Prisma

Con i container attivi:

```bash
docker compose exec app npx prisma migrate deploy
```

Per creare nuove migration durante lo sviluppo:

```bash
docker compose exec app npx prisma migrate dev
```

## Seed dati

```bash
docker compose exec app npm run prisma:seed
```

Il seed crea società, persone, professionisti, certificazioni, SOA, un servizio, un RTI e una gara di esempio.

## Accesso al database

```bash
docker compose exec db psql -U app -d technical_crm
```

Oppure Prisma Studio:

```bash
docker compose exec app npx prisma studio
```

## Fermare tutto

```bash
docker compose down
```

Per rimuovere anche il volume PostgreSQL:

```bash
docker compose down -v
```

## Sezioni incluse

- Ricerca operativa iniziale per ID opera, SOA, certificazioni, CIG e operatori economici.
- Operatori economici con fatturato storico.
- Anagrafica ID Opera usata dai menu a tendina di servizi e gare.
- Società con dettaglio, persone collegate, certificazioni, SOA, servizi e partecipazioni RTI.
- Persone e professionisti con dati professionali separati.
- Certificazioni e SOA con stati di scadenza.
- Servizi svolti con operatori assegnati, percentuali, ID opera multipli da menu a tendina, livelli multipli, valore lavori e parcella.
- Gare con CIG/CUP, dati base, requisiti ID opera, requisiti SOA, esito e RTI interno alla gara.

## Note e limiti MVP

L'app è pronta per sviluppo locale e CRUD reali. Non include autenticazione, permessi avanzati, upload fisico dei documenti o cancellazione puntuale dei singoli membri RTI da UI; lo schema contiene già `Document` e `Note` come base semplice per estendere queste funzioni.
