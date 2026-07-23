# UniScopels Backend

Node.js + Express + SQLite API for universities, faculties, programmes, requirements, and matching.

## Setup

```bash
cd backend
npm install
npm run dev
```

Server starts on `http://localhost:4000`.

## Real AI setup

Create `backend/.env` from `.env.example` and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.2
```

The `/api/advisor` route calls OpenAI's Responses API from the backend so the key is never exposed in the browser.

## API

- `GET /api/health`
- `GET /api/universities`
- `POST /api/universities`
- `GET /api/universities/:id/full`
- `GET /api/faculties?university_id=1`
- `POST /api/faculties`
- `GET /api/programmes`
- `GET /api/programmes?faculty_id=1`
- `GET /api/programmes?university_id=1&q=computer`
- `POST /api/programmes`
- `POST /api/match`
- `POST /api/advisor`

## Match request example

```json
{
  "subjects": [
    { "subject": "Mathematics", "symbol": "B" },
    { "subject": "English Language", "symbol": "C" },
    { "subject": "Biology", "symbol": "C" }
  ],
  "preferred_field": "health",
  "goal": "I like helping people and biology",
  "limit": 20
}
```

`university_id` is optional. If omitted, matching runs across all listed universities. The response includes `best_match`, `score`, `recommendation_reason`, and each programme's failed requirements when requested with `include_ineligible: true`.

## Advisor request example

```json
{
  "message": "I like technology and maths. What should I study?",
  "matches": [],
  "subjects": [
    { "subject": "Mathematics", "symbol": "B" },
    { "subject": "English Language", "symbol": "C" }
  ]
}
```

## Notes

- First run creates `backend/data/uniscopels.db`.
- Starter data is added idempotently for NUL, Botho University, Centre of Accounting Studies, Roma College of Nursing, and Limkokwing University of Creative Technology.
