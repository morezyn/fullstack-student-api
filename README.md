# Student Management System — Strict 3-Tier Architecture

A full-stack Student Management System separated into three strict layers:

```
fullstack-student-api/
│
├── package.json                     # Root package (dev/build/start scripts)
├── node_modules/
│
├── client/                          # ═══ LAYER 1 · PRESENTATION ═══
│   ├── index.html                   # Vite entry point
│   ├── vite.config.ts               # React + Tailwind plugins, /api proxy → :3000
│   └── src/
│       ├── main.tsx                 # React root
│       ├── App.tsx                  # Student management UI (form + table)
│       ├── index.css                # Tailwind v4 entry
│       ├── types/student.ts         # Student / StudentPayload types
│       ├── api/students.ts          # Typed fetch wrapper (all 5 CRUD calls)
│       └── components/
│           ├── StudentForm.tsx      # Add/edit form with validation
│           └── StudentTable.tsx     # Students table with Edit/Delete actions
│
├── server/                          # ═══ LAYER 2 · APPLICATION ═══
│   ├── .env                         # MONGODB_URI + DB_NAME (gitignored)
│   └── src/
│       ├── server.js                # Entry point (connects to DB, then listens)
│       ├── app.js                   # Express app, static client/dist, route mounting
│       ├── routes/
│       │   └── student.routes.js    # The 5 REST endpoints
│       ├── controllers/
│       │   └── student.controller.js# HTTP request/response handling
│       ├── services/
│       │   └── student.service.js   # Business logic + validation
│       ├── repositories/
│       │   └── student.repository.js# Mongo queries (only consumer of Data Layer)
│       ├── utils/
│       │   └── asyncHandler.js      # Wraps async handlers for Express 4
│       └── middleware/
│           ├── validateStudent.middleware.js
│           └── errorHandler.middleware.js
│
└── database/                        # ═══ LAYER 3 · DATA ═══
    ├── db.js                        # MongoClient connection + schema/seed init
    ├── schema.js                    # $jsonSchema validator + unique email index
    └── seed.js                      # Sample students (IDs 101-103) + counter init
```

**Dependency direction:** `Presentation → Application → Data` (one-way only).

## Tech Stack

| Layer | Technology |
|---|---|
| Presentation | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| Application | Node.js + Express (`express`, `cors`) |
| Data | MongoDB Atlas (`mongodb` driver, Stable API v1) |

## API Endpoints

| Method | Endpoint              | Description                    | Success      |
|--------|-----------------------|--------------------------------|--------------|
| GET    | `/api/students`       | List all students              | `200`        |
| GET    | `/api/students/:id`   | Get student by id (e.g. 101)   | `200`        |
| POST   | `/api/students`       | Create a new student           | `201`        |
| PUT    | `/api/students/:id`   | Update a student (full replace)| `200`        |
| DELETE | `/api/students/:id`   | Delete a student               | `200`        |

Request/response body (camelCase):

```json
{
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "dateOfBirth": "1815-12-10",
  "major": "Computer Science",
  "enrollmentYear": 2023
}
```

## Setup & Run

```powershell
# 1. Install dependencies (from the project root)
npm install

# 2. Configure the database connection
#    server/.env is provided (gitignored); recreate it if missing:
#      MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=Cluster0
#      DB_NAME=student_management

# 3. Development — start the API and the Vite dev server together
npm run dev
#   → API:  http://localhost:3000/api/students
#   → UI:   http://localhost:5173  (Vite proxies /api to :3000)

# 4. Production — build the UI, then serve everything from Express
npm run build
npm start
#   → http://localhost:3000  (built UI + API on the same origin)
```

In development the UI runs on Vite's dev server (`:5173`) with hot reload, and
`/api` requests are proxied to Express. After `npm run build`, the compiled app
in `client/dist` is served directly by Express from `:3000`.

The UI loads the seeded students (IDs 101–103).

> **Note:** the numeric IDs map to MongoDB `_id`. New students are auto-assigned
> the next ID (104, 105, …) via a `counters` collection.

## Quick API Smoke Test

```powershell
# List all
curl http://localhost:3000/api/students

# Get by id
curl http://localhost:3000/api/students/101

# Create
curl -X POST http://localhost:3000/api/students -H "Content-Type: application/json" -d "{\"firstName\":\"Grace\",\"lastName\":\"Hopper\",\"email\":\"grace@example.com\",\"major\":\"Computer Science\",\"enrollmentYear\":2024}"

# Update
curl -X PUT http://localhost:3000/api/students/101 -H "Content-Type: application/json" -d "{\"firstName\":\"Ada\",\"lastName\":\"Lovelace\",\"email\":\"ada.lovelace@example.com\",\"dateOfBirth\":\"1815-12-10\",\"major\":\"Mathematics\"}"

# Delete
curl -X DELETE http://localhost:3000/api/students/101
```
