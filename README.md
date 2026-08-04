# Community Incident Reporting System (MVP)

This repository contains a full-stack MVP for a Community Incident Reporting System.

## Stack
- Frontend: React + Vite + Axios + React Router
- Backend: Laravel REST API + Sanctum
- Database: SQLite for local quick start (MySQL-ready)
- Maps: OpenStreetMap + Leaflet

## Project Structure
- backend: Laravel API
- frontend: React app
- postman: Importable Postman collection

## 1. Backend Setup (Laravel)
1. Open a terminal in backend.
2. Ensure PHP and Composer are available in PATH.
3. Install dependencies:
   - composer install
4. Create env file if needed:
   - copy .env.example .env
5. Generate app key:
   - php artisan key:generate
6. Run migrations and seed demo data:
   - php artisan migrate:fresh --seed
7. Create storage symlink for uploaded images:
   - php artisan storage:link
8. Start API server:
   - php artisan serve --host=127.0.0.1 --port=8000

### Seeded Demo Users (password: password123)
- admin@example.com (Admin)
- maintenance@example.com (Maintenance)
- citizen@example.com (Citizen)

## 2. Frontend Setup (React)
1. Open a terminal in frontend.
2. Install dependencies:
   - npm install
3. Configure environment variables in frontend/.env:
   - VITE_API_BASE_URL=http://127.0.0.1:8000/api
4. Start frontend dev server:
   - npm run dev

## 3. Map Requirements
- No API key is required.
- The report page uses OpenStreetMap tiles via Leaflet.

## 4. Postman Testing
1. Import postman/CIR_System_MVP.postman_collection.json.
2. Set collection variables:
   - base_url (default already set)
   - token (paste access token from login)
   - incident_id
   - maintenance_user_id

Suggested flow:
1. Login (admin@example.com)
2. List Incidents
3. Create Incident
4. Update Status
5. Assign Incident
6. Add Comment

## 5. Switching to MySQL
Update backend/.env:
- DB_CONNECTION=mysql
- DB_HOST=127.0.0.1
- DB_PORT=3306
- DB_DATABASE=cir_system
- DB_USERNAME=root
- DB_PASSWORD=

Then run:
- php artisan migrate:fresh --seed

## 6. Notes
- Status transitions are enforced as: Pending -> In Progress -> Resolved.
- Admin dashboard includes assignment and status history.
- Incident report page supports image upload and OpenStreetMap click-to-select coordinates.
