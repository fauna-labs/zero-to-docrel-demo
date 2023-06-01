<!--
Copyright Fauna, Inc.
SPDX-License-Identifier: MIT-0
-->
<template>
  <div class="max-w-3xl">
    <div v-if="jwt">
      <h2 class="text-2xl font-bold text-pink-500">jwt:</h2>
      <div class="text-ellipsis overflow-hidden">
        <p>{{ jwt }}</p>
      </div>
      <h2 class="mt-6 text-2xl font-bold text-pink-500">user:</h2>
      <div class="mt-2 flex flex-col">
        <div class="flex flex-row">
          <div class="text font-bold">email:</div>
          <div class="pl-4">{{ user.email }}</div>
        </div>
        <div class="flex flex-row">
          <div class="text font-bold">sub:</div>
          <div class="pl-4">{{ user.sub }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="text-2xl font-bold text-gray-300">Please log in...</h2>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Home',
  data() {
    return {
      jwt: undefined,
      user: undefined
    }
  },
  async mounted() {
    this.jwt = await this.$auth0.getAccessTokenSilently();
    this.user = this.$auth0.user;
  },
  methods: {

  },
}
</script>