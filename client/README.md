# SkillSpring frontend

The SkillSpring frontend is a responsive web app for learning, interview practice, DSA problem solving, placement preparation, and progress review. It is built with Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, and Axios.

## Features and pages

| Route | What it does |
| --- | --- |
| `/` | Introduces the platform and links to its learning tools. |
| `/signup`, `/login` | Creates an account and signs in through the API. |
| `/dashboard` | Shows the signed-in user’s profile, activity stats, and shortcuts. |
| `/interview` | Configures an AI mock interview. |
| `/interview/[slug]` | Runs the interview with camera/microphone controls, speech recognition where supported, answer submission, and feedback. Browser camera and microphone permissions are required for those controls. |
| `/problems` | Generates topic-based practice questions. |
| `/dsa-sheets` | Lists DSA sheets from different authors; search by author and open a sheet in a new tab. |
| `/placement-predict` | Submits a student profile to the separate placement prediction service. |
| `/placement-roadmap` | Displays a placement preparation roadmap. |
| `/study-planner` | Provides an interactive weekly planner. Its current task state is held in the browser and is not saved to the API. |
| `/weekness-detection` | Summarizes areas to revisit from the user’s interview feedback. The route currently uses this spelling. |
| `/dashboard/feedbacks` | Displays saved interview feedback. |
| `/aboutus` | Explains the platform and its tools. |

## Requirements

- Node.js 20.9 or later
- npm
- The SkillSpring API server (see [`../server/README.md`](../server/README.md))
- The placement prediction service for `/placement-predict`

## Install and run

From the `client` directory:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). To create an optimized build and run it locally:

```bash
npm run build
npm start
```

Useful project scripts:

```bash
npm run lint
npx tsc --noEmit
```

## Environment variables

Create `client/.env.local` (or use the project’s local `.env` file) and set the service base URLs:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MODEL_API_URL=http://localhost:8001
```

`NEXT_PUBLIC_API_URL` is the base URL for the Express server. The frontend appends paths such as `/api/auth/login` and `/api/sheet/all`. The backend defaults to port `8000`; use the port it actually runs on.

`NEXT_PUBLIC_MODEL_API_URL` is the base URL for the separate placement prediction service. The frontend sends prediction requests to `${NEXT_PUBLIC_MODEL_API_URL}/predict`; set this to the host and port of that service.

These `NEXT_PUBLIC_` values are included in browser code. Use them only for public service URLs; never put credentials or private API keys in them.

## API usage

The app uses Axios for HTTP requests. Login state is supplied by `AuthContext`; authenticated requests use `withCredentials` so the browser sends the server’s HTTP-only cookie. The main API calls are:

- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, and `POST /api/auth/logout`
- `POST /api/user/interview`, `GET /api/user/interview/:sessionId`, and `POST /api/user/interview/:sessionId`
- `POST /api/user/problems`
- `GET /api/user/feedbacks/all` and `GET /api/user/feedbacks/:len`
- `GET /api/sheet/all` for the DSA sheet library
- Placement prediction calls `POST ${NEXT_PUBLIC_MODEL_API_URL}/predict` on the separate model service

The DSA sheet endpoint returns documents with an `author` and `sheet_link`. The page filters by author and only renders links using the `http:` or `https:` protocols.

## Project structure

```text
app/                  App Router pages and global styles
  dsa-sheets/         DSA sheet directory
  interview/          Interview setup and dynamic session route
  dashboard/          User dashboard and feedback history
components/           Shared navigation, footer, and UI components
AuthContext.tsx        Cookie-backed user session state
public/                Static assets
```

## Deployment notes

- Set both service URLs for the deployed environment and configure the API’s `CLIENT_URL` to the exact frontend origin.
- The API uses credentialed CORS and an HTTP-only authentication cookie. Serve the frontend and API over HTTPS in production and allow credentials for the frontend origin.
- Browser speech recognition support varies. The typed answer field remains available when speech recognition is unavailable.
