# 🖼️ Image AI Platform — Frontend

![Angular](https://img.shields.io/badge/Angular-17-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat-square&logo=tailwindcss)
![AWS CloudFront](https://img.shields.io/badge/AWS-CloudFront-FF9900?style=flat-square&logo=amazonaws)
![AWS S3](https://img.shields.io/badge/AWS-S3-FF9900?style=flat-square&logo=amazonaws)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> Production-deployed Angular 17 frontend for an AI-powered image processing platform. Features JWT authentication, real-time image status polling, multi-variant image display, and per-image AI chat powered by the Gemini vision model. Deployed on AWS CloudFront + S3 with HTTPS.

🌐 **Live Demo:** [https://d29l33lvuvut8q.cloudfront.net](https://d29l33lvuvut8q.cloudfront.net)  
📦 **Backend Repo:** [Image AI Backend](https://github.com/kavya-mahadevaiah/Image_AI_backend)

---

## 📐 Architecture

```
User Browser (HTTPS)
        │
        ▼
CloudFront (CDN + HTTPS termination)
        ├── /* ──────────────────► S3 Bucket (Angular static files)
        └── /api/* ──────────────► ALB → ECS Fargate (Spring Boot API)
                  CloudFront Fn
                  strips /api prefix
```

---

## ✨ Features

- **JWT Authentication** — login, register with client-side validation and error handling
- **Image Upload** — drag-and-drop or file picker, immediate status feedback
- **Real-time Status Polling** — automatic polling every 5s for `PROCESSING` images
- **Multi-variant Display** — view thumbnail, medium, and large variants per image
- **AI Chat per Image** — ask questions about any image using Gemini vision model
- **Responsive UI** — dark theme, Tailwind CSS, mobile-friendly layout
- **Route Guards** — protected workspace, automatic redirect to login
- **HTTP Interceptor** — automatic JWT token injection on all API requests

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 17 (standalone components) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| HTTP | Angular HttpClient |
| Auth | JWT + localStorage |
| Routing | Angular Router with Guards |
| Forms | Angular Template-driven Forms |
| Hosting | AWS S3 + CloudFront |

---

## 📸 Screenshots

> *(Add screenshots of your login page, workspace, image upload, status badges, and chat panel here)*

---

## 🗂️ Project Structure

```
src/app/
├── core/
│   ├── auth/
│   │   ├── auth.service.ts        # login, register, logout, JWT storage
│   │   ├── auth.guard.ts          # route protection
│   │   └── jwt.interceptor.ts     # auto-attach Bearer token
│   └── interceptors/
├── features/
│   ├── auth/
│   │   ├── login/                 # login component + template
│   │   └── register/              # register component + template
│   └── workspace/
│       ├── sidebar/               # image list, status badges, polling
│       ├── image-workspace/       # image viewer, variant switcher
│       └── chat-panel/            # AI chat interface per image
└── environments/
    ├── environment.ts             # local: http://localhost:8081
    └── environment.prod.ts        # prod: https://cloudfront.net/api
```

---

## 🚦 Image Status Flow

| Status | Badge Color | Meaning |
|--------|------------|---------|
| `UPLOADED` | 🔵 Blue | Saved to S3, awaiting Lambda |
| `PROCESSING` | 🟡 Amber | Lambda creating variants |
| `COMPLETED` | 🟢 Green | All variants ready to view |
| `FAILED` | 🔴 Red | Processing error |

Polling runs every **5 seconds** and only when `PROCESSING` images exist — automatically stops when all complete.

---

## ⚙️ Local Development

### Prerequisites
- Node.js 18+
- Angular CLI 17+

### 1. Clone & install
```bash
git clone https://github.com/kavya-mahadevaiah/Image_AI_frontend.git
cd Image_AI_frontend
npm install
```

### 2. Configure environment
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081'
};
```

### 3. Run
```bash
ng serve
```

App available at `http://localhost:4200`

---

## 🏗️ Build & Deploy

### Production build
```bash
ng build --configuration production
```
Output: `dist/image-ai-app/browser`

### Deploy to S3
```bash
aws s3 sync dist/image-ai-app/browser s3://your-bucket-name --delete
```

### Invalidate CloudFront cache
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🔐 Authentication Flow

```
1. User submits login/register form
2. Client-side validation (email format, min 8 char password)
3. POST /api/auth/login or /api/auth/register
4. JWT token saved to localStorage
5. All subsequent requests include Authorization: Bearer <token>
6. Auth Guard checks localStorage on every protected route
7. Expired/missing token → redirect to /login
```

---

## 🌐 Environment Configuration

| Environment | API URL |
|-------------|---------|
| Development | `http://localhost:8081` |
| Production | `https://d29l33lvuvut8q.cloudfront.net/api` |

CloudFront routes `/api/*` to the backend ALB via a CloudFront Function that strips the `/api` prefix before forwarding.

---

## 🧩 Key Implementation Details

### JWT Interceptor
Automatically attaches the `Authorization: Bearer <token>` header to every outgoing HTTP request:
```typescript
const token = this.authService.getToken();
if (token) {
  request = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
}
```

### Status Polling
Polls only when necessary — stops automatically when no `PROCESSING` images remain:
```typescript
// Runs every 5s, skips if no PROCESSING images
if (processingImages.length === 0) return;
processingImages.forEach(img => this.refreshImage(img.id));
```

### Error Handling
HTTP status-aware error messages — no more silent failures or stuck loading states:
```typescript
if (err.status === 401) this.errorMessage = 'Invalid email or password.';
if (err.status === 409) this.errorMessage = 'Email already registered.';
if (err.status === 0)   this.errorMessage = 'Cannot reach server.';
```

---

## 📈 What I Built & Learned

This is a **production deployment** — not a tutorial project. Real challenges solved:

- Resolved mixed content (HTTPS/HTTP) browser blocking by configuring CloudFront as a full HTTPS proxy
- Implemented environment-based API URL switching between local dev and production
- Built real-time status polling with automatic start/stop logic to avoid unnecessary API calls
- Deployed and invalidated CloudFront cache as part of every frontend release
- Debugged Angular build output path differences between dev and prod configurations

---

## 👩‍💻 Author

**Kavya M**  
Full Stack Developer | MSc Data Analytics (2025) | 3.5 years experience  
[LinkedIn](https://www.linkedin.com/in/kavya-mahadevaiah-59372b123/) • [GitHub](https://github.com/kavya-mahadevaiah)
