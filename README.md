![My Project Header](.github/image/header.png)

# Flight Tracker

A comprehensive web app for scheduling and tracking flights in a flight simulator environment. Designed for virtual
aviation enthusiasts, it enables seamless management of flights, aircraft, airports, crews, and passengers.

With this app, you can:

- Plan & manage flights with detailed flight plans
- Track flights step-by-step from departure to arrival
- Generate timesheets & loadsheets for accurate record-keeping
- Monitor aircraft status and optimize resource allocation

Take full control of your virtual airline operations with a realistic and structured workflow for flight simulation

This is the frontend part of the project. For backend part, please visit
[this repository](https://github.com/oskarbarcz/flight-tracker-api).

## Repository contents

Repository contains frontend code for [Flight Tracker](https://flights.barcz.me) app.

Project is using **Node.js** and **TypeScript**. Main dependencies are **Vite**, **React**, **React Router**. This
project uses **Flowbite** component library.

## Getting Started

### Environment

App requires server to run, otherwise you won't be able to see anything more than sign in screen.

### Installation using locally-set-up API (recommended)

1. Clone projects by running:

```shell
git@github.com:oskarbarcz/flight-tracker-app.git
git@github.com:oskarbarcz/flight-tracker-api.git
```

2. Prepare environment variable file by copying `.env.example` to `.env` and fill it with your data.

```shell
cd flight-tracker-app
cp .env .env.local
```

3. Fill new created file with URL to locally set-up API. Default value would be:

```shell
VITE_FLIGHT_TRACKER_API_HOST=http://localhost
```

4. Set up API:

```shell
# go to backend project directory
cd ../flight-tracker-api

# use docker to set up the environment
# packages, database schema, seed data will be configured automatically
docker compose up -d --build
```

5. Set up frontend project

```shell
# go back to frontend project directory
cd ../flight-tracker-app
# (optional) use nvm to select node version for frontend project
nvm use
# install all dependencies
npm install

# start the development server with hmr
npm run dev
```

6. open browser and go to [http://localhost:5173](http://localhost:5173) to see the app. Default credentials are:

| Role             | Username                 | Password   |
|------------------|--------------------------|------------|
| **Cabin crew**   | `cabin-crew@example.com` | `P@$$w0rd` |
| githubstatus.com | `operations@example.com` | `P@$$w0rd` |
| githubstatus.com | `admin@example.com`      | `P@$$w0rd` |

7. Enjoy!

### Installation using production API

1. Clone project by running:

```shell
git@github.com:oskarbarcz/flight-tracker-app.git
```

2. Set up frontend project

```shell
# go back to frontend project directory
cd ../flight-tracker-app
# (optional) use nvm to select node version for frontend project
nvm use
# install all dependencies
npm install

# start the development server with hmr
npm run dev

#
```

3. open browser and go to [http://localhost:5173](http://localhost:5173) to see the app. There are no public available
   accounts for now, you have to be already registered in the system to be able to sign in.

## Build, Test and Deploy

This project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

This project has configured continuous integration and continuous deployment pipelines. It uses GitHub Actions to
automatically build, test and deploy the app to the DigitalOcean. You can find the configuration in `.github/workflows`
directory.

## License

This projects adapts UNLICENSE. For more information, please visit [UNLICENSE](UNLICENSE) file.

## Disclaimer

I am experienced software engineer, but I am not connected anyhow with airline industry. This project is created for
educational purposes only and should not be used for real-world aviation operations.
