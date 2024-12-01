# Flight tracker

Flight tracker app for personal use in Microsoft Flight Simulator

## Contents
Repository contains frontend code for [Flight Tracker](https://flight-tracker.barcz.me) app.

Project is using **Node.js** and **TypeScript** in versions listed below:

| Technology   | Version |
|--------------|---------|
| Node.js      | 22.9    |
| TypeScript   | ^5.6    |

Main dependencies are **Vite**, **React**, **React Router** and **Flowbite** in versions listed below.

| Vendor       | Version |
|--------------|---------|
| Vite         | ^5.4    |
| React        | ^18.3   |
| React Router | ^7.0    |
| Flowbite     | ^0.10   |

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm

To build and run using Docker:

```bash
# For npm
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```
