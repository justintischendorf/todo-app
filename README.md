# Todo-App

Eine Full-Stack-Webanwendung zur Verwaltung von Todos mit Benutzerauthentifizierung. Gebaut mit **Angular**, **Elysia (Bun)** und **PostgreSQL**.

---

## Inhaltsverzeichnis

- [Architektur](#architektur)
- [Tech-Stack](#tech-stack)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Installation & Start](#installation--start)
- [Verfügbare Scripts](#verfügbare-scripts)
- [API-Endpunkte](#api-endpunkte)
- [Authentifizierung](#authentifizierung)
- [Datenbankschema](#datenbankschema)
- [Sequenzdiagramm](#sequenzdiagramm)

---

## Architektur

```
┌─────────────┐       ┌─────────────────┐       ┌────────────┐
│   Angular    │──────▶│   Elysia REST   │──────▶│ PostgreSQL │
│   Frontend   │◀──────│   API (Bun)     │◀──────│            │
│  :4200       │       │  :3000          │       │  :5432     │
└─────────────┘       └─────────────────┘       └────────────┘
```

- **Frontend** kommuniziert ausschließlich über HTTP mit der REST-API
- **Interceptor** fügt automatisch Bearer-Tokens an und erneuert abgelaufene Tokens
- **Auth Guard** schützt alle `/todos`-Routen serverseitig
- Jeder Nutzer sieht nur seine eigenen Todos (Row-Level Scoping via `userId`)

---

## Tech-Stack

| Schicht       | Technologie                          |
|---------------|--------------------------------------|
| Frontend      | Angular 21, Signals, SSR             |
| Backend       | Elysia 1.4 auf Bun                  |
| Datenbank     | PostgreSQL 16                        |
| ORM           | Prisma 7 mit `@prisma/adapter-pg`   |
| Auth          | JWT (Access + Refresh Token)         |
| Hashing       | Argon2 (`@node-rs/argon2`)           |
| Container     | Docker Compose                       |

---

## Projektstruktur

```
todo-app/
├── app/
│   ├── rest/src/                   # Backend
│   │   ├── index.ts                # Elysia-Server, CORS, Error-Handling
│   │   ├── lib/
│   │   │   ├── jwt.ts              # Token-Erstellung & -Verifizierung
│   │   │   ├── hashing.ts          # Argon2 Passwort-Hashing
│   │   │   └── cookies.ts          # HttpOnly-Cookie-Helpers
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── index.ts        # Auth-Routen (Register, Login, Refresh, Logout)
│   │       │   ├── guard.ts        # Token-Validierung Middleware
│   │       │   ├── model.ts        # Request-Validierung (Elysia Schemas)
│   │       │   └── service.ts      # Auth-Geschäftslogik
│   │       └── todos/
│   │           ├── index.ts        # CRUD-Routen
│   │           ├── model.ts        # Request-Validierung
│   │           └── service.ts      # Todo-Datenbankoperationen
│   └── website/todo-ang/           # Frontend
│       └── src/app/
│           ├── components/
│           │   ├── auth/
│           │   │   ├── login/      # Login-Seite
│           │   │   └── register/   # Registrierungs-Seite
│           │   ├── homepage/       # Todo-Übersicht
│           │   │   └── todo/       # Einzelne Todo-Karte (Presentational)
│           │   └── shared/
│           │       └── stars/      # Wiederverwendbare Sterne-Animation
│           ├── guards/             # Angular Route Guard
│           ├── interceptors/       # HTTP Auth Interceptor
│           ├── models/             # Shared Interfaces
│           ├── services/           # Auth- & Todo-Services
│           └── environment.ts      # API-URL Konfiguration
├── packages/
│   ├── database/prisma/            # Prisma Schema, Migrationen, Client
│   └── diagrams/                   # PlantUML Sequenzdiagramm
├── docker-compose-dev.yml          # Dev-Umgebung (DB + Services)
├── .env                            # Umgebungsvariablen (nicht im Git)
└── package.json                    # Monorepo-Scripts
```

---

## Voraussetzungen

- [Bun](https://bun.sh/) (>= 1.0)
- [Node.js](https://nodejs.org/) (>= 22, für Angular CLI)
- [Docker](https://www.docker.com/) & Docker Compose

---

## Installation & Start

### 1. Repository klonen

```bash
git clone <repository-url>
cd todo-app
```

### 2. Abhängigkeiten installieren

```bash
# Backend-Abhängigkeiten
bun install

# Frontend-Abhängigkeiten
cd app/website/todo-ang && npm install && cd ../../..
```

### 3. Umgebungsvariablen konfigurieren

Eine `.env`-Datei im Projektroot erstellen:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/todo"
ACCESS_TOKEN_SECRET="access-secret-change-in-production"
REFRESH_TOKEN_SECRET="refresh-secret-change-in-production"
NODE_ENV="development"
```

### 4. Datenbank starten & migrieren

```bash
# PostgreSQL via Docker starten
bun run docker:dev

# Datenbank-Schema anwenden
bunx prisma migrate deploy
```

### 5. Services starten

```bash
# Backend (Port 3000, Watch-Mode)
bun run rest

# Frontend (Port 4200)
bun run website
```

Die Anwendung ist dann unter **http://localhost:4200** erreichbar.

---

## Verfügbare Scripts

| Script           | Befehl                     | Beschreibung                                  |
|------------------|----------------------------|-----------------------------------------------|
| `bun run rest`   | Backend starten            | Elysia-Server mit Hot-Reload auf Port 3000    |
| `bun run website`| Frontend starten           | Angular Dev-Server auf Port 4200              |
| `bun run docker:dev` | Docker-Umgebung starten | PostgreSQL + Services via Docker Compose      |
| `bun run db:show`| Prisma Studio              | Visuelle Datenbank-Oberfläche                 |
| `bun run db:clear`| Datenbank leeren          | Alle Einträge aus Todo- und User-Tabellen     |

---

## API-Endpunkte

### Authentifizierung

| Methode | Endpunkt             | Beschreibung              | Auth |
|---------|----------------------|---------------------------|------|
| POST    | `/api/auth/register` | Neuen Benutzer anlegen    | ✗    |
| POST    | `/api/auth/login`    | Anmelden, Token erhalten  | ✗    |
| POST    | `/api/auth/refresh`  | Access Token erneuern      | Cookie |
| POST    | `/api/auth/logout`   | Abmelden, Cookie löschen   | Cookie |

### Todos (alle geschützt)

| Methode | Endpunkt           | Beschreibung                |
|---------|--------------------|-----------------------------|
| GET     | `/api/todos`       | Alle eigenen Todos abrufen  |
| POST    | `/api/todos`       | Neues Todo erstellen        |
| PATCH   | `/api/todos/:id`   | Todo aktualisieren          |
| DELETE  | `/api/todos/:id`   | Einzelnes Todo löschen      |
| DELETE  | `/api/todos`       | Alle eigenen Todos löschen  |

---

## Authentifizierung

Die Anwendung nutzt ein **Dual-Token-System**:

- **Access Token** (15 Minuten) — wird im Speicher des Frontends gehalten (kein localStorage) und als `Authorization: Bearer <token>` Header gesendet
- **Refresh Token** (7 Tage) — wird als `HttpOnly`-Cookie mit `SameSite=Strict` gesetzt und ist für JavaScript nicht zugänglich

### Ablauf

1. **Login**: Server gibt Access Token im Body und Refresh Token als Cookie zurück
2. **API-Requests**: Interceptor hängt automatisch den Bearer Token an
3. **Token abgelaufen**: Bei 401 wird automatisch `/auth/refresh` aufgerufen, neues Token-Paar erstellt (Rotation) und der ursprüngliche Request wiederholt
4. **Logout**: Cookie wird serverseitig gelöscht, Token im Memory verworfen

Passwörter werden mit **Argon2** gehasht — einem speicherintensiven Algorithmus, der gegen Brute-Force-Angriffe resistent ist.

---

## Datenbankschema

```
┌──────────────────────────┐       ┌──────────────────────────┐
│          User            │       │          Todo            │
├──────────────────────────┤       ├──────────────────────────┤
│ id        UUID (PK)      │       │ id          UUID (PK)    │
│ email     String (unique)│──────▶│ userId      UUID (FK)    │
│ username  String (unique)│       │ title       String       │
│ password  String         │       │ description String       │
│ createdAt DateTime       │       │ createdAt   DateTime     │
└──────────────────────────┘       └──────────────────────────┘
                                    ON DELETE CASCADE
```

---

## Sequenzdiagramm

Das folgende Diagramm zeigt den vollständigen Kommunikationsfluss zwischen allen Komponenten — von der Registrierung über authentifizierte CRUD-Operationen bis zum automatischen Token-Refresh.

![Sequenzdiagramm](packages/diagrams/sequence.png)
