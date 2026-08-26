# Produktkatalog

Nuxt-4-Anwendung zur Verwaltung eines Produktkatalogs: durchsuchbare, filterbare,
paginierte Produktliste inkl. Anlegen neuer Produkte.

## Setup

```bash
npm install
npm run dev
```

## Build & Qualität

```bash
npm run build
npm run lint
npm run typecheck
npm run test
```

## Architektur

- Nuxt-4-Layer-Struktur: `app/` (UI), `server/` (Nitro-API), `shared/` (Zod-Schemas
  und reine Utils, in beiden Runtimes über `#shared/...` importierbar).
- In-Memory-Produktspeicher (`server/utils/productStorage.ts`), beim Start mit 200
  deterministisch generierten Produkten befüllt (Faker, fester Seed).
- API: `GET /api/products` (gefiltert, paginiert), `POST /api/product` (anlegen).

## Wichtige Entscheidungen

### Datenmodell

- **Preis als Integer in Cent** (nicht Float): vermeidet klassische Rundungsfehler
  von Fließkommazahlen in JavaScript (z. B. `0.1 + 0.2 !== 0.3`).
- **`id`/`createdAt` ausschließlich serverseitig gesetzt**, nie vom Client
  übernommen: verhindert Manipulation dieser Felder durch den Client.
- **`tags` mit Default `[]`**: hält konsumierenden Code frei von zusätzlichen
  `null`/`undefined`-Checks.

### API-Shape

- **`PageOfProduct`-Envelope** (`content` + `pageable`) statt Rohliste: Pagination
  läuft serverseitig, der Client hält nie die komplette Liste im Speicher.
- **Einheitliches Fehlerformat** (`statusCode`/`statusMessage`/`data` mit
  Zod-Issues) an beiden Endpoints, gemäß Projektkonvention für normalisierte
  Zod-Fehler.

### Performance

- Filterung, Sortierung und Pagination laufen **serverseitig**
  (`server/api/products.get.ts`) statt die komplette Liste an den Client zu
  schicken und dort zu filtern.
- Sucheingabe wird mit **300 ms debounced** (`refDebounced`): verhindert einen
  Request pro Tastenanschlag.

## Dependencies

- **`@nuxt/ui`** — fertige Komponenten (Modal, Drawer, Table, Form, Notifications)
  plus Styling, kein eigenes Design-System nötig.
- **`@faker-js/faker`** — realistische, deterministische Demo-Daten für
  die 200 Seed-Produkte.
- **`vitest`, `@vue/test-utils`** — Standard-Test-Stack für
  Nuxt-Projekte.
- **`vue-tsc`** — Typprüfung, sowohl über `npm run typecheck` als auch live
  während `npm run dev` (`typescript.typeCheck: true` in `nuxt.config.ts`).

## Abweichungen von den Standards

- `reactive()` statt `ref`/`shallowRef` für lokalen Komponenten-State
  (`CreateModal.vue`-Formular-State, `Table.vue`-Set-Tracking für
  Expand/Truncate): bewusste Ausnahme, weil Nuxt UIs `UForm` über die
  `:state`-Prop ein `reactive`-Objekt erwartet (offizielles Library-Pattern).

## KI-Nutzung

- **Werkzeug**: Claude Code (Sonnet 5).
- **Von der KI grob erzeugt**: Zod-Schemas und Tests nach genauen Vorgaben, initiale Gerüste
  mehrerer Komponenten sowie README (aus strukturierten Rückfragen und Faktencheck gegen den
  bestehenden Code).
- **Selbst geschrieben/überarbeitet**: Die serverseitige Filter-, Sortier- und Pagination-Logik
  und die zentralen Architektur-Entscheidungen (Datenmodell, API-Shape,
  Persistenz-Ansatz) stammen von mir. Von der KI gelieferte Komponenten-Gerüste habe ich grundlegend
  überarbeitet.
- **Beispiele, wo die KI falsch lag**:
    - Bei der ausklappbaren Produktbeschreibung setzte die KI initial `@click.stop`
      auf das Element. Das unterband das Öffnen des Drawers auch dann, wenn die Beschreibung gar
      nicht ausklappbar war. Behoben durch einen eigenen Event-Handler, der `stopPropagation()` nur
      aufruft, wenn die Beschreibung tatsächlich ausklappbar ist.
    - Es gab kleinere Abweichungen von den in der Claude.md definierten Coding-Standards
- **Ungefähre Gesamtdauer**: ~13 h