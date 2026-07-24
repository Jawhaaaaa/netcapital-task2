# Vehicle Lookup Demo

A full-stack demo application for looking up vehicle information by license plate.

## Backend (FastAPI)

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Then start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000.

## Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:5173.

## Configuration

Before running the application, you must:

1. **Supabase**: Create a `.env` file in `backend/` with your real Supabase project URL and anon key (`SUPABASE_URL` and `SUPABASE_KEY`).
2. **API URL**: The frontend expects the API at `http://localhost:8000` by default. You can override this by setting `VITE_API_BASE_URL` in `frontend/.env`.