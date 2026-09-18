# HomelyHub - Required Extensions & Packages 📦

A quick reference guide for recommended VS Code / IDE extensions and all installed backend & frontend npm packages.

---

## 🧩 Recommended VS Code Extensions

Install these extensions in VS Code for the best development experience:

| Extension Name | Extension ID | Purpose |
| :--- | :--- | :--- |
| **ES7+ React/Redux/React-Native snippets** | `dsznajder.es7-react-js-snippets` | Fast React & Redux boilerplate code |
| **Prettier - Code formatter** | `esbenp.prettier-vscode` | Automatic code formatting on save |
| **ESLint** | `dbaeumer.vscode-eslint` | Catch JavaScript/React errors & syntax issues |
| **Tailwind/CSS Peek** | `pranaygp.vscode-css-peek` | Inspect & jump directly to CSS definitions |
| **Thunder Client / Postman** | `rangav.vscode-thunder-client` | In-editor REST API testing for endpoints |
| **DotENV** | `mikestead.dotenv` | Syntax highlighting for backend `.env` files |

---

## 💻 Backend Packages (`backend/package.json`)

The backend is built with Node.js, Express, and MongoDB.

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `express` | `^4.19.2` | Web framework for routing and REST APIs |
| `mongoose` | `^8.4.0` | MongoDB object modeling & validation |
| `mongodb-memory-server`| `^9.2.0` | Zero-setup in-memory database fallback |
| `jsonwebtoken` | `^9.0.2` | JWT generation & verification for auth cookies |
| `bcryptjs` | `^2.4.3` | Secure password hashing in pre-save hooks |
| `cookie-parser` | `^1.4.6` | Parsing HTTP-only cookies in Express requests |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing with credentials |
| `dotenv` | `^16.4.5` | Loading environment variables from `.env` |
| `groq-sdk` | `^0.3.3` | Groq LLM client for AI description & trip planning |
| `nodemailer` | `^6.9.13` | Sending password recovery emails |
| `mailgen` | `^2.0.28` | Generating HTML responsive email templates |
| `imagekit` | `^5.0.1` | Cloud image upload & CDN integration |

---

## 🎨 Frontend Packages (`frontend/package.json`)

The frontend is built with React 18, Vite, and Redux Toolkit.

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | `^18.3.1` | UI component library |
| `react-dom` | `^18.3.1` | React DOM renderer |
| `@reduxjs/toolkit` | `^2.2.5` | Centralized state management |
| `react-redux` | `^9.1.2` | React bindings for Redux Toolkit |
| `react-router-dom` | `^6.23.1` | Client-side routing and protected routes |
| `axios` | `^1.7.2` | HTTP client with automatic cookie handling |
| `antd` | `^5.17.4` | Ant Design UI component system |
| `@ant-design/icons` | `^5.3.7` | Ant Design icons library |
| `lucide-react` | `^0.379.0` | Modern UI icons |
| `leaflet` | `^1.9.4` | Interactive OpenStreetMap library |
| `react-leaflet` | `^4.2.1` | React wrapper for Leaflet interactive maps |
| `vite` | `^5.2.11` | Next-generation fast frontend bundler |
| `@vitejs/plugin-react` | `^4.3.0` | Fast Refresh plugin for React in Vite |

---

## 🚀 One-Click Start

Simply run the included batch file in the root folder:
```cmd
start-homelyhub.bat
```
This automatically starts both the Backend (`http://localhost:5000`) and the Frontend (`http://localhost:5173`) in separate terminal windows and launches the app in your browser!
