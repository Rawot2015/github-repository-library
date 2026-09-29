# Repository Shelf Workspace Guide

## Project

Standalone Next.js 16 App Router application using TypeScript, React, Tailwind CSS, and npm. This project is separate from the issue tracker.

## Completed setup checklist

- [x] Requirements clarified: public GitHub repository collection with PDF and OneNote-friendly HTML exports.
- [x] Scaffolded with TypeScript, App Router, npm, Tailwind CSS, and ESLint.
- [x] Implemented link parsing, public metadata lookup, local persistence, filtering, and exports.
- [x] Dependencies installed; lint and production build validation pending.
- [x] Dependencies installed; ESLint and production build pass.
- [x] No extra VS Code extensions required.
- [x] README documents setup, usage, privacy, and export limits.
- [ ] Start the development server after user confirmation.
- [x] Started the development server after user confirmation; verified desktop and mobile rendering.

## Local workflow

- Install dependencies with `npm install`.
- Start the app with `npm run dev` and open `http://localhost:3000`.
- Validate with `npm run lint` and `npm run build`.
- Repository data is stored only in browser local storage. Do not imply cross-device or Microsoft account synchronization.
- PDF content is regenerated from the current list in the browser. OneNote export is HTML generated on request; direct OneNote sync requires Microsoft Graph authentication and permissions.
