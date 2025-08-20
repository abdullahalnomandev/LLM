This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Learning Management System (LMS) Frontend

## Project Overview

This repository contains the frontend application for the Learning Management System (LMS). Built with Next.js and TypeScript, it provides a dynamic and interactive user interface for managing courses, modules, lectures, and user progress. The application features:

- **Modern Architecture**: App Router, Server Components, and Client Components
- **State Management**: React Context API for global state
- **Styling**: Tailwind CSS for responsive design
- **API Integration**: RESTful API communication with backend services
- **Testing**: Jest and React Testing Library for unit tests

The application is designed to be responsive, user-friendly, and efficient, offering a seamless learning experience across all devices.

## Features

- **Course Management**: Create, edit, and delete courses.
- **Module Organization**: Structure courses into logical modules.
- **Lecture Delivery**: Deliver educational content through various lecture formats.
- **User Progress Tracking**: Monitor and track student progress through courses and lectures.
- **Responsive Design**: Optimized for various devices and screen sizes.
- **Authentication & Authorization**: Secure access to course content and administrative functions.

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+ or equivalent package manager

### Installation
1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Environment Variables
Create a `.env.local` file with:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
