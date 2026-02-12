# HushHub

HushHub is a temporary real-time chat platform where users can create or join private rooms and chat instantly.

## Introduction

The project has two parts:
- `client`: Next.js frontend for room creation, room join, and live chat UI
- `ws`: WebSocket backend for room management and real-time messaging

Rooms are in-memory and auto-removed when empty.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Express 5
- ws (WebSocket)

## Project Structure

```text
hushhub/
  client/   # Next.js frontend
  ws/       # WebSocket + HTTP backend
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### 1) Clone

```bash
git clone <your-repo-url>
cd hushhub
```

### 2) Install Dependencies

```bash
cd ws
npm install

cd ../client
npm install
```

### 3) Environment Setup

Create `client/.env.local`:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

Optional for backend (`ws`):

```env
PORT=8080
```

### 4) Run the Project

Run backend in terminal 1:

```bash
cd ws
npm run dev
```

Run frontend in terminal 2:

```bash
cd client
npm run dev
```

Open `http://localhost:3000`.

## Scripts

### Client (`client`)

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Run lint checks

### Backend (`ws`)

- `npm run dev` - Compile TypeScript and start server
- `npm run build` - Compile TypeScript
- `npm run start` - Start compiled server from `dist`

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push branch: `git push origin feature/your-feature`
5. Open a pull request.
