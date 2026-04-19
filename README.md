# Alemam Admin Frontend

Production-focused React frontend for the Alemam engineering operations platform. The app provides role-based workspaces for admins, engineers, and supervisors to manage projects, review execution, and track delivery activity from a single interface.

## Highlights

- Role-based routing for admin, engineer, and supervisor experiences
- Feature-based frontend structure for better scalability and maintenance
- Shared UI primitives for consistent page shells, loaders, and status states
- Tailwind-powered responsive interface optimized for dashboard workflows
- Production build support with Create React App kept minimal and cleaned of starter boilerplate

## Tech Stack

- React 19
- React Router
- Tailwind CSS
- Axios
- React Icons
- Create React App build tooling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Backend API running on `http://localhost:5000`

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

The frontend runs on `http://localhost:3000` and proxies API requests to `http://localhost:5000`.

### Build for Production

```bash
npm run build
```

The optimized output is generated in the `build/` directory.

## Project Structure

```text
src/
├─ core/
├─ layouts/
├─ modules/
│  ├─ admin/
│  ├─ auth/
│  ├─ engineer/
│  ├─ landing/
│  └─ supervisor/
├─ routes/
├─ shared/
└─ utils/
```

## Production Notes

- Keep backend environment variables configured in the `back` service
- Do not commit generated build artifacts unless your deployment flow explicitly requires them
- Validate API base behavior before release if the backend host changes from the local proxy setup

## Scripts

- `npm start` runs the development server
- `npm run build` creates the production bundle
