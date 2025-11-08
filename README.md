# SurveySparrow — Calendar Pro (React + Vite + Tailwind)

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](#)

**Calendar Pro** is a polished month-view calendar built for a SurveySparrow-style assignment. It includes brand accents, light/dark mode, event overlaps, and an export feature — everything needed to stand out in an interview.

<p align="center">
  <img src="./output/01-light.png" alt="Light Mode" width="600"/>
</p>

<p align="center">
  <img src="./output/02-dark.png" alt="Dark Mode" width="600"/>
</p>

<p align="center">
  <img src="./output/demo.gif" alt="Demo GIF" width="600"/>
</p>

## ✨ Features
- 🌓 **Light/Dark mode** toggle (SurveySparrow themed)
- 📅 Month & Year navigation **+ Today** highlight
- 🧭 Smooth grid with **overlap lanes** & badge
- ➕ Add / ➖ Delete events in the right panel
- 💾 **localStorage** persistence
- 📤 **Export Events to JSON** (one click)
- ♿ Keyboard-focus rings & accessible controls

## 🧰 Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Day.js

## 🚀 Quick Start
```bash
npm install
npm run dev
```
Open the URL (usually http://localhost:5173).

## 🏗️ Build & Preview
```bash
npm run build
npm run preview
```

## 📂 Folder Structure
```
surveysparrow-calendar-pro
│ package.json
│ index.html
│ vite.config.js
│ tailwind.config.js
│ postcss.config.js
│ README.md
│
└─ src
   │ App.jsx
   │ Calendar.jsx
   │ main.jsx
   │ index.css
│
└─ output
   │ 01-light.png
   │ 02-dark.png
   │ demo.gif
```

## 🔧 Configuration
- Tailwind config includes brand yellow & dark mode (class strategy).

## 🙌 Credits
- Built by **VELPULA23459**.

## 📦 Export / Import Events
- Click **Export JSON** to download your events as `events.json`.
- To import, open devtools > Application > Local Storage > set `calendarEvents` to your JSON.

---

> Tip: Deploy on **Vercel** or **Netlify** for a one-click live demo.
