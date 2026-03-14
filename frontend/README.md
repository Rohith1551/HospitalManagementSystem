# Hospital Management System — Frontend

React frontend for the Doctor Appointment / Medical Management system. It connects to a Spring Boot backend API for authentication, doctors, patients, and appointments.

## Tech stack

- **React** (latest) with functional components and hooks
- **Vite** — build tool and dev server
- **TailwindCSS** — styling
- **Axios** — HTTP client with interceptors for auth and error handling
- **React Router** — routing and protected routes
- **react-hot-toast** — toast notifications

## Installation

```bash
npm install
```

## Run

**Development (with hot reload):**

```bash
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173) by default.

**Production build:**

```bash
npm run build
```

**Preview production build:**

```bash
npm run preview
```

## Environment variables

Create a `.env` file in the frontend root if you need to override the API base URL:

- `VITE_API_BASE_URL` — backend API base URL (default is set in `src/utils/constants.js` as `http://localhost:8090`)

The app uses `src/utils/constants.js` for `API_BASE_URL`; you can switch to `import.meta.env.VITE_API_BASE_URL` there if you prefer env-based config.

## Folder structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/       # Reusable UI: Button, Input, Modal, Table, Card, Loader, Toast, ConfirmDialog
│   │   ├── forms/       # DoctorForm, PatientForm, AppointmentForm
│   │   └── layout/      # Layout, Navbar, Sidebar
│   ├── context/         # AuthContext (login, logout, user, roles)
│   ├── hooks/           # useDebounce, useToast
│   ├── pages/           # Login, Register, Dashboard, Doctors, Patients, Appointments, Profile, NotFound
│   ├── routes/         # AppRoutes (public, protected, role-based)
│   ├── services/       # api.js (Axios instance, authAPI, adminAPI, doctorAPI, patientAPI, appointmentAPI)
│   ├── styles/         # index.css (Tailwind + custom components)
│   ├── utils/          # constants, helpers (formatDateTime, parseJwt, etc.)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Backend CORS

The backend must allow requests from the frontend origin. The Spring Boot app is configured (in `SecurityConfig`) to allow:

- Origins: `http://localhost:3000`, `http://localhost:5173`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Credentials: true

Ensure the backend is running (e.g. on port 8090) before using the frontend.

## Features

- **Auth:** Login, register (patient), logout; JWT in localStorage; protected routes; role-based access (Admin, Doctor, Patient).
- **Doctors (Admin):** List, create, edit, delete; search.
- **Patients (Admin):** List, create, edit, delete; search.
- **Appointments (Admin / Doctor):** Create (Admin), view, filter by doctor/patient/status, cancel, delete (Admin); pagination.
- **Dashboard:** Summary cards and recent appointments (Admin / Doctor).
- **Profile:** Account and role-specific profile (doctor/patient details).
- **UI:** Loading states, toasts, form validation, confirmation dialogs for destructive actions, responsive layout.
