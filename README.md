![My Project Header](.github/image/header.png)

# Flight Tracker

A comprehensive web app for scheduling and tracking flights in a flight simulator environment. Designed for virtual
aviation enthusiasts, it enables seamless management of flights, aircraft, airports, crews and passengers.

With this app, you can:

- Plan & manage flights with detailed flight plans,
- Track flights step-by-step from departure to arrival,
- Generate timesheets & loadsheets for accurate record-keeping,
- Monitor aircraft status and optimize resource allocation,

In general – take full control of your virtual airline operations with a realistic and structured workflow for flight
simulation.

This is the frontend part of the project. For the server part, please visit
[this repository](https://github.com/oskarbarcz/flight-tracker-api).

## Repository contents

This repository contains frontend code for the **[Flight Tracker](https://flights.barcz.me)** app. Project is using **React.js** with
**TypeScript**, with **Flowbite** component library.

## Getting Started

### Environment

App requires a server part to run, otherwise you won't be able to see anything more than the sign-in screen.

### Installation using locally set-up API (recommended)

1. Clone projects by running:

```shell
git@github.com:oskarbarcz/flight-tracker-app.git
git@github.com:oskarbarcz/flight-tracker-api.git
```

2. Prepare an environment variables file by copying `.env.example` to `.env` and fill it with your data.

```shell
cd flight-tracker-app
cp .env .env.local
```
3. Fill the newly created file with URL to locally set up API. The default value would be:

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

5. Set up the frontend project

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

6. Open the browser and go to [http://localhost:5173](http://localhost:5173) to see the app. Default credentials are:

| Role           | Username                 | Password   |
|----------------|--------------------------|------------|
| **Cabin crew** | `cabin-crew@example.com` | `P@$$w0rd` |
| **Operations** | `operations@example.com` | `P@$$w0rd` |
| **Admin**      | `admin@example.com`      | `P@$$w0rd` |

7. Enjoy!

### Installation using production API

1. Clone the project by running:

```shell
git@github.com:oskarbarcz/flight-tracker-app.git
```

2. Set up the frontend project

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

3. Open the browser and go to [http://localhost:5173](http://localhost:5173) to see the app. There are no public
available accounts for now, you have to be already registered in the system to be able to sign in.

## Build, Test and Deploy

This project uses [semantic versioning](https://semver.org/spec/v2.0.0.html).

This project has configured continuous integration and continuous deployment pipelines. It uses GitHub Actions to
automatically build, test and deploy the app to the GitHub Pages. You can find the configuration in `.github/workflows`
directory.

## License

This project adapts UNLICENSE. For more information, please visit the [UNLICENSE](UNLICENSE) file.

## Disclaimer

I am an experienced software engineer, but I'm not affiliated anyhow with an airline industry. This project is created
for flight simulation purposes only and should not be used for real-world aviation operations.
