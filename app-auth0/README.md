# Sample App
This project was built with Vue 3 and Vite. Check out the [guide](https://vitejs.dev/guide/) 

## Setup
Create a `.env` file with the necessary environment variables:

```
VITE_APP_APIGATEWAYURL=<API Gateway URL>
VITE_APP_AUTH0_DOMAIN=<Auth0 Domain>
VITE_APP_AUTH0_CLIENT_ID=<Auth0 ClientID>
VITE_APP_API_AUD='https://fauna.demo'
```
...where:

| Variable                 | Description | Example |
| ---                      | ---         | ---     |
| VITE_APP_APIGATEWAYURL   | The API Gateway URL                 | https://xxxxxx.execute-api.us-east-1.amazonaws.com |
| VITE_APP_AUTH0_DOMAIN    | Auth0 Domain                        | xxxxx.auth0.com |
| VITE_APP_AUTH0_CLIENT_ID | Client ID                           | fMHh99Dxi2ZkJQK3fOPrF1DxnjGkOEEk |
| VITE_APP_API_AUD         | Use the value "https://fauna.demo"  | https://fauna.demo |


## Run locally

```
npm run dev
```

## Build

```
npm install && run build
```