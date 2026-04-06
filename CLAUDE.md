# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start       # Start dev server (port 3000, proxies to localhost:8080)
npm run build   # Production build
```

No test script is configured.

## Architecture

This is a React 18 + Apollo Client (GraphQL) travel booking SPA using Create React App.

**Provider stack** (`src/index.js`): `ApolloProvider` > `BrowserRouter` > `AuthProvider` > `App`

**Authentication** (`src/context/AuthContext.js`): JWT stored in `localStorage` (`token`, `userId`). `useAuth()` hook exposes `{ user, token, login, logout, loading, isAuthenticated }`. The Apollo client (`src/graphql/client.js`) reads the token from `localStorage` on every request via `setContext`.

**Routing** (`src/App.js`): Two route guards — `ProtectedRoute` (redirects to `/login` if unauthenticated) and `PublicRoute` (redirects to `/search` if already authenticated). The `Navbar` is only rendered when authenticated.

**GraphQL** (`src/graphql/`):
- `client.js` — Apollo client pointed at `http://localhost:8080/graphql`, always uses `network-only` fetch policy, has global error logging via `onError` link.
- `queries.js` — All GQL operations in one file, grouped by domain: Auth, User, Trips, Search, Bookings.

**Pages flow**: Login/Register → Search (hotel inventory) → Reserve → Checkout (`/checkout/:tripId`) → Confirmation. Profile page shows user info and trip/booking history via `GET_ME`, `GET_MY_TRIPS`, `GET_BOOKINGS_BY_USER`.

**Backend**: Expects a GraphQL API at `localhost:8080/graphql`. The `package.json` proxy routes non-GraphQL requests to `localhost:8080` as well.
