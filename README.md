# Cogni-Write 🚀

Cogni-Write is an automated digital journalism platform designed to curate and generate deep-dive articles across specialized niche topics. Built with a robust functional programming mindset, the application utilizes a highly resilient multi-model fallback chain to ensure continuous content generation even under volatile API environments.

Live Demo: [https://cogni-write.vercel.app/](https://cogni-write.vercel.app/)

---

## 💡 The Core Concept

Managing consistent content generation across highly specific, specialized niches can be a bottleneck. Cogni-Write solves this by acting as an automated curation engine. By configuring a `ContentEngine` for a particular topic, the platform operates as an independent digital journalist—analyzing historical outputs to prevent repetitive angles, prompting generative AI with advanced editorial guidelines, and committing fully type-safe articles straight to the database.

---

## 🔑 Administration & Workspace Setup

The platform includes a dedicated, unlinked management dashboard located at the hidden path: **`/admin`**.

Because this page is completely decoupled from public site links, administrators can securely manage the generation endpoints:

* **Authentication Gate:** Secured via `better-auth`. If unauthenticated, users are presented with a sign-in interface.
* **Role-Based Protection:** Access is strictly bounded by the `ADMIN` email environment variable. Unauthorized users will hit an explicit "Access Denied" barrier.
* **Workspace Operations:** Inside the dashboard, the admin can dynamically register new `ContentEngine` workspaces by inputting a niche target topic, modify existing parameters, or check real-time publication stats across generated article collections.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js 16 (App Router with Turbopack)
* **Database ORM:** Prisma Client linked to a PostgreSQL database (Neon)
* **AI Engine:** `@google/genai` (Google AI integration)
* **Validation:** Zod (Fully type-safe validation schema structures)
* **Styling:** Tailwind CSS & Shadcn UI

### Technical Highlights

1. **Pure Functional Error Handling:** The internal architecture avoids crash-prone runtime exceptions (`try/catch` leaks). Instead, core pipelines leverage a functional **Result State Monad** (`{ data } | { error }`), capturing failures as clean, predictable values.
2. **Resilient AI Fallback Chain:** To handle potential API limitations or transient model failures, content generation is mapped asynchronously across a structured cascading tier:
* `gemma-4-31b-it` (Primary)
* `gemma-4-26b-a4b-it` (Secondary)
* `gemma-2.5-flash` (Resilient Baseline)


3. **Optimized Database Memoization:** Leverages React's native `cache()` layers to globally deduplicate identical Prisma connection lookups between Next.js' dynamic metadata generation and the main page components.
4. **Automated On-Demand Vercel Crons:** Automatically processes daily generation triggers via secure Vercel system cron routing headers paired with on-demand static page revalidation (`revalidatePath`).

---

## 📂 Project Structure

```text
├── app/
│   ├── admin/                  # Protected content engine dashboard (Unlinked path)
│   ├── api/articles/generate/  # Secured automated CRON/POST endpoint
│   └── [slug]/[articleId]/     # Memoized dynamic article rendering
├── components/                 # Shared Shadcn visual layout elements
├── lib/
│   ├── data/
│   │   ├── article.ts          # Core FP generation fallback engine
│   │   └── prisma.ts           # Central Prisma Client broker
│   └── schemas/                # Zod structural runtime validation
└── prisma/                     # Database layout definition & migrations

```

---

## 🚀 Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/MessiahHoly/cogni-write.git
cd cogni-write

```

### 2. Install dependencies

```bash
npm install

```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and configure the following keys:

```env
# Database & Core Services
DATABASE_URL="your-postgresql-connection-string"
GEMINI_API_KEY="your-google-gemini-api-key"

# Secured API Cron Keys
ARTICLE_GENERATION_KEY="your-custom-manual-trigger-secret"
CRON_SECRET="your-vercel-cron-secret-fallback"

# Authentication (Better-Auth)
# Generate a secure 32-character base64 string via terminal: # openssl rand -base64 32
BETTER_AUTH_SECRET="your-generated-random-string"

# Email Services (Resend)
RESEND_API_KEY="re_your_secret_resend_api_key"
RESEND_FROM_EMAIL="Cogni-Write <onboarding@resend.dev>"

# Application Roles
ADMIN="admin-email@example.com"

```

### 4. Run Migrations & Start Development

```bash
npx prisma generate
npx prisma migrate dev
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the application. To manage topics, navigate explicitly to [http://localhost:3000/admin](https://www.google.com/search?q=http://localhost:3000/admin).