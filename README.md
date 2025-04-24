# Patatiko Frontend

A modern, responsive React application built with Vite, powered by Firebase for backend services, and enhanced with animations and file generation utilities. Patatiko-Frontend serves as the client-side of the Patatiko platform, providing user authentication, dynamic content pages, PDF/QR code generation, and smooth interactions.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running Locally](#running-locally)  
- [Available Scripts](#available-scripts)  
- [Configuration](#configuration)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  

## Features

- **User Authentication** via Firebase Auth (email/password, OAuth) :contentReference[oaicite:0]{index=0}  
- **Animated UI Components** powered by GSAP for engaging transitions :contentReference[oaicite:1]{index=1}  
- **PDF Generation** using jsPDF to export reports or receipts :contentReference[oaicite:2]{index=2}  
- **QR Code Creation** for resource sharing with qrcode library :contentReference[oaicite:3]{index=3}  
- **File Download** capabilities via File-Saver :contentReference[oaicite:4]{index=4}  
- **YouTube Embeds** for interactive video content (react-youtube) :contentReference[oaicite:5]{index=5}  
- **Client-side Routing** using React Router Dom :contentReference[oaicite:6]{index=6}  
- **Responsive Layout** and theming with CSS modules  

## Tech Stack

- **Framework**: [React 18](https://react.dev/) :contentReference[oaicite:7]{index=7}  
- **Bundler**: [Vite](https://vitejs.dev/) with HMR :contentReference[oaicite:8]{index=8}  
- **Backend as a Service**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Hosting) :contentReference[oaicite:9]{index=9}  
- **HTTP Client**: [Axios](https://axios-http.com/) :contentReference[oaicite:10]{index=10}  
- **Animations**: [GSAP](https://greensock.com/gsap/) :contentReference[oaicite:11]{index=11}  
- **PDF Library**: [jsPDF](https://github.com/parallax/jsPDF) :contentReference[oaicite:12]{index=12}  
- **QR Code**: [qrcode](https://github.com/soldair/node-qrcode) :contentReference[oaicite:13]{index=13}  
- **Date Handling**: [Moment.js](https://momentjs.com/) :contentReference[oaicite:14]{index=14}  
- **Deployment**: [gh-pages](https://github.com/tschaub/gh-pages) for GitHub Pages :contentReference[oaicite:15]{index=15}  

## Project Structure

```text
Patatiko-Frontend/
├── .firebase/              # Firebase build artifacts
├── public/                 # Static assets and index.html
├── src/
│   ├── components/         # Reusable UI elements (Navbar, Footer, etc.) :contentReference[oaicite:16]{index=16}
│   ├── context/            # React Context providers (e.g., UserContext) :contentReference[oaicite:17]{index=17}
│   ├── pages/              # Route-level components (Home, Dashboard, etc.) :contentReference[oaicite:18]{index=18}
│   ├── routes/             # React Router configuration :contentReference[oaicite:19]{index=19}
│   ├── services/           # API wrappers and Firebase services :contentReference[oaicite:20]{index=20}
│   ├── App.jsx             # Root component integrating router and context :contentReference[oaicite:21]{index=21}
│   └── main.jsx            # Entry point mounting React to DOM :contentReference[oaicite:22]{index=22}
├── firebase.json           # Firebase Hosting & functions config :contentReference[oaicite:23]{index=23}
├── .firebaserc             # Firebase project aliases :contentReference[oaicite:24]{index=24}
├── vite.config.js          # Vite build configuration :contentReference[oaicite:25]{index=25}
├── package.json            # Project metadata and dependencies :contentReference[oaicite:26]{index=26}

Getting Started
Prerequisites
Node.js ≥ 18 and npm installed

A Firebase project with Auth and Firestore enabled

Installation
bash
Copy
Edit
git clone https://github.com/Masterkimaru/Patatiko-Frontend.git
cd Patatiko-Frontend
npm install
Running Locally
bash
Copy
Edit
# Start dev server with hot reloading
npm run dev
Visit http://localhost:5173/ to view the app.