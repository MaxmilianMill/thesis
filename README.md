# Running the app

The app is fully containerized. You don't need Node.js, MongoDB, or anything else installed locally — only [Docker](https://docs.docker.com/get-docker/).

## 1. Configure environment variables

Copy the example env file and fill in your own values (MongoDB URI, JWT secret, Gemini API key):

```
cp .env.example .env
```

Then edit `.env` with a text editor. `docker-compose.yml` reads this file automatically — you never need to edit `docker-compose.yml` itself.

## 2. Start the app

```
docker compose up --build
```

- Client: http://localhost:5173
- Server API: http://localhost:8080

## 3. Stop the app

```
docker compose down
```

## Notes

- `.env` is gitignored — never commit it.
- If you change the server's port or deploy it somewhere other than `localhost:8080`, also set `VITE_SERVER_URL` / `VITE_WS_SERVER_URL` in `.env` (see comments in `.env.example`) before running `docker compose up --build`, since those are baked into the client bundle at build time.
