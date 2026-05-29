# Famous Quote Quiz

A full-stack quiz application where users guess the authors of famous quotes. Supports two quiz modes (Yes/No and Multiple Choice), an admin panel for managing users and quotes, and a game history view.

---

## Solution Structure

```
Quote Quiz/
├── QuoteQuiz.Api/          # ASP.NET Core Web API (backend)
└── quote-quiz-ui/          # React + TypeScript (frontend)
```

---

## Backend

### Tech Stack

| Technology | Purpose |
|---|---|
| ASP.NET Core 10 | Web API framework |
| Entity Framework Core 10 | ORM and database migrations |
| SQL Server | Database |
| FluentValidation | Request validation |
| Swagger / OpenAPI | API documentation |

### Architecture

The backend follows a layered architecture:

- **Controllers** — handle HTTP requests, return responses, catch exceptions
- **Services** — contain business logic, orchestrate repository calls
- **Repositories** — data access layer built on top of EF Core; a generic `Repository<T>` handles common operations, with specialized repositories (`QuoteRepository`, `UserRepository`, `GameRepository`) for entity-specific queries
- **Models** — EF Core entities (`User`, `Quote`, `QuizGame`, `QuizAnswer`)
- **DTOs** — data shapes exposed to the client (never expose entities directly)
- **Validators** — FluentValidation classes for create/update DTOs

### Database

The database is SQL Server. Migrations are managed with EF Core and are applied automatically on startup in the Development environment.

Seed data includes 3 users and 10 quotes.

**Entities:**

- `Users` — username, email, active/deleted status
- `Quotes` — quote text, author, soft-delete support
- `QuizGames` — links a session to a user with a timestamp
- `QuizAnswers` — one row per answer: quote, selected answer, suggested options, whether it was correct

### API Endpoints

#### Quotes
| Method | Route | Description |
|---|---|---|
| GET | `/api/quotes` | Get all quotes (paginated, searchable, sortable) |
| GET | `/api/quotes/{id}` | Get quote by ID |
| POST | `/api/quotes` | Create a new quote |
| PUT | `/api/quotes/{id}` | Update a quote |
| DELETE | `/api/quotes/{id}` | Soft delete a quote |

#### Users
| Method | Route | Description |
|---|---|---|
| GET | `/api/users` | Get all users (paginated, searchable, sortable) |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Soft delete a user |

#### Game
| Method | Route | Description |
|---|---|---|
| GET | `/api/quotes/random` | Get a random quote with multiple choice answer options |
| POST | `/api/games` | Save a completed game session with all answers |
| GET | `/api/games/user/{userId}` | Get a user's full game history with per-answer details |

### Running the Backend

```bash
cd QuoteQuiz.Api/QuoteQuiz.Api
dotnet run
```

The API starts at `https://localhost:7xxx` (exact port shown in the console).  
Swagger UI is available at the root URL `/` (redirects to `/swagger`).

The connection string is configured in `appsettings.json` under `ConnectionStrings:DefaultConnection`.

---

## Frontend

### Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool and dev server |
| React Router 7 | Client-side routing |
| Axios | HTTP client |

### Pages and Routes

| Route | Component | Description |
|---|---|---|
| `/` | `StartScreen` | Select a user and start the quiz |
| `/quiz` | `QuizPage` | Active quiz session |
| `/settings` | `SettingsPage` | Application settings (quiz mode selection) |
| `/admin` | `AdminDashboard` | Admin panel landing page |
| `/admin/users` | `UserManagement` | Create, edit, and delete users |
| `/admin/quotes` | `QuoteManagement` | Create, edit, and delete quotes |
| `/admin/achievements` | `UserAchievements` | View all users' game history and answers |

### Quiz Modes

- **Binary mode** — shows a quote and a suggested author name; the user answers Yes or No
- **Multiple Choice mode** — shows a quote and three author options (1 correct, 2 wrong); the user picks one

The mode is selected in Settings and persisted for the session.

### State Management

Global quiz state (current user, current quote, answers collected so far, quiz mode) is managed with React's `useReducer` via a `QuizContext` provider.

### Running the Frontend

```bash
cd quote-quiz-ui
npm install       # first time only
npm run dev
```

The dev server starts at `http://localhost:5173`.

The API base URL is configured in the API service file. Make sure the backend is running before starting the frontend.

---

## Running the Full Application

1. Start the backend:
   ```bash
   cd QuoteQuiz.Api/QuoteQuiz.Api
   dotnet run
   ```

2. Start the frontend in a separate terminal:
   ```bash
   cd quote-quiz-ui
   npm run dev
   ```

3. Open `http://localhost:5173` in a browser.
