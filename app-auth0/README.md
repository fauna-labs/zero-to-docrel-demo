# Sample App
This project was built with Vue 3 and Vite. Check out the [guide](https://vitejs.dev/guide/) 

## Setup
Configure the Auth0 integration using [these instructions](https://docs.fauna.com/fauna/current/integration/auth0).


Create a `.env` file with the necessary environment variables:

```
VITE_APP_AUTH0_DOMAIN=<Auth0 Domain>
VITE_APP_AUTH0_CLIENT_ID=<Auth0 ClientID>
VITE_APP_API_AUD='https://fauna.demo'
```
...where:

| Variable                 | Description | Example |
| ---                      | ---         | ---     |
| VITE_APP_AUTH0_DOMAIN    | Auth0 Domain                        | xxxxx.auth0.com |
| VITE_APP_AUTH0_CLIENT_ID | Client ID                           | fMHh99Dxi2ZkJQK3fOPrF1DxnjGkOEEk |
| VITE_APP_API_AUD         | Use the **Audience** value obtained from **Step 1, #4** in the [Auth0 configuration documentation](https://docs.fauna.com/fauna/current/integration/auth0)   | https://db.fauna.com/db/yiddqinf6yyre |


## Run locally

```
npm run dev
```

## Build

```
npm install && run build
```