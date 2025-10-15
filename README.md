# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Deployment with Docker Compose

This project includes a production-ready Docker setup to build and serve the frontend with Nginx.

Quick start:

- Build and run (default port 8080):
  - On Linux/Mac: `PORT=8080 VITE_API_BASE=/api docker compose up -d --build`
  - On Windows PowerShell: `$Env:PORT=8080; $Env:VITE_API_BASE='/api'; docker compose up -d --build`
- Then open http://localhost:8080

Notes:
- VITE_API_BASE defines the backend API base URL baked into the build (defaults to `/api`). Set it to a full URL if your backend is on another host, e.g. `https://api.example.com/api`.
- The container serves static files via Nginx with SPA fallback. There is no built-in `/api` proxy; configure your backend/reverse proxy separately or set `VITE_API_BASE` accordingly.
