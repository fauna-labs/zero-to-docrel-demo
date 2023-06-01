// Copyright Fauna, Inc.
// SPDX-License-Identifier: MIT-0

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createAuth0 } from '@auth0/auth0-vue';

createApp(App)
.use(router)
.use(
  createAuth0({
    domain: import.meta.env.VITE_APP_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_APP_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_APP_API_AUD
    }
  })
)
.mount('#app')
