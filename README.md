
# Sistema di Feedback Aziendale

Un'applicazione web moderna per la gestione dei feedback aziendali, costruita con React, TypeScript e Supabase.

## Caratteristiche

- 🔒 Autenticazione sicura degli utenti
- 📝 Invio di feedback anonimi o identificati
- 🤖 Analisi automatica del sentiment dei feedback
- 📊 Dashboard per la gestione dei feedback
- 👥 Gestione dei ruoli utente (dipendenti, manager, admin)

## Tecnologie Utilizzate

- React + TypeScript
- Vite per il bundling
- Tailwind CSS per lo styling
- shadcn/ui per i componenti
- Supabase per backend e autenticazione
- OpenAI per l'analisi del sentiment

## Documentazione

- [Schema del Database](docs/database-schema.sql)

## Struttura del Database

Il database è strutturato in tre tabelle principali:
- `profiles`: Informazioni degli utenti
- `feedback`: Feedback inviati
- `feedback_categories`: Categorie dei feedback

Per i dettagli completi sulla struttura del database, consulta lo [schema SQL](docs/database-schema.sql).

## Sviluppo Locale

1. Clona il repository
```bash
git clone <repository-url>
```

2. Installa le dipendenze
```bash
npm install
```

3. Configura le variabili d'ambiente
Crea un file `.env` nella root del progetto con le seguenti variabili:
```
VITE_SUPABASE_URL=<il-tuo-url-supabase>
VITE_SUPABASE_ANON_KEY=<la-tua-chiave-anonima>
OPENAI_API_KEY=<la-tua-chiave-api-openai>    # Richiesta per l'analisi del sentiment
```

4. Avvia il server di sviluppo
```bash
npm run dev
```

## Deploy

L'applicazione può essere distribuita su qualsiasi hosting che supporti applicazioni Node.js. Assicurati di configurare le variabili d'ambiente necessarie nel tuo ambiente di produzione.

## Licenza

Questo progetto è sotto licenza MIT. Vedi il file LICENSE per i dettagli.
