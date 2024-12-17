<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h1 class="h3 mb-4">Login</h1>
    <div class="form-group mb-2">
      <label for="exampleInputEmail1">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Enter email"
        v-model="email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
    </div>
    <div class="form-group mb-2">
      <label for="exampleInputPassword1">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <div class="form-check mb-2">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</template>

<script lang="ts">
import type { UserAuth } from '@/types/user'
import axios from 'axios'

export default {
  name: 'LogIn',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return { email: '', password: '' }
  },
  methods: {
    async handleSubmit() {
      const data = {
        email: this.email,
        password: this.password,
      }
      try {
        const response = await axios.post(`${this.$props.url}/login`, data)
        const user: UserAuth = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          score: response.data.score,
          token: response.data.token,
        }

        this.SaveToStore(user)
        this.$emit('success', {
          success: true,
          message: 'Login efetuado com sucesso !',
          redirect: true,
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data, redirect: true })
        }
      }
    },
    SaveToStore(user: UserAuth) {
      localStorage.setItem(
        'user',
        JSON.stringify({ id: user.id, email: user.email, name: user.name, score: user.score }),
      )
      localStorage.setItem('token', user.token)
    },
  },
}
</script>
<style scoped>
.form {
  padding: 2rem;
  max-width: 50%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 2%;
}
</style>
