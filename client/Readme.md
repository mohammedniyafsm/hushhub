# HushHub Client

Frontend application for HushHub built with Next.js.

## Introduction

The client lets users:
- create a room
- join a room with room id and password
- send and receive real-time chat messages
- view active members and typing status
- manage users in-room (admin actions)

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- react-hot-toast
- react-icons

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
cd client
npm install
```

### Environment Variables

Create `client/.env.local`:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

Notes:
- In development, the app uses `ws://localhost:8080` automatically.
- In production, it uses `NEXT_PUBLIC_WS_URL`.

### Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build production app
- `npm run start` - Start production server
- `npm run lint` - Run lint checks
