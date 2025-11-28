# Weekly School Time Tracker

A modern, stylish web application to track school attendance hours throughout the week.

## Features

- Track check-in and check-out times for all 7 days of the week
- Automatically calculates valid hours (only counts time between 09:00 and 18:00)
- Shows total weekly hours, percentage complete, and hours remaining
- Visual progress indicator with circular chart
- Clean, minimalist design with smooth animations
- Fully responsive layout

## Technology Stack

- React 18 + TypeScript
- Vite
- CSS Modules
- react-circular-progressbar

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

The app only counts hours that fall within the valid school time window of 09:00 to 18:00:

- If you check in at 08:00 and check out at 17:00, only 09:00–17:00 is counted (8 hours)
- If you check out after 18:00, only time until 18:00 is counted
- If you check in after 18:00 or check out before 09:00, zero hours are counted

The weekly requirement is 15 hours. The app shows your progress toward this goal with:
- Total valid hours this week
- Hours remaining to reach 15
- Percentage completion
- Visual circular progress chart
